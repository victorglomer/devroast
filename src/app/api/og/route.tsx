import { ImageResponse } from "takumi-js/response";
import { OgImage } from "@/components/og-image";
import { getSubmissionWithRoast } from "@/db/queries";
import { loadJetBrainsMonoFonts } from "@/lib/og-fonts";

export const runtime = "nodejs";

async function fallbackResponse(): Promise<ImageResponse> {
  const response = new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        backgroundColor: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 28,
            fontWeight: 700,
            color: "#10B981",
          }}
        >
          {">"}
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 24,
            fontWeight: 500,
            color: "#FAFAFA",
          }}
        >
          devroast
        </span>
      </div>
      <span
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: 36,
          fontWeight: 600,
          color: "#A1A1AA",
        }}
      >
        Code Review Roast
      </span>
    </div>,
    { width: 1200, height: 630 },
  );

  response.headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return response;
}

export async function GET(request: Request) {
  try {
    const submissionId = new URL(request.url).searchParams.get("submissionId");

    if (!submissionId) {
      return fallbackResponse();
    }

    const data = await getSubmissionWithRoast(submissionId);

    if (!data) {
      return fallbackResponse();
    }

    const fonts = await loadJetBrainsMonoFonts();
    if (fonts.length === 0) {
      throw new Error("Failed to load JetBrains Mono fonts for OG image");
    }

    const response = new ImageResponse(
      <OgImage
        score={Number(data.score)}
        verdict={data.verdict}
        roastTitle={data.roastTitle}
        language={data.language}
        lineCount={data.lineCount}
      />,
      { width: 1200, height: 630, fonts },
    );

    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable",
    );

    return response;
  } catch {
    return fallbackResponse();
  }
}
