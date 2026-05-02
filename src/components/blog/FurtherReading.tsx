"use client";

import { useState, type ReactNode } from "react";
import { Accordion, Column, Heading } from "@once-ui-system/core";

interface FurtherReadingProps {
  /**
   * Heading shown above the collapsed accordion, also acts as the click
   * target. Defaults to "Sources & Further Reading".
   */
  title?: string;
  children: ReactNode;
}

/**
 * Collapsible "Sources & Further Reading" block for blog posts. Default
 * state is closed so the section doesn't compete with the post body for
 * the reader's attention; one click expands it for the reader who wants
 * to drill into source material.
 */
export function FurtherReading({
  title = "Sources & Further Reading",
  children,
}: FurtherReadingProps) {
  const [open, setOpen] = useState(false);

  return (
    <Column fillWidth marginTop="32" marginBottom="24">
      <Accordion
        radius="m"
        size="m"
        open={open}
        onToggle={() => setOpen((prev) => !prev)}
        title={
          <Heading as="h2" variant="heading-strong-l">
            {title}
          </Heading>
        }
      >
        <Column gap="20" paddingY="12">
          {children}
        </Column>
      </Accordion>
    </Column>
  );
}
