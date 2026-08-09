import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { CoreItem } from "./CoreContext"

const STORAGE_KEY = "core-saved-profiles"

// ─── Data model ──────────────────────────────────────────────────────────────

export interface SavedPack {
  id: number
  name: string
  slug: string
  approximateTotalSizeMb: number | null
}

export interface CORESavedProfile {
  id: string
  name: string
  slug: string
  description: string
  purpose: string
  author: string
  version: string
  targetPlatforms: string[]
  selectedResources: CoreItem[]
  selectedPacks: SavedPack[]
  estimatedStorageMb: number
  createdAt: string   // ISO string
  updatedAt: string   // ISO string
}

export interface ProfileInput {
  name: string
  description: string
  purpose: string
  author: string
  version: string
  targetPlatforms: string[]
  selectedResources: CoreItem[]
  selectedPacks: SavedPack[]
  estimatedStorageMb: number
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface ProfileContextValue {
  profiles: CORESavedProfile[]
  createProfile: (input: ProfileInput) => CORESavedProfile
  updateProfile: (id: string, input: Partial<ProfileInput> & { version?: string }) => void
  deleteProfile: (id: string) => void
  duplicateProfile: (id: string) => CORESavedProfile
  getProfile: (id: string) => CORESavedProfile | undefined
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60)
}

function generateId() {
  return `core-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function load(): CORESavedProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CORESavedProfile[]
  } catch {
    return []
  }
}

function save(profiles: CORESavedProfile[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
  } catch {}
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<CORESavedProfile[]>(load)

  useEffect(() => {
    save(profiles)
  }, [profiles])

  const createProfile = (input: ProfileInput): CORESavedProfile => {
    const now = new Date().toISOString()
    const profile: CORESavedProfile = {
      ...input,
      id: generateId(),
      slug: slugify(input.name),
      createdAt: now,
      updatedAt: now,
    }
    setProfiles(prev => [profile, ...prev])
    return profile
  }

  const updateProfile = (id: string, input: Partial<ProfileInput> & { version?: string }) => {
    setProfiles(prev => prev.map(p => {
      if (p.id !== id) return p
      const updated = { ...p, ...input, updatedAt: new Date().toISOString() }
      if (input.name) updated.slug = slugify(input.name)
      return updated
    }))
  }

  const deleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id))
  }

  const duplicateProfile = (id: string): CORESavedProfile => {
    const source = profiles.find(p => p.id === id)
    if (!source) throw new Error("Profile not found")
    const now = new Date().toISOString()
    const copy: CORESavedProfile = {
      ...source,
      id: generateId(),
      name: `${source.name} (copy)`,
      slug: slugify(`${source.name} copy`),
      version: "1.0",
      createdAt: now,
      updatedAt: now,
    }
    setProfiles(prev => [copy, ...prev])
    return copy
  }

  const getProfile = (id: string) => profiles.find(p => p.id === id)

  return (
    <ProfileContext.Provider value={{ profiles, createProfile, updateProfile, deleteProfile, duplicateProfile, getProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfiles() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfiles must be used inside ProfileProvider")
  return ctx
}
