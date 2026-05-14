"use client";

import { Column, Heading, Text } from "@once-ui-system/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const REDIRECT_DELAY_MS = 1500;

export default function ResumeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const anchor = document.createElement("a");
    anchor.href = "/api/resume";
    anchor.rel = "noopener";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    const timer = window.setTimeout(() => {
      router.replace("/about");
    }, REDIRECT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <Column
      maxWidth="m"
      paddingY="xl"
      gap="m"
      horizontal="center"
      vertical="center"
      style={{ minHeight: "60vh", textAlign: "center" }}
    >
      <Heading variant="display-strong-s">Downloading resume…</Heading>
      <Text onBackground="neutral-weak">
        Your download should begin automatically. Redirecting you to the about page.
      </Text>
      <Text onBackground="neutral-weak" variant="body-default-s">
        If the download didn't start,{" "}
        <a href="/api/resume" style={{ textDecoration: "underline" }}>
          click here
        </a>
        .
      </Text>
    </Column>
  );
}
