import type { FC } from 'react'
import { Activity11, Activity12, Activity13 } from './Section1Activities'
import { SignalRaceGame } from './SignalRaceGame'
import { Activity21, Activity22, Activity23 } from './Section2Activities'
import { HormoneTriageGame } from './HormoneTriageGame'
import { Section3Review } from './Section3Review'
import { TemperatureControlGame } from './TemperatureControlGame'
import { BloodGlucoseGame } from './BloodGlucoseGame'
import { Activity35 } from './Section3Activities'

export interface ActivityProps {
  onDone: () => void
  done: boolean
}

export const ACTIVITY_COMPONENTS: Record<string, FC<ActivityProps>> = {
  '1-1': Activity11,
  '1-2': Activity12,
  '1-3': Activity13,
  '1-4': SignalRaceGame,
  '2-1': Activity21,
  '2-2': Activity22,
  '2-3': Activity23,
  '2-4': HormoneTriageGame,
  '3-1': Section3Review,
  '3-2': TemperatureControlGame,
  '3-3': BloodGlucoseGame,
  '3-4': Activity35,
}
