import { Cable, CircuitBoard, Lightbulb, PlugZap, ShieldCheck, Wrench } from "lucide-react";

export function ServiceIcon({ icon, size = 28 }: { icon?: string; size?: number }) {
  const props = { size, strokeWidth: 1.8 };
  switch (icon) {
    case "wrench": return <Wrench {...props} />;
    case "panel": return <CircuitBoard {...props} />;
    case "lightbulb": return <Lightbulb {...props} />;
    case "cable": return <Cable {...props} />;
    case "shield": return <ShieldCheck {...props} />;
    default: return <PlugZap {...props} />;
  }
}
