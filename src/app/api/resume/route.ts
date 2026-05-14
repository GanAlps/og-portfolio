import { NextResponse } from "next/server";

const DOWNLOAD_FILENAME = "Osho_Gupta_Resume.pdf";

function extractDriveFileId(input: string): string | null {
  const fileMatch = input.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) return fileMatch[1];
  const idParam = input.match(/[?&]id=([^&]+)/);
  if (idParam) return idParam[1];
  if (/^[A-Za-z0-9_-]{20,}$/.test(input)) return input;
  return null;
}

export async function GET() {
  const source = process.env.RESUME_DRIVE_URL;
  if (!source) {
    return NextResponse.json(
      { error: "Resume is not configured. Set RESUME_DRIVE_URL." },
      { status: 503 },
    );
  }

  const fileId = extractDriveFileId(source);
  if (!fileId) {
    return NextResponse.json(
      { error: "Could not parse a Google Drive file ID from RESUME_DRIVE_URL." },
      { status: 500 },
    );
  }

  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  const upstream = await fetch(downloadUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioResumeProxy/1.0)" },
    redirect: "follow",
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: `Failed to fetch resume from source (${upstream.status}).` },
      { status: 502 },
    );
  }

  const upstreamContentType = upstream.headers.get("content-type") ?? "";
  if (upstreamContentType.startsWith("text/html")) {
    return NextResponse.json(
      {
        error:
          "Google Drive returned an HTML confirmation page. Make sure the file is shared as 'Anyone with the link can view' and is under ~100MB.",
      },
      { status: 502 },
    );
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": upstreamContentType || "application/pdf",
      "Content-Disposition": `attachment; filename="${DOWNLOAD_FILENAME}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
