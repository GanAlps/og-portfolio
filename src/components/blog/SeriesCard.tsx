import { Card, Column, Heading, Row, Text, Tag, Icon } from "@once-ui-system/core";
import type { Series } from "@/resources/series";

interface SeriesCardProps {
  series: Series;
}

export function SeriesCard({ series }: SeriesCardProps) {
  const href = `/blog/series/${series.slug}`;

  return (
    <Card
      fillWidth
      href={href}
      transition="micro-medium"
      direction="column"
      border="brand-alpha-medium"
      background="brand-alpha-weak"
      padding="32"
      radius="l"
      gap="20"
      cursor="interactive"
    >
      <Row gap="12" vertical="center" wrap>
        <Tag variant="brand" size="s">
          Learning Series
        </Tag>
        <Text variant="label-default-s" onBackground="neutral-weak">
          {series.totalPosts} posts · Inference → Training → Multi-Modal
        </Text>
      </Row>
      <Column gap="8">
        <Heading variant="display-strong-s" wrap="balance">
          {series.title}
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-medium" wrap="balance">
          {series.tagline}
        </Text>
      </Column>
      <Row gap="8" vertical="center" onBackground="brand-medium">
        <Text variant="label-strong-m">Start the course</Text>
        <Icon name="chevronRight" size="s" />
      </Row>
    </Card>
  );
}
