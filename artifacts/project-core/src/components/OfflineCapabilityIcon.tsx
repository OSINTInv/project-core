import { BatteryFull, BatteryMedium, Battery } from "lucide-react"

interface OfflineCapabilityIconProps {
  capability: "full" | "partial" | "reference"
  className?: string
}

export function OfflineCapabilityIcon({ capability, className }: OfflineCapabilityIconProps) {
  switch (capability) {
    case "full":
      return <BatteryFull className={`text-[#22C55E] ${className}`} title="Full Offline Capability" />
    case "partial":
      return <BatteryMedium className={`text-primary ${className}`} title="Partial Offline Capability" />
    case "reference":
    default:
      return <Battery className={`text-muted-foreground ${className}`} title="Reference Only" />
  }
}
