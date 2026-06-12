import { notFound } from "next/navigation";
import { cache } from "react";
import { getSubmissionWithRoast } from "@/db/queries";

const getSubmission = cache(getSubmissionWithRoast);

export default async function OgImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getSubmission(id);

  if (!result) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6">
        <img
          src={`/api/og?submissionId=${encodeURIComponent(id)}`}
          alt={`Roast result for ${result.language} code`}
          className="rounded-lg shadow-2xl max-w-full h-auto"
          style={{ maxHeight: "80vh" }}
        />
        <a
          href={`/results/${id}`}
          className="text-sm font-mono text-[#6B7280] hover:text-[#FAFAFA] transition-colors"
        >
          view full roast &rarr;
        </a>
      </div>
    </div>
  );
}
