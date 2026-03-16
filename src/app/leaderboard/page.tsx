import { CodeBlock } from "@/components/ui/code-block";

export const metadata = {
  title: "Shame Leaderboard - Devroast",
  description: "The most roasted code on the internet, ranked by shame",
};

const MOCK_LEADERBOARD = [
  {
    id: "1",
    rank: 1,
    score: "1.2",
    username: "anon_001",
    language: "javascript",
    lineCount: 3,
    code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
  },
  {
    id: "2",
    rank: 2,
    score: "2.1",
    username: "rustacean_42",
    language: "rust",
    lineCount: 5,
    code: `fn main() {
    let x = 1;
    println!("{:?}", x);
    unsafe { std::mem::zeroed() }
}`,
  },
  {
    id: "3",
    rank: 3,
    score: "2.8",
    username: "python_guru",
    language: "python",
    lineCount: 4,
    code: `import os
eval(input())
os.system("rm -rf /")
# TODO: fix permission error`,
  },
  {
    id: "4",
    rank: 4,
    score: "3.5",
    username: "go_dev",
    language: "go",
    lineCount: 6,
    code: `func main() {
    err := error(nil)
    if err != nil {
        panic(err)
    }
    // TODO: handle error
}`,
  },
  {
    id: "5",
    rank: 5,
    score: "4.2",
    username: "java_dev",
    language: "java",
    lineCount: 8,
    code: `public class Main {
    public static void main(String[] args) {
        // TODO: implement
        while(true) {}
    }
}`,
  },
];

export default async function LeaderboardPage() {
  const totalSubmissions = 2847;
  const avgScore = "4.2";

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="flex flex-col gap-10 px-20 py-10 max-w-5xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold font-mono text-[#10B981]">
              &gt;
            </span>
            <h1 className="text-3xl font-bold font-mono text-[#FAFAFA]">
              shame_leaderboard
            </h1>
          </div>
          <p className="text-sm font-mono text-[#6B7280]">
            {/* the most roasted code on the internet */}
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-[#4B5563]">
            <span>{totalSubmissions.toLocaleString()} submissions</span>
            <span>·</span>
            <span>avg score: {avgScore}/10</span>
          </div>
        </section>

        {/* Leaderboard Entries */}
        <div className="flex flex-col gap-5">
          {MOCK_LEADERBOARD.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col rounded-md border border-[#2A2A2A] overflow-hidden bg-[#0F0F0F]"
            >
              {/* Meta Row */}
              <div className="flex items-center justify-between h-12 px-5 border-b border-[#2A2A2A]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-mono text-[#4B5563]">#</span>
                    <span className="text-sm font-bold font-mono text-[#F59E0B]">
                      {entry.rank}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-[#4B5563]">
                      score:
                    </span>
                    <span className="text-sm font-bold font-mono text-[#EF4444]">
                      {entry.score}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#6B7280]">
                    {entry.language}
                  </span>
                  <span className="text-xs font-mono text-[#4B5563]">
                    {entry.lineCount} lines
                  </span>
                </div>
              </div>

              {/* Code Block */}
              <CodeBlock
                code={entry.code}
                language={entry.language}
                showHeader={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
