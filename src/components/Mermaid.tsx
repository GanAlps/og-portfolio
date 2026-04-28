"use client";

import { useEffect, useId, useState } from "react";

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "inherit",
        });
        const { svg } = await mermaid.render(`mermaid-${id}`, chart.trim());
        if (!cancelled) setSvg(svg);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre style={{ color: "var(--color-danger-on-background-strong, #d33)", whiteSpace: "pre-wrap" }}>
        Mermaid render error: {error}
      </pre>
    );
  }

  if (!svg) {
    return <div style={{ minHeight: "120px" }} aria-label="Loading diagram" />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        overflowX: "auto",
        margin: "16px 0",
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
