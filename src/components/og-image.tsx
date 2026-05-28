import type { CSSProperties } from "react";

interface OgImageProps {
  score: number;
  verdict: string;
  roastTitle: string;
  language: string;
  lineCount: number;
}

function formatScore(score: number): string {
  return score % 1 === 0 ? score.toFixed(1) : score.toString();
}

function getVerdictColor(score: number): string {
  if (score < 4) return "#EF4444";
  if (score < 7) return "#F59E0B";
  return "#10B981";
}

const containerStyle: CSSProperties = {
  width: 1200,
  height: 630,
  backgroundColor: "#0A0A0A",
  padding: 64,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 28,
};

const logoRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const logoChevronStyle: CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 24,
  fontWeight: 700,
  color: "#10B981",
};

const logoTextStyle: CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 20,
  fontWeight: 500,
  color: "#FAFAFA",
};

const scoreRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end",
  gap: 4,
};

const scoreValueStyle: CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 160,
  fontWeight: 900,
  lineHeight: 1,
  color: "#F59E0B",
};

const scoreDividerStyle: CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 56,
  color: "#4B5563",
};

const verdictRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  justifyContent: "flex-end",
};

function getVerdictDotStyle(color: string): CSSProperties {
  return {
    width: 12,
    height: 12,
    borderRadius: "50%",
    backgroundColor: color,
    flexShrink: 0,
  };
}

function getVerdictTextStyle(color: string): CSSProperties {
  return {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 20,
    color,
  };
}

const metaStyle: CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 16,
  color: "#4B5563",
  textAlign: "center",
};

const quoteStyle: CSSProperties = {
  fontFamily: "Geist, sans-serif",
  fontSize: 22,
  lineHeight: 1.5,
  color: "#FAFAFA",
  textAlign: "center",
  maxWidth: 800,
  alignSelf: "center",
};

export function OgImage({
  score,
  verdict,
  roastTitle,
  language,
  lineCount,
}: OgImageProps) {
  const verdictColor = getVerdictColor(score);

  return (
    <div style={containerStyle}>
      <div style={logoRowStyle}>
        <span style={logoChevronStyle}>{">"}</span>
        <span style={logoTextStyle}>devroast</span>
      </div>

      <div style={scoreRowStyle}>
        <span style={scoreValueStyle}>{formatScore(score)}</span>
        <span style={scoreDividerStyle}>/10</span>
      </div>

      {verdict && (
        <div style={verdictRowStyle}>
          <span style={getVerdictDotStyle(verdictColor)} />
          <span style={getVerdictTextStyle(verdictColor)}>{verdict}</span>
        </div>
      )}

      <div style={metaStyle}>
        {language ? `lang: ${language} \u00B7 ` : ""}
        {lineCount} lines
      </div>

      <div style={quoteStyle}>&ldquo;{roastTitle || "\u2014"}&rdquo;</div>
    </div>
  );
}
