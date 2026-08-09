import { useListProfiles } from "@workspace/api-client-react"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { formatSizeMb } from "@/lib/utils"
import { ArrowRight, Globe, Server, GitFork } from "lucide-react"
import { LoadingSpinner } from "@/components/States"

export default function Profiles() {
  const { data: profiles, isLoading } = useListProfiles()

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Globe className="w-8 h-8 text-primary" /> Community COREs
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore offline environments built and shared by people in the CORE community.
          </p>
        </div>
        <Link href="/builder">
          <Button className="font-mono font-bold tracking-wider uppercase text-xs">
            Build Your CORE
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {profiles?.map(profile => (
          <Link key={profile.id} href={`/profiles/${profile.id}`}>
            <Card className="h-full hover:border-primary/50 transition-colors flex flex-col rounded-sm group relative">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono border border-border text-muted-foreground px-2 py-1 rounded-[2px] uppercase">{profile.purpose}</span>
                  <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                    <GitFork className="w-3 h-3" /> {profile.forkCount}
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{profile.name}</CardTitle>
                <CardDescription className="text-sm">by <span className="font-mono text-foreground/80">{profile.authorName}</span></CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">{profile.description}</p>
                {profile.targetDevice && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Device: </span>
                    <span className="text-xs font-mono">{profile.targetDevice}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4 border-t border-border bg-muted/20 flex justify-between items-center text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5" /> {profile.resourceCount}</span>
                  <span>{formatSizeMb(profile.allocatedSizeMb)}</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
