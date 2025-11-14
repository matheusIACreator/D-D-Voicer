// types/rpg.ts

export interface Character {
    id: string;
    name: string;
    voiceId: string;
    description: string;
    alignment: 'good' | 'neutral' | 'evil';
    race: string;
    class: string;
    imageUrl?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Message {
    id: string;
    sessionId: string;
    timestamp: Date;
    type: 'narration' | 'dialogue' | 'action';
    characterId?: string;
    text: string;
    audioUrl?: string;
    isGenerating?: boolean;
  }
  
  export interface Session {
    id: string;
    campaignName: string;
    description?: string;
    date: Date;
    userId: string;
    messages: Message[];
    characters: Character[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface VoiceConfig {
    id: string;
    name: string;
    description: string;
    gender: 'male' | 'female' | 'neutral';
    ageRange: 'young' | 'adult' | 'old';
    personality: string[];
    sampleUrl?: string;
  }
  
  export interface TTSRequest {
    text: string;
    characterId?: string;
    sessionId: string;
    voiceId: string;
    speed?: number;
  }
  
  export interface TTSResponse {
    success: boolean;
    audioUrl?: string;
    messageId?: string;
    error?: string;
  }