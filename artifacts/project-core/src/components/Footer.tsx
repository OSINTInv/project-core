export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col mb-4">
              <span className="font-mono font-bold leading-none tracking-tight text-lg">PROJECT CORE</span>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">
                No internet? No problem.
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              The digital command center for building personal offline environments. Plan, curate, and deploy offline knowledge bases for field operations, remote work, or disaster preparedness.
            </p>
          </div>
          <div>
            <h4 className="font-mono font-bold uppercase text-xs mb-4 text-primary">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-mono">
              <li><a href="/atlas" className="hover:text-foreground transition-colors">Resource Atlas</a></li>
              <li><a href="/packs" className="hover:text-foreground transition-colors">CORE Packs</a></li>
              <li><a href="/community" className="hover:text-foreground transition-colors">Community Profiles</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono font-bold uppercase text-xs mb-4 text-primary">System</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-mono">
              <li><a href="/builder" className="hover:text-foreground transition-colors">Launch Builder</a></li>
              <li><span className="text-muted-foreground/50 cursor-not-allowed">Documentation (WIP)</span></li>
              <li><span className="text-muted-foreground/50 cursor-not-allowed">API Access (WIP)</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-muted-foreground">
            &copy; {new Date().getFullYear()} Project CORE. Open source.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <span>SYS. STATUS: <span className="text-[#22C55E]">NOMINAL</span></span>
          </div>
        </div>
      </div>
    </footer>
  )
}
