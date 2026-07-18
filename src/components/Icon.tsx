import { Ionicons } from '@expo/vector-icons';

// Maps the design prototype's icon names (Wanted Design System icon set) onto
// the closest available Ionicons glyph bundled with Expo.
const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  bell: 'notifications-outline',
  home: 'home-outline',
  'home-fill': 'home',
  pencil: 'pencil-outline',
  'pencil-fill': 'pencil',
  sparkle: 'sparkles-outline',
  'sparkle-fill': 'sparkles',
  camera: 'camera-outline',
  'camera-fill': 'camera',
  'chevron-right': 'chevron-forward',
  'chevron-up': 'chevron-up',
  'chevron-down': 'chevron-down',
  'circle-plus': 'add-circle-outline',
  'circle-info': 'information-circle-outline',
  'persons-fill': 'people',
  'flag-fill': 'flag',
  'arrow-up': 'arrow-up',
  check: 'checkmark',
  'triangle-exclamation': 'warning-outline',
  close: 'close',
  'circle-check-fill': 'checkmark-circle',
  'circle-exclamation-fill': 'alert-circle',
  'circle-close-fill': 'close-circle',
};

type Props = {
  name: string;
  size?: number;
  color?: string;
};

export default function Icon({ name, size = 20, color = '#000' }: Props) {
  const glyph = ICON_MAP[name] ?? 'ellipse-outline';
  return <Ionicons name={glyph} size={size} color={color} />;
}
