import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";
import { ToggleDemo } from "./toggle-demo";

const buttonVariants = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const;
const buttonSizes = ["default", "sm", "lg", "icon"] as const;
const badgeVariants = ["critical", "warning", "good", "verdict"] as const;

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

export default async function ComponentsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] container mx-auto py-16 space-y-16">
      <div>
        <h1 className="text-3xl font-bold mb-4 text-[#FAFAFA]">
          UI Components
        </h1>
        <p className="text-[#6B7280]">
          Showcase page for devroast UI components
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-[#FAFAFA]">Button</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-[#FAFAFA]">Variants</h3>
            <div className="flex flex-wrap gap-4">
              {buttonVariants.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[#FAFAFA]">Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              {buttonSizes.map((size) => (
                <Button key={size} size={size}>
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[#FAFAFA]">States</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          <div>
            <h3 className="text-[#FAFAFA]">With Icon</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Roast My Code</Button>
              <Button variant="outline">Get Started</Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Toggle</h2>
        <ToggleDemo />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Badge</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-[#FAFAFA]">Variants</h3>
            <div className="flex flex-wrap gap-4">
              {badgeVariants.map((variant) => (
                <Badge key={variant} variant={variant}>
                  {variant}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[#FAFAFA]">Without Dot</h3>
            <div className="flex flex-wrap gap-4">
              <Badge variant="critical" showDot={false}>
                critical
              </Badge>
              <Badge variant="warning" showDot={false}>
                warning
              </Badge>
              <Badge variant="good" showDot={false}>
                good
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">CodeBlock</h2>
        <p className="text-[#6B7280] mb-4">
          Server component with Shiki (vesper theme)
        </p>
        <CodeBlock code={sampleCode} filename="calculate.js" />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Card</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-[#FAFAFA]">Default</h3>
            <Card className="max-w-md">
              <CardHeader>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
              </CardHeader>
              <CardTitle>using var instead of const/let</CardTitle>
              <CardDescription>
                The var keyword is function-scoped rather than block-scoped,
                which can lead to unexpected behavior and bugs.
              </CardDescription>
            </Card>
          </div>

          <div>
            <h3 className="text-[#FAFAFA]">Sizes</h3>
            <div className="flex flex-wrap gap-4">
              <Card padding="sm" className="max-w-md">
                <CardTitle>Small padding</CardTitle>
              </Card>
              <Card padding="lg" className="max-w-md">
                <CardTitle>Large padding</CardTitle>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">ScoreRing</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-[#FAFAFA]">Default</h3>
            <div className="flex flex-wrap gap-8 items-center">
              <ScoreRing score={2.1} />
              <ScoreRing score={5.5} />
              <ScoreRing score={8.9} />
            </div>
          </div>

          <div>
            <h3 className="text-[#FAFAFA]">Custom size</h3>
            <div className="flex flex-wrap gap-8 items-center">
              <ScoreRing score={7.5} size={120} />
              <ScoreRing score={7.5} size={200} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
