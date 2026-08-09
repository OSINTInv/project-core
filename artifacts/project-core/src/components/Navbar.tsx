import { Link, useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import coreLogo from "@assets/CORE_LOGO_1786303177424.png"
import { useCORE } from "@/context/CoreContext"
import { useProfiles } from "@/context/ProfileContext"
import { formatSizeMb } from "@/lib/utils"
import { HardDrive, Layers } from "lucide-react"

export function Navbar() {
  const [location] = useLocation()
  const { items, totalSizeMb } = useCORE()
  const { profiles } = useProfiles()

  const links = [
    { href: "/atlas", label: "Atlas" },
    { href: "/packs", label: "Packs" },
    { href: "/builder", label: "Builder" },
    { href: "/my-cores", label: "My COREs", count: profiles.length },
    { href: "/community", label: "Community" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <img src={coreLogo} alt="Project CORE" className="w-9 h-9 object-contain" />
            <div className="flex flex-col">
              <span className="font-mono font-bold leading-none tracking-tight text-lg">PROJECT CORE</span>
              <span className="text-[0.55rem] font-mono text-muted-foreground uppercase tracking-widest leading-none mt-1">
                Custom Offline Resource Environment
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 ml-6 border-l border-border pl-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-mono transition-colors hover:text-primary flex items-center gap-1.5 ${
                  location.startsWith(link.href) ? "text-primary font-bold" : "text-muted-foreground"
                }`}
              >
                {link.label}
                {link.count !== undefined && link.count > 0 && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] ${
                    location.startsWith(link.href)
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {link.count}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Active cart indicator */}
          {items.length > 0 && (
            <Link href="/builder">
              <div className="flex items-center gap-2 px-3 py-1.5 border border-primary/30 bg-primary/10 rounded-sm cursor-pointer hover:border-primary/60 transition-colors">
                <HardDrive className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono text-xs text-primary font-bold">{items.length}</span>
                <span className="font-mono text-xs text-primary/70 hidden sm:inline">{formatSizeMb(totalSizeMb)}</span>
              </div>
            </Link>
          )}

          {/* Saved COREs indicator */}
          {profiles.length > 0 && (
            <Link href="/my-cores">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-border bg-card rounded-sm cursor-pointer hover:border-primary/40 transition-colors">
                <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-mono text-xs text-muted-foreground">{profiles.length}</span>
              </div>
            </Link>
          )}

          <Link href="/builder" className="inline-block">
            <Button className="font-mono rounded-sm text-xs font-bold uppercase tracking-wider">
              Build Your CORE
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
