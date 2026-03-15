"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

export function ToggleDemo() {
  const [toggleState, setToggleState] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">States</h3>
        <div className="flex flex-wrap gap-4">
          <Toggle checked={false} label="roast mode" />
          <Toggle checked={true} label="roast mode" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Controlled</h3>
        <div className="flex flex-wrap gap-4">
          <Toggle
            checked={toggleState}
            onChange={setToggleState}
            label="roast mode"
          />
        </div>
      </div>
    </div>
  );
}
