import { Badge } from "@/components/ui/badge"

interface VerificationBadgeProps {
  status: "verified" | "unverified" | "community"
  className?: string
}

export function VerificationBadge({ status, className }: VerificationBadgeProps) {
  switch (status) {
    case "verified":
      return <Badge variant="success" className={className}>Verified</Badge>
    case "community":
      return <Badge variant="info" className={className}>Community</Badge>
    case "unverified":
    default:
      return <Badge variant="outline" className={className}>Unverified</Badge>
  }
}
