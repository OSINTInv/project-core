import { useGetPack } from "@workspace/api-client-react"
import { useParams, Link } from "wouter"
import { LoadingSpinner, ErrorState } from "@/components/States"
import { Button } from "@/components/ui/button"
import { ArrowLeft, PackagePlus, ArrowRight, Package } from "lucide-react"
import { VerificationBadge } from "@/components/VerificationBadge"
import { OfflineCapabilityIcon } from "@/components/OfflineCapabilityIcon"
import { formatSizeMb } from "@/lib/utils"

export default function PackDetail() {
  const params = useParams()
  const id = Number(params.id)
  
  const { data: pack, isLoading, error, refetch } = useGetPack(id, {
    query: { enabled: !!id }
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState error={error as Error} retry={refetch} />
  if (!pack) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/packs">
        <Button variant="ghost" size="sm" className="mb-6 font-mono text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> RETURN TO PACKS
        </Button>
      </Link>

      <div className="border border-border bg-card p-8 md:p-12 mb-12 rounded-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Package className="w-96 h-96" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex gap-2 mb-4">
            {pack.categories.map(c => (
              <span key={c} className="text-xs font-mono bg-primary/20 text-primary px-3 py-1 rounded-[2px]">{c}</span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{pack.name}</h1>
          <p className="text-xl md:text-2xl text-primary font-mono mb-6">{pack.tagline}</p>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {pack.description}
          </p>
          
          <div className="flex flex-wrap gap-6 items-center pt-8 border-t border-border/50">
            <Button size="lg" className="font-mono font-bold tracking-wider">
              <PackagePlus className="w-4 h-4 mr-2" /> ADD PACK TO PROFILE
            </Button>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-mono">
              <div><span className="text-muted-foreground">Total Resources:</span> <strong className="text-foreground">{pack.resources.length}</strong></div>
              <div><span className="text-muted-foreground">Est. Size:</span> <strong className="text-foreground">{formatSizeMb(pack.approximateTotalSizeMb || 0)}</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Pack Contents</h2>
        <p className="text-muted-foreground">All resources included in this collection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {pack.resources.map(resource => (
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
  )
}
