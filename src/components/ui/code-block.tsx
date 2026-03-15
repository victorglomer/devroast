import { codeToHtml } from "shiki";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export async function CodeBlock({
  code,
  language = "javascript",
  filename,
  className,
}: CodeBlockProps) {
  const html = await codeToHtml(code.trim(), {
    lang: language,
    theme: "vesper",
  });

  return (
    <div
      className={cn(
        "w-full rounded-md border border-[#2A2A2A] overflow-hidden bg-[#111111]",
        className,
      )}
    >
      <div
        className="flex items-center gap-3 h-10 px-4 border-b border-[#2A2A2A]"
        data-header
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        {filename && (
          <>
            <span className="flex-1" />
            <span className="text-xs text-neutral-500 font-mono">
              {filename}
            </span>
          </>
        )}
      </div>
      <div
        className="font-mono text-sm [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-4 [&_pre]:!overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
