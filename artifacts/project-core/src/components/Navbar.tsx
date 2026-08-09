import { Link, useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Compass, CompassIcon } from "lucide-react"

export function Navbar() {
  const [location] = useLocation()

  const links = [
    { href: "/atlas", label: "Atlas" },
    { href: "/packs", label: "Packs" },
    { href: "/builder", label: "Builder" },
    { href: "/profiles", label: "Profiles" },
    { href: "/community", label: "Community" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative overflow-hidden group">
              <Compass className="w-5 h-5 absolute group-hover:rotate-45 transition-transform duration-500 ease-in-out" />
            </div>
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
                className={`text-sm font-mono transition-colors hover:text-primary ${
                  location.startsWith(link.href) ? "text-primary font-bold" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
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
