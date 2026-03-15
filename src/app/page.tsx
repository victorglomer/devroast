"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

const leaderboardData = [
  {
    id: 1,
    rank: "#1",
    score: "1.2",
    code: "function calculate() {",
    lang: "javascript",
  },
  {
    id: 2,
    rank: "#2",
    score: "2.8",
    code: "var x = new Array(100)",
    lang: "javascript",
  },
  {
    id: 3,
    rank: "#3",
    score: "3.1",
    code: "if (true) { return",
    lang: "javascript",
  },
];

export default function Home() {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(false);
  return (
    <div className="flex flex-col gap-8 py-20 px-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-8">
        {/* Title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-mono text-[#FAFAFA]">
            <span className="text-[#10B981]">{"//"}</span> drop your code below
            and we&apos;ll rate it — brutally honest or full roast mode
          </h1>
        </div>

        {/* Code Editor */}
        <div className="w-[780px] flex flex-col rounded-lg border border-[#2A2A2A] overflow-hidden">
          {/* Editor Header */}
          <div className="flex items-center justify-between h-10 px-4 border-b border-[#2A2A2A]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
              <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <span className="w-3 h-3 rounded-full bg-[#10B981]" />
            </div>
          </div>

          {/* Code Input Area */}
          <textarea
            className="w-full h-[360px] p-4 bg-[#111111] text-[#FAFAFA] font-mono text-sm resize-none focus:outline-none placeholder:text-[#4B5563]"
            placeholder={"// paste your code here..."}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {/* Actions Bar */}
        <div className="w-[780px] flex items-center justify-between">
          <Toggle
            checked={roastMode}
            onChange={setRoastMode}
            label="roast mode"
          />
          <Button disabled={!code.trim()}>Roast My Code</Button>
        </div>

        {/* Footer Stats */}
        <p className="text-xs font-mono text-[#4B5563]">
          2,847 codes roasted · avg score: 4.2/10
        </p>
      </section>

      {/* Leaderboard Preview */}
      <section className="flex flex-col gap-6 mt-8">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold font-mono text-[#FAFAFA]">
            <span className="text-[#10B981]">{"//"}</span> shame_leaderboard
          </h2>
          <a
            href="/leaderboard"
            className="px-3 py-1.5 text-xs font-mono text-[#6B7280] border border-[#2A2A2A] rounded hover:text-[#FAFAFA] transition-colors"
          >
            view all &gt;&gt;
          </a>
        </div>

        <p className="text-xs font-mono text-[#4B5563]">
          {"// the worst code on the internet, ranked by shame"}
        </p>

        {/* Table */}
        <div className="flex flex-col rounded-lg border border-[#2A2A2A] overflow-hidden">
          {/* Header */}
          <div className="flex items-center h-10 px-5 bg-[#0F0F0F] border-b border-[#2A2A2A]">
            <span className="w-[50px] text-xs font-mono text-[#6B7280]">
              rank
            </span>
            <span className="w-[70px] text-xs font-mono text-[#6B7280]">
              score
            </span>
            <span className="flex-1 text-xs font-mono text-[#6B7280]">
              code
            </span>
            <span className="w-[100px] text-xs font-mono text-[#6B7280]">
              lang
            </span>
          </div>

          {/* Rows */}
          {leaderboardData.map((row) => (
            <div
              key={row.id}
              className="flex items-center px-5 py-4 border-b border-[#2A2A2A] last:border-b-0"
            >
              <span className="w-[50px] text-sm font-mono text-[#6B7280]">
                {row.rank}
              </span>
              <span className="w-[70px] text-sm font-bold font-mono text-[#EF4444]">
                {row.score}
              </span>
              <span className="flex-1 text-sm font-mono text-[#6B7280] truncate">
                {row.code}
              </span>
              <span className="w-[100px] text-xs font-mono text-[#4B5563]">
                {row.lang}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
