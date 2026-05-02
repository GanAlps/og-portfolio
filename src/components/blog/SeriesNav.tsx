import { Card, Column, Icon, Row, SmartLink, Text } from "@once-ui-system/core";
import type { Series } from "@/resources/series";

type SeriesPostSummary = {
  slug: string;
  metadata: {
    title: string;
    part?: number;
    partTitle?: string;
  };
};

interface SeriesBreadcrumbProps {
  series: Series;
  part: number;
}

export function SeriesBreadcrumb({ series, part }: SeriesBreadcrumbProps) {
  return (
    <Row gap="8" vertical="center" wrap>
      <SmartLink href="/blog">
        <Text variant="label-default-s" onBackground="neutral-weak">
          Blog
        </Text>
      </SmartLink>
      <Text variant="label-default-s" onBackground="neutral-weak">
        ›
      </Text>
      <SmartLink href={`/blog/series/${series.slug}`}>
        <Text variant="label-strong-s" onBackground="brand-medium">
          {series.title}
        </Text>
      </SmartLink>
      <Text variant="label-default-s" onBackground="neutral-weak">
        ›
      </Text>
      <Text variant="label-default-s" onBackground="neutral-weak">
        Part {part} of {series.totalPosts}
      </Text>
    </Row>
  );
}

interface SeriesPagerProps {
  series: Series;
  prev?: SeriesPostSummary;
  next?: SeriesPostSummary;
}

function PagerCard({
  post,
  direction,
}: {
  post: SeriesPostSummary;
  direction: "prev" | "next";
}) {
  const label = direction === "prev" ? "← Previous" : "Next →";
  const partLabel =
    typeof post.metadata.part === "number" ? `Part ${post.metadata.part}` : undefined;
  const display = post.metadata.partTitle || post.metadata.title;

  return (
    <Card
      fillWidth
      href={`/blog/${post.slug}`}
      transition="micro-medium"
      direction="column"
      border="neutral-alpha-medium"
      background="surface"
      padding="20"
      radius="l"
      gap="8"
      cursor="interactive"
      horizontal={direction === "next" ? "end" : "start"}
    >
      <Text
        variant="label-default-s"
        onBackground="neutral-weak"
        align={direction === "next" ? "right" : "left"}
      >
        {label}
      </Text>
      {partLabel && (
        <Text
          variant="label-strong-s"
          onBackground="brand-medium"
          align={direction === "next" ? "right" : "left"}
        >
          {partLabel}
        </Text>
      )}
      <Text
        variant="heading-strong-s"
        wrap="balance"
        align={direction === "next" ? "right" : "left"}
      >
        {display}
      </Text>
    </Card>
  );
}

export function SeriesPager({ series, prev, next }: SeriesPagerProps) {
  return (
    <Column fillWidth gap="20">
      <Row fillWidth gap="16" s={{ direction: "column" }}>
        {prev ? <PagerCard post={prev} direction="prev" /> : <Row fillWidth />}
        {next ? <PagerCard post={next} direction="next" /> : <Row fillWidth />}
      </Row>
      <Row horizontal="center">
        <SmartLink href={`/blog/series/${series.slug}`}>
          <Row gap="8" vertical="center">
            <Icon name="chevronLeft" size="xs" />
            <Text variant="label-strong-s" onBackground="brand-medium">
              Back to {series.title} overview
            </Text>
          </Row>
        </SmartLink>
      </Row>
    </Column>
  );
}
