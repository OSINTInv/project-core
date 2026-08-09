import { Loader2 } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
        Accessing Database...
      </p>
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-[40vh] border border-dashed border-border bg-card/50 flex flex-col items-center justify-center p-8 rounded-sm text-center">
      <div className="w-12 h-12 rounded-sm bg-muted flex items-center justify-center mb-4">
        <span className="font-mono text-xl text-muted-foreground">/</span>
      </div>
      <h3 className="font-mono font-bold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-md">{description}</p>
    </div>
  )
}

export function ErrorState({ error, retry }: { error: Error; retry?: () => void }) {
  return (
    <div className="min-h-[40vh] border border-destructive/20 bg-destructive/5 flex flex-col items-center justify-center p-8 rounded-sm text-center">
      <h3 className="font-mono font-bold text-lg mb-2 text-destructive">System Error</h3>
      <p className="text-muted-foreground text-sm max-w-md mb-4">{error.message}</p>
      {retry && (
        <button 
          onClick={retry}
          className="font-mono text-xs border border-border px-4 py-2 hover:bg-card transition-colors"
        >
          RETRY
        </button>
      )}
    </div>
  )
}
