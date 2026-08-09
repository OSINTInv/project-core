import { useState } from "react"
import { useListResources, useListCategories } from "@workspace/api-client-react"
import { Link } from "wouter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Server, Package } from "lucide-react"
import { VerificationBadge } from "@/components/VerificationBadge"
import { OfflineCapabilityIcon } from "@/components/OfflineCapabilityIcon"
import { formatSizeMb } from "@/lib/utils"
import { LoadingSpinner } from "@/components/States"
import { useDebounce } from "@/hooks/use-debounce"

export default function Atlas() {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const { data: categories } = useListCategories()
  
  const { data: resourceData, isLoading } = useListResources({
    search: debouncedSearch || undefined,
    category: selectedCategory || undefined,
    limit: 50
  }, { query: { keepPreviousData: true } })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-b border-border pb-8">
        <h1 className="text-4xl font-bold mb-2">Resource Atlas</h1>
        <p className="text-muted-foreground text-lg">
          Discover the information, knowledge, software, tools, and resources you can take offline.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Categories</h3>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`text-left px-3 py-2 text-sm font-mono rounded-sm transition-colors ${
                    selectedCategory === "" ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All Resources
                </button>
                {categories?.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`text-left px-3 py-2 text-sm font-mono flex items-center justify-between rounded-sm transition-colors ${
                      selectedCategory === cat.slug ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="opacity-50 text-xs">{cat.resourceCount}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 border border-border bg-card/50 rounded-sm">
              <h3 className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                <Server className="w-4 h-4" /> About the Atlas
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Resources marked <strong className="text-[#22C55E]">VERIFIED</strong> have been reviewed for genuine offline capability, identifiable source, and license information.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by name, description, or tags..." 
              className="pl-10 h-12 text-base font-sans"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isLoading && !resourceData ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="mb-4 text-sm font-mono text-muted-foreground">
                Showing {resourceData?.resources.length || 0} of {resourceData?.total || 0} resources
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {resourceData?.resources.map(resource => (
                  <Link key={resource.id} href={`/atlas/${resource.id}`}>
                    <div className="p-5 border border-border bg-card hover:border-primary/50 transition-colors h-full flex flex-col group cursor-pointer rounded-sm relative overflow-hidden">
                      {resource.featured && (
                        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                          <div className="absolute top-2 -right-6 bg-primary text-primary-foreground font-mono text-[9px] uppercase tracking-wider py-1 px-8 rotate-45 transform origin-center">
                            Core
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-3">
                        <VerificationBadge status={resource.verificationStatus} />
                        <OfflineCapabilityIcon capability={resource.offlineCapability} className="w-5 h-5 mr-4 group-hover:text-primary transition-colors" />
                      </div>
                      <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors pr-6">{resource.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">{resource.description}</p>
                      <div className="flex justify-between items-center text-xs font-mono text-muted-foreground pt-3 border-t border-border/50">
                        <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> {resource.categoryName}</span>
                        <span>{formatSizeMb(resource.approximateSizeMb || 0)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {resourceData?.resources.length === 0 && (
                <div className="py-20 text-center border border-dashed border-border rounded-sm">
                  <p className="text-muted-foreground font-mono">No resources found matching your criteria.</p>
                  <Button variant="link" onClick={() => { setSearch(""); setSelectedCategory(""); }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
