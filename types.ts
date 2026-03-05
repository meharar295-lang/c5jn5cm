export enum GenerationMode {
  THUMBNAIL = 'THUMBNAIL',
  CARTOON = 'CARTOON',
  VIDEO = 'VIDEO',
  STORY_IMAGE = 'STORY_IMAGE',
  SOCIAL = 'SOCIAL',
  VERTICAL_STORY = 'VERTICAL_STORY',
}

export enum ImageQuality {
  STANDARD = 'Standard',
  HIGH = 'High (2K)',
  ULTRA = 'Ultra (4K)',
}

export enum ImageStyle {
  DEFAULT = 'Default',
  PHOTOREALISTIC = 'Photorealistic',
  DIGITAL_ART = 'Digital Art',
  WATERCOLOR = 'Watercolor',
  THREE_D_RENDER = '3D Render',
  PIXEL_ART = 'Pixel Art',
  MINIMALIST = 'Minimalist',
  GOOGLE = 'Google Style',
  CUSTOM = 'Custom...',
}

export enum VideoStyle {
  DEFAULT = 'Default Animation',
  CINEMATIC = 'Cinematic',
  CLAYMATION = 'Claymation',
  ANIME = 'Anime',
  PIXEL_ART = 'Pixel Art',
  STOP_MOTION = 'Stop Motion',
}

export enum VideoFilter {
  NONE = 'None',
  GRAYSCALE = 'Grayscale',
  SEPIA = 'Sepia',
  INVERT = 'Invert',
  VINTAGE = 'Vintage',
  DREAMY = 'Dreamy',
}

export type VideoAspectRatio = '16:9' | '9:16' | '1:1';

export interface OverlayLayer {
  id: string;
  type: 'text' | 'graphic';
  content: string; // text or graphic name
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  rotation?: number;
}

export interface VideoGenerationConfig {
  duration: number; // in seconds
  style: VideoStyle;
  aspectRatio: VideoAspectRatio;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  prompt: string;
  mode: GenerationMode;
  imageStyle: ImageStyle;
  customImageStyle: string;
  imageDataUrl: string;
  quality?: ImageQuality;
}