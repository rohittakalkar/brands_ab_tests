import { Settings, Cpu, Home, Network, Pipette, Wrench, FlaskConical, Sun, Zap, Layers, Droplet, Wind, Snowflake, Cable, Laptop, Smartphone } from "lucide-react";

const ICONS: Record<string, typeof Settings> = { Settings, Cpu, Home, Network, Pipette, Wrench, FlaskConical, Sun, Zap, Droplet, Wind, Snowflake, Cable, Laptop, Smartphone };

export default function CategoryIcon({ icon, className = "size-5" }: { icon: string; className?: string }) {
  const Icon = ICONS[icon] || Layers;
  return <Icon className={className} aria-hidden="true" />;
}
