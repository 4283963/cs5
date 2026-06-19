import {
  Building2,
  Boxes,
  Users,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import type { NodeType } from '@shared/types'

export type Accent = 'jade' | 'amber'

export interface NodeVisual {
  icon: LucideIcon
  accent: Accent
  iconColor: string
  badge: string
  dot: string
  chipRing: string
}

export const NODE_VISUAL: Record<NodeType, NodeVisual> = {
  department: {
    icon: Building2,
    accent: 'jade',
    iconColor: 'text-jade',
    badge: 'text-jade-soft bg-jade/10 ring-1 ring-inset ring-jade/25',
    dot: 'bg-jade',
    chipRing: 'ring-jade/30',
  },
  sub_department: {
    icon: Boxes,
    accent: 'jade',
    iconColor: 'text-jade-soft',
    badge: 'text-jade-soft bg-jade/[0.06] ring-1 ring-inset ring-jade/20',
    dot: 'bg-jade-soft',
    chipRing: 'ring-jade/25',
  },
  team: {
    icon: Users,
    accent: 'jade',
    iconColor: 'text-jade-deep',
    badge: 'text-muted bg-panel3 ring-1 ring-inset ring-line',
    dot: 'bg-jade-deep',
    chipRing: 'ring-line',
  },
  employee: {
    icon: UserRound,
    accent: 'amber',
    iconColor: 'text-amber',
    badge: 'text-amber-soft bg-amber/10 ring-1 ring-inset ring-amber/25',
    dot: 'bg-amber',
    chipRing: 'ring-amber/30',
  },
}
