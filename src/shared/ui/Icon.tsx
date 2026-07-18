import {
  ArrowUp,
  Bell,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  CircleAlert,
  CircleCheck,
  CirclePlus,
  CircleX,
  Flag,
  Home,
  Info,
  type LucideIcon,
  PenLine,
  Sparkles,
  TriangleAlert,
  Users,
  X,
} from 'lucide-react-native';

// Maps the design prototype's icon names onto Lucide icons (MIT licensed).
// Names ending in "-fill" render the same glyph filled solid for active/emphasis states.
const ICON_MAP: Record<string, LucideIcon> = {
  bell: Bell,
  home: Home,
  pencil: PenLine,
  sparkle: Sparkles,
  camera: Camera,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'circle-plus': CirclePlus,
  'circle-info': Info,
  persons: Users,
  flag: Flag,
  'arrow-up': ArrowUp,
  check: Check,
  'triangle-exclamation': TriangleAlert,
  close: X,
  'circle-check': CircleCheck,
  'circle-exclamation': CircleAlert,
  'circle-close': CircleX,
};

type Props = {
  name: string;
  size?: number;
  color?: string;
};

export default function Icon({ name, size = 20, color = '#000' }: Props) {
  const filled = name.endsWith('-fill');
  const key = filled ? name.slice(0, -'-fill'.length) : name;
  const LucideIcon = ICON_MAP[key] ?? Circle;

  return (
    <LucideIcon size={size} color={color} fill={filled ? color : 'none'} strokeWidth={filled ? 2 : 1.75} />
  );
}
