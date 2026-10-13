/**
 * Quote calculator rules. Ranges only, never a single price.
 * Each rule produces: low = base.low + units * perUnit.low, high likewise,
 * then multiplied by every selected option's multiplier and plus every option's add.
 * Edit per client. Remove a rule to hide that service from the calculator.
 */
export interface CalcOption {
  id: string;
  label: string;
  /** e.g. 1.25 = +25% */
  multiplier?: number;
  /** flat add in USD */
  add?: number;
  /** show as a checkbox (true) or part of a single-select group (false) */
  checkbox?: boolean;
}
export interface CalcRule {
  /** service slug from src/content/services */
  service: string;
  label: string;
  /** what the user enters */
  unit: 'sqft' | 'linearft' | 'count' | 'stories';
  unitLabel: string;
  min: number;
  max: number;
  step: number;
  default: number;
  base: { low: number; high: number };
  perUnit: { low: number; high: number };
  options: CalcOption[];
  /** one-line note under the result */
  note?: string;
}

export const calculator: { enabled: boolean; title: string; disclaimer: string; rules: CalcRule[] } = {
  enabled: true,
  title: 'Instant estimate',
  disclaimer: 'This is an estimated range based on typical jobs, not a quote. Final price is confirmed in writing after we see the property.',
  rules: [
    {
      service: 'house-washing',
      label: 'House washing',
      unit: 'sqft',
      unitLabel: 'Home square footage',
      min: 800,
      max: 6000,
      step: 100,
      default: 2200,
      base: { low: 99, high: 149 },
      perUnit: { low: 0.05, high: 0.09 },
      options: [
        { id: 'two-story', label: 'Two stories', multiplier: 1.3, checkbox: true },
        { id: 'heavy', label: 'Heavy algae or mildew', multiplier: 1.2, checkbox: true },
        { id: 'windows', label: 'Add spot-free window rinse', add: 75, checkbox: true },
      ],
      note: 'Brick, stucco, and Hardie board priced the same. Painted wood may need a second visit.',
    },
    {
      service: 'driveway-cleaning',
      label: 'Driveway & concrete',
      unit: 'sqft',
      unitLabel: 'Concrete square footage',
      min: 200,
      max: 3000,
      step: 50,
      default: 800,
      base: { low: 79, high: 99 },
      perUnit: { low: 0.1, high: 0.18 },
      options: [
        { id: 'oil', label: 'Oil or rust stains', add: 40, checkbox: true },
        { id: 'seal', label: 'Add penetrating sealer', multiplier: 1.6, checkbox: true },
      ],
    },
    {
      service: 'roof-cleaning',
      label: 'Roof cleaning',
      unit: 'sqft',
      unitLabel: 'Roof square footage (about 1.3× the home footprint)',
      min: 1000,
      max: 6000,
      step: 100,
      default: 2500,
      base: { low: 199, high: 249 },
      perUnit: { low: 0.08, high: 0.15 },
      options: [
        { id: 'steep', label: 'Steep pitch (8/12 or more)', multiplier: 1.25, checkbox: true },
        { id: 'moss', label: 'Visible moss', add: 60, checkbox: true },
      ],
    },
    {
      service: 'deck-and-fence-cleaning',
      label: 'Fence or deck',
      unit: 'linearft',
      unitLabel: 'Linear feet of fence (or deck square footage)',
      min: 50,
      max: 800,
      step: 10,
      default: 200,
      base: { low: 99, high: 129 },
      perUnit: { low: 0.6, high: 1.1 },
      options: [
        { id: 'both', label: 'Clean both sides', multiplier: 1.5, checkbox: true },
        { id: 'stain', label: 'Add stain and seal', multiplier: 2.2, checkbox: true },
      ],
    },
  ],
};
