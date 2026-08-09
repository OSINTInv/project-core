import { useState } from "react"
import { useGetProfile, useGetManifest, useDeleteProfile } from "@workspace/api-client-react"
import { useParams, Link, useLocation } from "wouter"
import { LoadingSpinner, ErrorState } from "@/components/States"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, GitFork, Download, Terminal, Database, ShieldCheck, Box, Trash2, Loader2 } from "lucide-react"
import { VerificationBadge } from "@/components/VerificationBadge"
import { OfflineCapabilityIcon } from "@/components/OfflineCapabilityIcon"
import { formatSizeMb } from "@/lib/utils"

export default function ProfileDetail() {
  const params = useParams()
  const id = Number(params.id)
  const [_, setLocation] = useLocation()
  
  const { data: profile, isLoading, error, refetch } = useGetProfile(id)
  
  const { data: manifest, isLoading: isManifestLoading } = useGetManifest(id)

  const deleteProfile = useDeleteProfile()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState error={error as Error} retry={refetch} />
  if (!profile) return null

  const downloadManifest = () => {
    if (!manifest) return
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `core-manifest-${profile.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this profile?")) {
      deleteProfile.mutate({ id }, {
        onSuccess: () => {
          setLocation("/profiles")
        }
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <Link href="/profiles">
          <Button variant="ghost" size="sm" className="font-mono text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> PROFILES
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="font-mono text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20" onClick={handleDelete} disabled={deleteProfile.isPending}>
            <Trash2 className="w-4 h-4 mr-2" /> DELETE
          </Button>
          <Button variant="outline" className="font-mono text-xs">
            <GitFork className="w-4 h-4 mr-2" /> FORK THIS CORE
          </Button>
          <Button className="font-mono text-xs font-bold" onClick={downloadManifest} disabled={!manifest}>
            <Download className="w-4 h-4 mr-2" /> EXPORT MANIFEST
          </Button>
        </div>
      </div>

      <div className="border border-border bg-card p-8 mb-8 rounded-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-primary/20 text-primary px-2 py-1 rounded-[2px] uppercase">
                {profile.purpose}
              </span>
              {!profile.isPublic && (
                <span className="text-[10px] font-mono border border-destructive text-destructive px-2 py-1 rounded-[2px] uppercase">
                  PRIVATE
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
            <p className="text-muted-foreground font-mono text-sm">Created by <strong className="text-foreground">{profile.authorName}</strong></p>
            <p className="text-lg text-muted-foreground mt-4 leading-relaxed">{profile.description}</p>
          </div>
          
          <div className="bg-background border border-border p-6 rounded-sm">
            <h3 className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Device & Storage</h3>
            <dl className="space-y-4 text-sm font-mono">
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <dt className="text-muted-foreground">Device</dt>
                <dd className="font-bold text-right">{profile.targetDevice || 'Any'}</dd>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <dt className="text-muted-foreground">Storage</dt>
                <dd className="font-bold text-right">{profile.storageCapacityGb ? `${profile.storageCapacityGb} GB` : 'Any'}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-muted-foreground">Est. Allocation</dt>
                <dd className="font-bold text-right text-primary">{formatSizeMb(profile.allocatedSizeMb)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="mb-6 w-full md:w-auto flex flex-col md:flex-row h-auto bg-transparent gap-2">
          <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border px-6 py-3 h-auto justify-start md:justify-center">
            <Database className="w-4 h-4 mr-2" /> Resources ({profile.resources.length})
          </TabsTrigger>
          {profile.packs.length > 0 && (
            <TabsTrigger value="packs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border px-6 py-3 h-auto justify-start md:justify-center">
              <Box className="w-4 h-4 mr-2" /> Attached Packs ({profile.packs.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="manifest" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border px-6 py-3 h-auto justify-start md:justify-center">
            <Terminal className="w-4 h-4 mr-2" /> Raw Manifest
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.resources.map(resource => (
              <Link key={resource.id} href={`/atlas/${resource.id}`}>
                <div className="p-4 border border-border bg-card hover:border-primary/50 transition-colors h-full flex flex-col group cursor-pointer rounded-sm">
                  <div className="flex justify-between items-start mb-3">
                    <VerificationBadge status={resource.verificationStatus} />
                    <OfflineCapabilityIcon capability={resource.offlineCapability} className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold mb-1 group-hover:text-primary transition-colors">{resource.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">{resource.description}</p>
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground pt-3 border-t border-border">
                    <span>{resource.categoryName}</span>
                    <span>{formatSizeMb(resource.approximateSizeMb || 0)}</span>
                  </div>
                </div>
              </Link>
            ))}
            {profile.resources.length === 0 && (
              <div className="col-span-full py-12 text-center border border-dashed border-border rounded-sm">
                <p className="text-muted-foreground font-mono">No resources added to this CORE yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {profile.packs.length > 0 && (
          <TabsContent value="packs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.packs.map(pack => (
                <Link key={pack.id} href={`/packs/${pack.id}`}>
                  <div className="p-6 border border-border bg-card hover:border-primary/50 transition-colors rounded-sm group flex flex-col h-full">
                    <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{pack.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{pack.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-border text-xs font-mono text-muted-foreground">
                      <span>{pack.resourceCount} items included</span>
                      <span>{formatSizeMb(pack.approximateTotalSizeMb || 0)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="manifest">
          <div className="border border-border rounded-sm overflow-hidden bg-[#0D1117]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
              <span className="font-mono text-xs text-muted-foreground">core-manifest-{profile.id}.json</span>
              <Button size="sm" variant="ghost" className="h-6 font-mono text-[10px]" onClick={downloadManifest} disabled={!manifest}>
                DOWNLOAD
              </Button>
            </div>
            <div className="p-4 overflow-x-auto">
              {isManifestLoading ? (
                <div className="py-8 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" /></div>
              ) : manifest ? (
                <pre className="font-mono text-xs text-[#E2E8F0] leading-relaxed">
                  <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(manifest, null, 2)) }} />
                </pre>
              ) : (
                <p className="text-muted-foreground font-mono text-sm py-4">Failed to load manifest.</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function syntaxHighlight(json: string) {
  let stringified = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return stringified.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'text-[#79C0FF]'; // number/boolean/null
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-[#7EE787]'; // key
      } else {
        cls = 'text-[#A5D6FF]'; // string
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-[#FF7B72]'; // boolean
    } else if (/null/.test(match)) {
      cls = 'text-[#FF7B72]'; // null
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}
