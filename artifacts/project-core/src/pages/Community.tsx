import { useGetFeaturedCommunity } from "@workspace/api-client-react"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { formatSizeMb } from "@/lib/utils"
import { ArrowRight, Users, Share2, Server, GitFork } from "lucide-react"
import { LoadingSpinner } from "@/components/States"

export default function Community() {
  const { data: community, isLoading } = useGetFeaturedCommunity()

  if (isLoading) return <LoadingSpinner />
  if (!community) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 border-b border-border pb-8 text-center max-w-3xl mx-auto">
        <Users className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">CORE Community</h1>
        <p className="text-muted-foreground text-lg">
          Discover and fork environment profiles shared by other operators, researchers, and builders.
        </p>
        <div className="mt-8">
          <Link href="/builder">
            <Button className="font-mono uppercase tracking-wider font-bold">
              <Share2 className="w-4 h-4 mr-2" /> Share Your Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold">Featured Profiles</h2>
          <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest hidden sm:inline">Hand-picked setups</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {community.featuredProfiles.map(profile => (
            <div key={profile.id} className="border border-border bg-card p-6 flex flex-col md:flex-row gap-6 hover:border-primary/50 transition-colors group rounded-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{profile.purpose}</span>
                </div>
                <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{profile.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">by <span className="text-foreground font-mono">{profile.authorName}</span></p>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{profile.description}</p>
                
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1"><Server className="w-3.5 h-3.5" /> {profile.resourceCount} Res.</span>
                  <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" /> {profile.forkCount} Forks</span>
                  <span>{formatSizeMb(profile.allocatedSizeMb)}</span>
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <Link href={`/profiles/${profile.id}`}>
                  <Button variant="secondary" className="w-full md:w-auto font-mono text-xs">
                    INSPECT <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold">Recent Deployments</h2>
          <Link href="/profiles">
            <Button variant="link" className="font-mono text-xs text-muted-foreground hover:text-foreground">
              VIEW ALL <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {community.recentProfiles.map(profile => (
            <Link key={profile.id} href={`/profiles/${profile.id}`}>
              <Card className="h-full hover:border-primary/50 transition-colors flex flex-col rounded-sm">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono bg-muted text-muted-foreground px-2 py-1 rounded-[2px] uppercase">{profile.purpose}</span>
                  </div>
                  <CardTitle className="text-lg leading-tight">{profile.name}</CardTitle>
                  <CardDescription className="text-xs">by {profile.authorName}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">{profile.description}</p>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border text-xs font-mono text-muted-foreground flex justify-between">
                  <span>{profile.resourceCount} Resources</span>
                  <span>{formatSizeMb(profile.allocatedSizeMb)}</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
