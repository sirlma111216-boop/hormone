import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ProgressState } from './types'
import { SECTIONS, ALL_ACTIVITY_IDS } from './data/sections'

const STORAGE_KEY = 'homeostasis-hormone-lab:v1'

const initialState: ProgressState = {
  done: {},
  introPrediction: null,
  introConfirmed: false,
}

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return {
      done: parsed.done ?? {},
      introPrediction: parsed.introPrediction ?? null,
      introConfirmed: parsed.introConfirmed ?? false,
    }
  } catch {
    return initialState
  }
}

interface ProgressContextValue {
  state: ProgressState
  completeActivity: (id: string) => void
  isDone: (id: string) => boolean
  setIntroPrediction: (choice: number) => void
  confirmIntro: () => void
  resetAll: () => void
  // 파생 값
  totalActivities: number
  completedCount: number
  isSectionComplete: (section: string) => boolean
  isSectionUnlocked: (order: number) => boolean
  allComplete: boolean
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<ProgressContextValue>(() => {
    const completeActivity = (id: string) =>
      setState((s) => (s.done[id] ? s : { ...s, done: { ...s.done, [id]: true } }))

    const isDone = (id: string) => !!state.done[id]

    const isSectionComplete = (section: string) => {
      const sec = SECTIONS.find((x) => x.id === section)
      if (!sec) return false
      return sec.activities.every((a) => state.done[a.id])
    }

    const isSectionUnlocked = (order: number) => {
      if (order === 1) return true
      const prev = SECTIONS.find((s) => s.order === order - 1)
      if (!prev) return true
      return prev.activities.every((a) => state.done[a.id])
    }

    const completedCount = ALL_ACTIVITY_IDS.filter((id) => state.done[id]).length

    return {
      state,
      completeActivity,
      isDone,
      setIntroPrediction: (choice: number) =>
        setState((s) => ({ ...s, introPrediction: choice })),
      confirmIntro: () => setState((s) => ({ ...s, introConfirmed: true })),
      resetAll: () => setState(initialState),
      totalActivities: ALL_ACTIVITY_IDS.length,
      completedCount,
      isSectionComplete,
      isSectionUnlocked,
      allComplete: completedCount === ALL_ACTIVITY_IDS.length,
    }
  }, [state])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
