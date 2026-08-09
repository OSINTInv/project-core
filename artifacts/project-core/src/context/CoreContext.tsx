import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

const STORAGE_KEY = "core-selection"

export interface CoreItem {
  id: number
  name: string
  slug: string
  category: string
  categoryName: string
  approximateSizeMb: number | null
  offlineCapability: string
  resourceType: string
  description: string
  officialUrl: string
  acquisitionUrl: string | null
  acquisitionMethod: string | null
  sourceOrganization: string | null
}

interface CoreContextValue {
  items: CoreItem[]
  addItem: (item: CoreItem) => void
  removeItem: (id: number) => void
  hasItem: (id: number) => boolean
  totalSizeMb: number
  categories: { slug: string; name: string; count: number }[]
  clear: () => void
}

const CoreContext = createContext<CoreContextValue | null>(null)

function loadFromStorage(): CoreItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CoreItem[]
  } catch {
    return []
  }
}

function saveToStorage(items: CoreItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export function CoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CoreItem[]>(loadFromStorage)

  useEffect(() => {
    saveToStorage(items)
  }, [items])

  const addItem = (item: CoreItem) => {
    setItems(prev => prev.some(i => i.id === item.id) ? prev : [...prev, item])
  }

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const hasItem = (id: number) => items.some(i => i.id === id)

  const totalSizeMb = items.reduce((sum, i) => sum + (i.approximateSizeMb ?? 0), 0)

  const categories = Object.values(
    items.reduce<Record<string, { slug: string; name: string; count: number }>>((acc, item) => {
      if (!acc[item.category]) acc[item.category] = { slug: item.category, name: item.categoryName, count: 0 }
      acc[item.category].count++
      return acc
    }, {})
  )

  const clear = () => setItems([])

  return (
    <CoreContext.Provider value={{ items, addItem, removeItem, hasItem, totalSizeMb, categories, clear }}>
      {children}
    </CoreContext.Provider>
  )
}

export function useCORE() {
  const ctx = useContext(CoreContext)
  if (!ctx) throw new Error("useCORE must be used inside CoreProvider")
  return ctx
}
