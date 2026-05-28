import type { Font } from "takumi-js";

interface FontFaceDecl {
  weight: number;
  style: string;
  url: string;
}

export function parseGoogleFontsCss(css: string): FontFaceDecl[] {
  const blocks = css.match(/@font-face\s*\{[^}]*\}/g);
  if (!blocks) return [];

  return blocks
    .map((block) => {
      const familyMatch = block.match(/font-family:\s*['"]([^'"]+)['"]/);
      if (!familyMatch) return null;

      const family = familyMatch[1].toLowerCase();
      if (!family.includes("jetbrains mono")) return null;

      const weightMatch = block.match(/font-weight:\s*(\d+)/);
      const styleMatch = block.match(/font-style:\s*(\w+)/);
      const urlMatch = block.match(/src:\s*url\(([^)]+)\)/);

      if (!weightMatch || !urlMatch) return null;

      return {
        weight: Number(weightMatch[1]),
        style: styleMatch?.[1] ?? "normal",
        url: urlMatch[1],
      };
    })
    .filter((decl): decl is FontFaceDecl => decl !== null);
}

export async function loadJetBrainsMonoFonts(): Promise<Font[]> {
  const cssUrl =
    "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;900&display=swap";

  const cssResponse = await fetch(cssUrl);
  const css = await cssResponse.text();

  const decls = parseGoogleFontsCss(css);

  const fontPromises = decls.map(async (decl) => {
    const response = await fetch(decl.url);
    const data = await response.arrayBuffer();

    return {
      name: "JetBrains Mono",
      data,
      weight: decl.weight,
      style: decl.style,
    } satisfies Font;
  });

  return Promise.all(fontPromises);
}
