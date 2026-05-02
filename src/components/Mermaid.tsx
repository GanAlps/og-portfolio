"use client";

import { useEffect, useId, useState } from "react";

const DEFAULT_MAX_WIDTH = "520px";

interface MermaidProps {
  chart: string;
  /**
   * Caps the rendered diagram's width. Mermaid emits SVGs at their natural
   * intrinsic size, which can exceed the blog text column for complex flows.
   * Defaults to a value that fits comfortably within a 700px column with
   * room to breathe; pass an explicit string (e.g. "640px", "80%") to
   * widen for wider charts or narrow for very small ones.
   */
  maxWidth?: string;
}

function makeSvgResponsive(svg: string): string {
  // mermaid emits <svg width="NNN" height="MMM" ...> with absolute pixel
  // sizes. Strip those, keep the viewBox (mermaid adds it), and force the
  // SVG to scale to its container.
  let out = svg.replace(/<svg([^>]*?)\swidth="[^"]*"/, "<svg$1");
  out = out.replace(/<svg([^>]*?)\sheight="[^"]*"/, "<svg$1");
  out = out.replace(/<svg([^>]*?)\sstyle="[^"]*"/, "<svg$1");
  out = out.replace(
    /<svg([^>]*?)>/,
    '<svg$1 style="max-width: 100%; width: 100%; height: auto;">',
  );
  return out;
}

export function Mermaid({ chart, maxWidth = DEFAULT_MAX_WIDTH }: MermaidProps) {
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
        margin: "16px 0",
      }}
    >
      <div
        style={{ maxWidth, width: "100%" }}
        dangerouslySetInnerHTML={{ __html: makeSvgResponsive(svg) }}
      />
    </div>
  );
}
