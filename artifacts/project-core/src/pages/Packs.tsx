import { useListPacks } from "@workspace/api-client-react"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { formatSizeMb } from "@/lib/utils"
import { ArrowRight, Package, Library } from "lucide-react"
import { LoadingSpinner } from "@/components/States"

export default function Packs() {
  const { data: packs, isLoading } = useListPacks()

  if (isLoading) return <LoadingSpinner />

  const featuredPack = packs?.find(p => p.featured)
  const regularPacks = packs?.filter(p => p.id !== featuredPack?.id) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Library className="w-8 h-8 text-primary" /> CORE Packs
        </h1>
        <p className="text-muted-foreground text-lg">
          Curated collections of resources tailored for specific missions and scenarios.
        </p>
      </div>

      {featuredPack && (
        <div className="mb-16">
          <h2 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4">Featured Pack</h2>
          <div className="border-2 border-primary/30 bg-card rounded-sm overflow-hidden flex flex-col md:flex-row relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Package className="w-64 h-64" />
            </div>
            
            <div className="p-8 md:w-2/3 relative z-10">
              <div className="flex gap-2 mb-4">
                {featuredPack.categories.map(c => (
                  <span key={c} className="text-xs font-mono bg-primary/20 text-primary px-2 py-1 rounded-sm">{c}</span>
                ))}
              </div>
              <h3 className="text-3xl font-bold mb-2">{featuredPack.name}</h3>
              <p className="text-xl text-primary font-mono mb-6">{featuredPack.tagline}</p>
              <p className="text-muted-foreground mb-8 text-lg">{featuredPack.description}</p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <Link href={`/packs/${featuredPack.id}`}>
                  <Button size="lg" className="font-mono font-bold tracking-wider">
                    INSPECT PACK <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <div className="font-mono text-sm text-muted-foreground">
                  <strong className="text-foreground">{featuredPack.resourceCount}</strong> Resources
                  <span className="mx-2">|</span>
                  <strong className="text-foreground">{formatSizeMb(featuredPack.approximateTotalSizeMb || 0)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest mb-6">Standard Packs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPacks.map(pack => (
            <Card key={pack.id} className="flex flex-col hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs bg-muted px-2 py-1 text-muted-foreground rounded-[2px]">{pack.categories[0]}</span>
                  <span className="font-mono text-xs text-muted-foreground">{formatSizeMb(pack.approximateTotalSizeMb || 0)}</span>
                </div>
                <CardTitle className="text-xl">{pack.name}</CardTitle>
                <CardDescription className="text-sm font-mono text-primary/80 mt-1">{pack.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">{pack.description}</p>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border mt-4 flex justify-between items-center">
                <span className="text-xs font-mono text-muted-foreground">{pack.resourceCount} items</span>
                <Link href={`/packs/${pack.id}`}>
                  <Button variant="ghost" size="sm" className="font-mono text-xs">
                    INSPECT <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
