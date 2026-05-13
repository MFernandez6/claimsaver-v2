/**
 * Florida PIP–oriented milestone templates (offsets in days from accident date).
 * Used for calendar / reminder generation — general information, not legal advice.
 * @see Audit prototype claimsaverplus-audit-prototype.jsx MILESTONES
 */
export type FloridaPipMilestoneTemplate = {
  id: number;
  dayOffset: number;
  label: string;
  description: string;
  critical: boolean;
};

export const FLORIDA_PIP_MILESTONE_TEMPLATES: FloridaPipMilestoneTemplate[] = [
  {
    id: 1,
    dayOffset: 0,
    label: "Accident date",
    description: "Date of the motor vehicle accident",
    critical: true,
  },
  {
    id: 2,
    dayOffset: 14,
    label: "14-day treatment window",
    description:
      "Initial medical treatment often must begin within 14 days for full PIP eligibility—confirm timing with your policy and a licensed professional if unsure.",
    critical: true,
  },
  {
    id: 3,
    dayOffset: 30,
    label: "PIP application / notice",
    description:
      "Written notice of claim to your insurer—timing varies; track your carrier’s requirements.",
    critical: true,
  },
  {
    id: 4,
    dayOffset: 35,
    label: "Insurer acknowledgement (illustrative)",
    description:
      "Many carriers acknowledge within days of notice—your adjuster’s timeline may differ.",
    critical: false,
  },
  {
    id: 5,
    dayOffset: 60,
    label: "Medical bills & records",
    description: "Gather and submit bills and related records as treatment progresses.",
    critical: true,
  },
  {
    id: 6,
    dayOffset: 90,
    label: "Payment / denial (illustrative)",
    description:
      "Insurer processing timelines vary after bills are received—follow up on outstanding items.",
    critical: true,
  },
  {
    id: 7,
    dayOffset: 365,
    label: "Suit limitation (verify)",
    description:
      "Statutes of limitation are fact-specific—consult a licensed attorney about any suit deadline.",
    critical: false,
  },
];
