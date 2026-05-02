import { notFound } from "next/navigation";
import {
  Card,
  Column,
  Heading,
  Meta,
  Row,
  Schema,
  SmartLink,
  Tag,
  Text,
} from "@once-ui-system/core";
import { baseURL, blog, person, seriesBySlug } from "@/resources";
import { getSeriesPosts } from "@/utils/utils";
import { formatDate } from "@/utils/formatDate";

export async function generateStaticParams() {
  return Object.keys(seriesBySlug).map((seriesSlug) => ({ seriesSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seriesSlug: string }>;
}) {
  const { seriesSlug } = await params;
  const series = seriesBySlug[seriesSlug];
  if (!series) return {};

  return Meta.generate({
    title: series.title,
    description: series.tagline,
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(series.title)}`,
    path: `${blog.path}/series/${series.slug}`,
  });
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ seriesSlug: string }>;
}) {
  const { seriesSlug } = await params;
  const series = seriesBySlug[seriesSlug];

  if (!series) {
    notFound();
  }

  const posts = getSeriesPosts(seriesSlug);
  const postsByPart = new Map<number, (typeof posts)[number]>();
  for (const post of posts) {
    if (typeof post.metadata.part === "number") {
      postsByPart.set(post.metadata.part, post);
    }
  }

  return (
    <Column maxWidth="m" paddingTop="24" gap="40">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={series.title}
        description={series.tagline}
        path={`${blog.path}/series/${series.slug}`}
        image={`/api/og/generate?title=${encodeURIComponent(series.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <Column gap="20" paddingX="24">
        <Row gap="12" vertical="center">
          <SmartLink href="/blog">
            <Text variant="label-default-s" onBackground="neutral-weak">
              ← Blog
            </Text>
          </SmartLink>
          <Tag variant="brand" size="s">
            Learning Series
          </Tag>
        </Row>
        <Heading variant="display-strong-l" wrap="balance">
          {series.title}
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-medium" wrap="balance">
          {series.tagline}
        </Text>
        <Column gap="12" marginTop="12">
          {series.intro.map((paragraph) => (
            <Text
              key={paragraph.slice(0, 32)}
              variant="body-default-m"
              onBackground="neutral-medium"
              style={{ lineHeight: "175%" }}
            >
              {paragraph}
            </Text>
          ))}
        </Column>
      </Column>

      <Column gap="48" paddingX="24">
        {series.parts.map((part) => {
          const partPosts: typeof posts = [];
          for (let i = part.partRange[0]; i <= part.partRange[1]; i++) {
            const p = postsByPart.get(i);
            if (p) partPosts.push(p);
          }
          return (
            <Column key={part.label} gap="20">
              <Column gap="8">
                <Heading as="h2" variant="heading-strong-xl">
                  {part.label}
                </Heading>
                <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
                  {part.description}
                </Text>
              </Column>

              <Column gap="12">
                {Array.from(
                  { length: part.partRange[1] - part.partRange[0] + 1 },
                  (_, i) => part.partRange[0] + i,
                ).map((partNumber) => {
                  const post = postsByPart.get(partNumber);
                  return (
                    <PostRow
                      key={partNumber}
                      partNumber={partNumber}
                      post={post}
                    />
                  );
                })}
              </Column>
            </Column>
          );
        })}
      </Column>
    </Column>
  );
}

function PostRow({
  partNumber,
  post,
}: {
  partNumber: number;
  post?: { slug: string; metadata: { title: string; partTitle?: string; summary: string; publishedAt?: string } };
}) {
  if (!post) {
    return (
      <Card
        fillWidth
        direction="row"
        border="neutral-alpha-weak"
        background="transparent"
        padding="20"
        radius="l"
        gap="20"
        vertical="center"
      >
        <PartBadge n={partNumber} muted />
        <Column gap="4" fillWidth>
          <Text variant="heading-strong-s" onBackground="neutral-weak">
            Coming soon
          </Text>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Part {partNumber} is in progress.
          </Text>
        </Column>
      </Card>
    );
  }

  const display = post.metadata.partTitle || post.metadata.title;
  const date = post.metadata.publishedAt ? formatDate(post.metadata.publishedAt, false) : null;

  return (
    <Card
      fillWidth
      href={`/blog/${post.slug}`}
      direction="row"
      border="neutral-alpha-medium"
      background="surface"
      padding="20"
      radius="l"
      gap="20"
      vertical="center"
      transition="micro-medium"
      cursor="interactive"
    >
      <PartBadge n={partNumber} />
      <Column gap="8" fillWidth>
        <Text variant="heading-strong-s" wrap="balance">
          {display}
        </Text>
        <Text variant="body-default-s" onBackground="neutral-weak" wrap="balance">
          {post.metadata.summary}
        </Text>
        {date && (
          <Text variant="label-default-xs" onBackground="neutral-weak">
            {date}
          </Text>
        )}
      </Column>
    </Card>
  );
}

function PartBadge({ n, muted = false }: { n: number; muted?: boolean }) {
  return (
    <Column
      width="48"
      height="48"
      radius="full"
      background={muted ? "neutral-alpha-weak" : "brand-alpha-medium"}
      border={muted ? "neutral-alpha-weak" : "brand-alpha-medium"}
      horizontal="center"
      vertical="center"
    >
      <Text
        variant="label-strong-m"
        onBackground={muted ? "neutral-weak" : "brand-strong"}
      >
        {String(n).padStart(2, "0")}
      </Text>
    </Column>
  );
}
