export enum AppStep {
  UPLOAD_PORTRAIT,
  CHOOSE_SCENE_SOURCE,
  CHOOSE_OUTFIT,
  USE_CAMERA,
  GENERATING,
  RESULTS,
  COMPARE,
  PORTFOLIO,
}

export enum OutfitStyle {
  CASUAL = 'Casual',
  FORMAL = 'Formal',
  ARTISTIC = 'Artistic',
  CUSTOM = 'Custom',
}

export const SHOT_TYPES = ['Closeup Shot', 'Medium Close-up Shot', 'Knees-Up Medium Wide Shot'] as const;
export type ShotType = typeof SHOT_TYPES[number];

export interface GeneratedShot {
  id: string;
  url: string; // base64 data URL
  prompt: string;
  style: OutfitStyle;
  shotType: ShotType;
}