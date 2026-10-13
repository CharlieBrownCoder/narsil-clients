/**
 * Registry of service-business verticals.
 *
 * Each entry maps a vertical to its most specific schema.org LocalBusiness
 * subtype (used in JSON-LD), plus sensible defaults for copy.
 * Add a vertical here once and every client in that vertical benefits.
 */
export type BusinessType =
  | 'pressure-washing'
  | 'painting'
  | 'junk-removal'
  | 'roofing'
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'landscaping'
  | 'cleaning'
  | 'moving'
  | 'locksmith'
  | 'pest-control'
  | 'handyman'
  | 'general-contractor'
  | 'garage-door'
  | 'gutter'
  | 'fencing'
  | 'concrete'
  | 'tree-service'
  | 'window-cleaning';

export interface BusinessTypeMeta {
  /** Human label, e.g. "Pressure Washing" */
  label: string;
  /** Most specific schema.org type. Falls back toward HomeAndConstructionBusiness / LocalBusiness. */
  schemaType: string;
  /** Additional schema.org types to declare alongside, via "@type": [a, b]. */
  additionalSchemaTypes?: string[];
  /** Noun used in copy, e.g. "pressure washing company" */
  noun: string;
  /** Short phrase for the hero when none is set. */
  defaultTagline: string;
  /** Default service keywords useful for meta descriptions. */
  keywords: string[];
}

export const BUSINESS_TYPES: Record<BusinessType, BusinessTypeMeta> = {
  'pressure-washing': {
    label: 'Pressure Washing',
    schemaType: 'HomeAndConstructionBusiness',
    noun: 'pressure washing company',
    defaultTagline: 'Restore your home’s curb appeal with professional pressure washing.',
    keywords: ['pressure washing', 'power washing', 'soft washing', 'driveway cleaning', 'house washing'],
  },
  painting: {
    label: 'Painting',
    schemaType: 'HousePainter',
    noun: 'painting contractor',
    defaultTagline: 'Interior and exterior painting done right the first time.',
    keywords: ['house painters', 'interior painting', 'exterior painting', 'cabinet painting'],
  },
  'junk-removal': {
    label: 'Junk Removal',
    schemaType: 'LocalBusiness',
    additionalSchemaTypes: ['HomeAndConstructionBusiness'],
    noun: 'junk removal company',
    defaultTagline: 'Fast, friendly junk removal. You point, we haul.',
    keywords: ['junk removal', 'junk hauling', 'furniture removal', 'estate cleanout'],
  },
  roofing: {
    label: 'Roofing',
    schemaType: 'RoofingContractor',
    noun: 'roofing contractor',
    defaultTagline: 'Roof repair and replacement you can trust.',
    keywords: ['roofing contractor', 'roof repair', 'roof replacement', 'storm damage'],
  },
  plumbing: {
    label: 'Plumbing',
    schemaType: 'Plumber',
    noun: 'plumbing company',
    defaultTagline: 'Licensed plumbers, upfront pricing, same-day service.',
    keywords: ['plumber', 'drain cleaning', 'water heater repair', 'emergency plumber'],
  },
  electrical: {
    label: 'Electrical',
    schemaType: 'Electrician',
    noun: 'electrical contractor',
    defaultTagline: 'Licensed electricians for homes and businesses.',
    keywords: ['electrician', 'panel upgrade', 'EV charger installation', 'electrical repair'],
  },
  hvac: {
    label: 'HVAC',
    schemaType: 'HVACBusiness',
    noun: 'HVAC company',
    defaultTagline: 'Heating and cooling comfort, year round.',
    keywords: ['HVAC', 'AC repair', 'furnace repair', 'air conditioning installation'],
  },
  landscaping: {
    label: 'Landscaping',
    schemaType: 'HomeAndConstructionBusiness',
    noun: 'landscaping company',
    defaultTagline: 'Beautiful outdoor spaces, professionally maintained.',
    keywords: ['landscaping', 'lawn care', 'landscape design', 'hardscaping'],
  },
  cleaning: {
    label: 'Cleaning',
    schemaType: 'HomeAndConstructionBusiness',
    noun: 'cleaning company',
    defaultTagline: 'A spotless home without lifting a finger.',
    keywords: ['house cleaning', 'maid service', 'deep cleaning', 'move-out cleaning'],
  },
  moving: {
    label: 'Moving',
    schemaType: 'MovingCompany',
    noun: 'moving company',
    defaultTagline: 'Stress-free local and long-distance moves.',
    keywords: ['movers', 'moving company', 'local movers', 'packing services'],
  },
  locksmith: {
    label: 'Locksmith',
    schemaType: 'Locksmith',
    noun: 'locksmith',
    defaultTagline: '24/7 locksmith service, fast response.',
    keywords: ['locksmith', 'lockout service', 'rekey', 'lock installation'],
  },
  'pest-control': {
    label: 'Pest Control',
    schemaType: 'HomeAndConstructionBusiness',
    noun: 'pest control company',
    defaultTagline: 'Pest-free living, guaranteed.',
    keywords: ['pest control', 'exterminator', 'termite treatment', 'rodent control'],
  },
  handyman: {
    label: 'Handyman',
    schemaType: 'GeneralContractor',
    noun: 'handyman service',
    defaultTagline: 'One call for every home repair.',
    keywords: ['handyman', 'home repair', 'drywall repair', 'furniture assembly'],
  },
  'general-contractor': {
    label: 'General Contracting',
    schemaType: 'GeneralContractor',
    noun: 'general contractor',
    defaultTagline: 'Remodeling and construction, built to last.',
    keywords: ['general contractor', 'remodeling', 'kitchen remodel', 'bathroom remodel'],
  },
  'garage-door': {
    label: 'Garage Door',
    schemaType: 'HomeAndConstructionBusiness',
    noun: 'garage door company',
    defaultTagline: 'Garage door repair and installation, same day.',
    keywords: ['garage door repair', 'garage door installation', 'garage door opener'],
  },
  gutter: {
    label: 'Gutters',
    schemaType: 'HomeAndConstructionBusiness',
    noun: 'gutter company',
    defaultTagline: 'Seamless gutters, guards, and cleaning.',
    keywords: ['gutter installation', 'gutter cleaning', 'gutter guards', 'seamless gutters'],
  },
  fencing: {
    label: 'Fencing',
    schemaType: 'HomeAndConstructionBusiness',
    noun: 'fence company',
    defaultTagline: 'Quality fences installed by local pros.',
    keywords: ['fence installation', 'fence repair', 'wood fence', 'vinyl fence'],
  },
  concrete: {
    label: 'Concrete',
    schemaType: 'HomeAndConstructionBusiness',
    noun: 'concrete contractor',
    defaultTagline: 'Driveways, patios, and foundations done right.',
    keywords: ['concrete contractor', 'concrete driveway', 'stamped concrete', 'concrete patio'],
  },
  'tree-service': {
    label: 'Tree Service',
    schemaType: 'HomeAndConstructionBusiness',
    noun: 'tree service company',
    defaultTagline: 'Safe tree removal, trimming, and stump grinding.',
    keywords: ['tree removal', 'tree trimming', 'stump grinding', 'arborist'],
  },
  'window-cleaning': {
    label: 'Window Cleaning',
    schemaType: 'HomeAndConstructionBusiness',
    noun: 'window cleaning company',
    defaultTagline: 'Streak-free windows, inside and out.',
    keywords: ['window cleaning', 'window washing', 'commercial window cleaning'],
  },
};

export function getBusinessType(type: BusinessType): BusinessTypeMeta {
  return BUSINESS_TYPES[type];
}
