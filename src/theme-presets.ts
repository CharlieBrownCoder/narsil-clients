/**
 * Theme presets distilled from 32 reference sites the client admires
 * (see docs/DESIGN-REFERENCE.md). Each is a complete, contrast-checked
 * starting point. Apply with:  node scripts/apply-preset.mjs <id>
 * Then swap fonts/colors as the brand requires.
 */
export interface ThemePreset {
  id: string;
  label: string;
  /** which trades it suits */
  fits: string[];
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  neutral: string;
  fontHeading: string;
  fontBody: string;
  radius: 'sharp' | 'rounded' | 'pill';
  heroStyle: 'photo' | 'cutout' | 'split' | 'centered';
  headingCase: 'normal' | 'uppercase';
  dividers: 'none' | 'angle' | 'curve' | 'wave';
}

export const presets: ThemePreset[] = [
  { id: 'navy-orange', label: 'Navy + safety orange', fits: ['roofing', 'electrical', 'concrete', 'garage-door', 'general-contractor'], primary: '#1D4ED8', primaryDark: '#1E3A8A', secondary: '#0B1220', accent: '#F97316', neutral: '#F1F5F9', fontHeading: 'Montserrat', fontBody: 'Inter', radius: 'sharp', heroStyle: 'photo', headingCase: 'uppercase', dividers: 'angle' },
  { id: 'navy-lime', label: 'Navy + lime', fits: ['junk-removal', 'landscaping', 'tree-service', 'pest-control'], primary: '#0F766E', primaryDark: '#115E59', secondary: '#0F172A', accent: '#A3E635', neutral: '#F0FDF4', fontHeading: 'Oswald', fontBody: 'Inter', radius: 'sharp', heroStyle: 'photo', headingCase: 'uppercase', dividers: 'angle' },
  { id: 'ocean-sky', label: 'Ocean blue + sky', fits: ['pressure-washing', 'window-cleaning', 'cleaning', 'gutter'], primary: '#0369A1', primaryDark: '#075985', secondary: '#0C1B33', accent: '#38BDF8', neutral: '#F0F9FF', fontHeading: 'Poppins', fontBody: 'Inter', radius: 'rounded', heroStyle: 'photo', headingCase: 'uppercase', dividers: 'curve' },
  { id: 'teal-amber', label: 'Teal + amber', fits: ['pressure-washing', 'cleaning', 'hvac', 'plumbing'], primary: '#0E7490', primaryDark: '#155E75', secondary: '#0F172A', accent: '#F59E0B', neutral: '#F8FAFC', fontHeading: 'Plus Jakarta Sans', fontBody: 'Inter', radius: 'rounded', heroStyle: 'photo', headingCase: 'uppercase', dividers: 'angle' },
  { id: 'charcoal-red', label: 'Charcoal + red', fits: ['concrete', 'moving', 'fencing', 'hvac'], primary: '#1F2937', primaryDark: '#111827', secondary: '#0B0F19', accent: '#EF4444', neutral: '#F3F4F6', fontHeading: 'Barlow Condensed', fontBody: 'Barlow', radius: 'sharp', heroStyle: 'cutout', headingCase: 'uppercase', dividers: 'none' },
  { id: 'forest-cream', label: 'Forest green + cream', fits: ['landscaping', 'tree-service', 'lawn care'], primary: '#166534', primaryDark: '#14532D', secondary: '#0F1F14', accent: '#FACC15', neutral: '#FEFCE8', fontHeading: 'Montserrat', fontBody: 'Inter', radius: 'rounded', heroStyle: 'centered', headingCase: 'normal', dividers: 'wave' },
  { id: 'royal-gold', label: 'Royal purple + gold', fits: ['painting', 'electrical', 'locksmith', 'premium brands'], primary: '#5B21B6', primaryDark: '#4C1D95', secondary: '#1E1033', accent: '#FBBF24', neutral: '#FAF5FF', fontHeading: 'Montserrat', fontBody: 'Inter', radius: 'pill', heroStyle: 'cutout', headingCase: 'uppercase', dividers: 'curve' },
  { id: 'slate-yellow', label: 'Slate + yellow', fits: ['roofing', 'gutter', 'handyman', 'electrical'], primary: '#334155', primaryDark: '#1E293B', secondary: '#0F172A', accent: '#FDE047', neutral: '#F8FAFC', fontHeading: 'Oswald', fontBody: 'Inter', radius: 'sharp', heroStyle: 'photo', headingCase: 'uppercase', dividers: 'angle' },
  { id: 'clean-light', label: 'Light, calm, editorial', fits: ['cleaning', 'photography', 'dentist', 'home services wanting a softer look'], primary: '#0F766E', primaryDark: '#115E59', secondary: '#1E293B', accent: '#F97316', neutral: '#F8FAFC', fontHeading: 'Plus Jakarta Sans', fontBody: 'Inter', radius: 'rounded', heroStyle: 'split', headingCase: 'normal', dividers: 'none' },
];
