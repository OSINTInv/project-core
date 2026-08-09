import { ReactNode } from "react"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col topo-pattern">
      <Navbar />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  )
}
