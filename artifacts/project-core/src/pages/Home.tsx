import { useGetStats, useListFeaturedResources, useListPacks } from "@workspace/api-client-react"
import { motion } from "framer-motion"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Database, DownloadCloud, HardDrive, Share2, ShieldCheck, Wrench } from "lucide-react"
import { VerificationBadge } from "@/components/VerificationBadge"
import { OfflineCapabilityIcon } from "@/components/OfflineCapabilityIcon"
import { formatSizeMb } from "@/lib/utils"

export default function Home() {
  const { data: stats } = useGetStats()
  const { data: featuredResources } = useListFeaturedResources()
  const { data: packs } = useListPacks()
  
  const featuredPacks = packs?.filter(p => p.featured).slice(0, 3) || []

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90dvh] flex items-center justify-center border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/50 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4 py-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-primary/20 bg-primary/10 text-primary font-mono text-xs mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            SYSTEM ONLINE. {stats?.verifiedResources || 0} VERIFIED RESOURCES AVAILABLE.
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl"
          >
            No Internet? <span className="text-primary font-mono font-normal">No Problem.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-4"
          >
            Define your needs. Curate your stack. Build your offline repository. Deploy it to your world. Maintain it. Share it.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-sm font-mono uppercase tracking-widest text-primary/70 mb-10"
          >
            Preserve information. Keep the unconnected connected.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/builder" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-mono text-sm font-bold uppercase tracking-wider h-14 px-8">
                Build Your CORE
              </Button>
            </Link>
            <Link href="/atlas" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-mono text-sm font-bold uppercase tracking-wider h-14 px-8">
                Explore The Atlas
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/0 md:divide-border">
            {[
              { label: "Resources", value: stats?.totalResources || 0 },
              { label: "Curated Packs", value: stats?.totalPacks || 0 },
              { label: "Community Profiles", value: stats?.totalProfiles || 0 },
              { label: "Active Nodes", value: stats?.totalCommunityMembers || 0 },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center px-4">
                <span className="text-3xl md:text-4xl font-mono font-bold text-foreground mb-2">
                  {stat.value.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Lifecycle */}
      <section className="py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The CORE Lifecycle</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A systematic approach to offline resilience. From assessing needs to deploying environments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: "01", title: "DEFINE", desc: "Identify your mission parameters, user needs, and storage constraints.", icon: TargetIcon },
              { id: "02", title: "CURATE", desc: "Select reliable software, datasets, and documentation from the Atlas.", icon: Database },
              { id: "03", title: "BUILD", desc: "Assemble resources into a cohesive, conflict-free Profile.", icon: Wrench },
              { id: "04", title: "DEPLOY", desc: "Export manifest and download assets to target hardware.", icon: DownloadCloud },
              { id: "05", title: "MAINTAIN", desc: "Sync updates periodically when connectivity is available.", icon: HardDrive },
              { id: "06", title: "SHARE", desc: "Publish your customized CORE Profile for the community.", icon: Share2 },
            ].map((step, i) => (
              <div key={i} className="relative p-6 border border-border bg-card rounded-sm group hover:border-primary/50 transition-colors">
                <div className="absolute top-0 right-0 p-4 font-mono text-4xl font-bold text-muted/30 group-hover:text-primary/10 transition-colors">
                  {step.id}
                </div>
                <div className="w-12 h-12 rounded-sm bg-muted flex items-center justify-center mb-6 text-foreground">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-mono font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packs */}
      <section className="py-24 bg-card/20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Packs</h2>
              <p className="text-muted-foreground">Pre-configured resource bundles for common scenarios.</p>
            </div>
            <Link href="/packs">
              <Button variant="outline" className="font-mono text-xs">
                VIEW ALL PACKS <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPacks.map(pack => (
              <Card key={pack.id} className="flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs text-primary">{pack.categories[0]}</span>
                    <span className="font-mono text-xs text-muted-foreground">{formatSizeMb(pack.approximateTotalSizeMb || 0)}</span>
                  </div>
                  <CardTitle className="text-xl">{pack.name}</CardTitle>
                  <CardDescription className="text-sm">{pack.tagline}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">{pack.description}</p>
                </CardContent>
                <div className="p-6 pt-0 mt-auto border-t border-border mt-4">
                  <Link href={`/packs/${pack.id}`}>
                    <Button variant="ghost" className="w-full justify-between font-mono text-xs mt-4">
                      INSPECT PACK <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Resources */}
      <section className="py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Essential Resources</h2>
              <p className="text-muted-foreground">Top-rated tools validated for offline capability.</p>
            </div>
            <Link href="/atlas">
              <Button variant="outline" className="font-mono text-xs">
                OPEN ATLAS <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredResources?.slice(0, 8).map(resource => (
              <Link key={resource.id} href={`/atlas/${resource.id}`}>
                <div className="p-4 border border-border bg-card hover:border-primary/50 transition-colors h-full flex flex-col group cursor-pointer rounded-sm">
                  <div className="flex justify-between items-start mb-3">
                    <VerificationBadge status={resource.verificationStatus} />
                    <OfflineCapabilityIcon capability={resource.offlineCapability} className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold mb-1 group-hover:text-primary transition-colors">{resource.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">{resource.description}</p>
                  <div className="flex justify-between items-center text-xs font-mono text-muted-foreground pt-3 border-t border-border">
                    <span>{resource.categoryName}</span>
                    <span>{formatSizeMb(resource.approximateSizeMb || 0)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Initialize Your Environment</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Use the Builder tool to configure your hardware constraints, select necessary tools, and generate a reproducible manifest.
          </p>
          <Link href="/builder">
            <Button size="lg" className="font-mono text-sm font-bold uppercase tracking-wider h-14 px-12">
              LAUNCH BUILDER <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function TargetIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}
