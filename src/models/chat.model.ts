export type MessageAuthor = 'user' | 'ai';

export enum MessageType {
  TEXT = 'text',
  STEP = 'step',
  CODE = 'code',
  ARTIFACT = 'artifact',
  ERROR = 'error'
}

export interface ChatMessage {
  id: number;
  author: MessageAuthor;
  type: MessageType;
  text: string;
  timestamp: Date;
}

export interface CodeFile {
  path: string;
  content: string;
}

export interface ChatConfig {
  model: 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gemini-live-2.5-flash-preview';
  strictness: number;
  runtimeBudget: number; // in seconds
  testingDepth: 'smoke' | 'unit' | 'integration';
  securityLevel: 'none' | 'basic' | 'hardened';
  styleGuide: 'PEP8' | 'Google' | 'Airbnb' | 'StandardJS';
  language: string;
  systemPrompt: string;
}