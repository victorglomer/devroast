"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

export function HeroSection() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: "javascript",
          roastMode: roastMode ? "roast" : "normal",
        }),
      });

      const data = await res.json();

      if (data.submissionId) {
        router.push(`/results/${data.submissionId}`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-mono text-[#FAFAFA]">
          <span className="text-[#10B981]">{"//"}</span> drop your code below
          and we&apos;ll rate it — brutally honest or full roast mode
        </h1>
      </div>

      <div className="w-[780px] flex flex-col rounded-lg border border-[#2A2A2A] overflow-hidden">
        <div className="flex items-center justify-between h-10 px-4 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span className="w-3 h-3 rounded-full bg-[#10B981]" />
          </div>
        </div>

        <textarea
          className="w-full h-[360px] p-4 bg-[#111111] text-[#FAFAFA] font-mono text-sm resize-none focus:outline-none placeholder:text-[#4B5563]"
          placeholder={"// paste your code here..."}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <div className="w-[780px] flex items-center justify-between">
        <Toggle
          checked={roastMode}
          onChange={setRoastMode}
          label="roast mode"
        />
        <Button disabled={!code.trim() || loading} onClick={handleSubmit}>
          {loading ? "Roasting..." : "Roast My Code"}
        </Button>
      </div>
    </section>
  );
}
