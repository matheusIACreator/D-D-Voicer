// lib/kokoro/voices.ts
import { VoiceConfig } from '@/types/rpg';

export const VOICE_PRESETS: Record<string, VoiceConfig> = {
  // Vozes Masculinas
  WARRIOR_DEEP: {
    id: 'af_bella',
    name: 'Guerreiro Profundo',
    description: 'Voz grave e imponente, ideal para guerreiros e paladinos',
    gender: 'male',
    ageRange: 'adult',
    personality: ['corajoso', 'forte', 'confiável'],
  },
  WIZARD_OLD: {
    id: 'af_nicole',
    name: 'Mago Ancião',
    description: 'Voz sábia e pausada, perfeita para magos experientes',
    gender: 'male',
    ageRange: 'old',
    personality: ['sábio', 'misterioso', 'paciente'],
  },
  ROGUE_RASPY: {
    id: 'af_sarah',
    name: 'Ladino Astuto',
    description: 'Voz rouca e ágil, ideal para ladinos e assassinos',
    gender: 'male',
    ageRange: 'adult',
    personality: ['esperto', 'ágil', 'sarcástico'],
  },
  BARD_CHARMING: {
    id: 'am_adam',
    name: 'Bardo Carismático',
    description: 'Voz encantadora e melodiosa',
    gender: 'male',
    ageRange: 'young',
    personality: ['carismático', 'alegre', 'persuasivo'],
  },

  // Vozes Femininas
  CLERIC_SOFT: {
    id: 'af_sky',
    name: 'Clériga Gentil',
    description: 'Voz suave e reconfortante, perfeita para clérigas',
    gender: 'female',
    ageRange: 'adult',
    personality: ['gentil', 'compassiva', 'protetora'],
  },
  RANGER_CONFIDENT: {
    id: 'bf_emma',
    name: 'Patrulheira Confiante',
    description: 'Voz firme e determinada',
    gender: 'female',
    ageRange: 'adult',
    personality: ['determinada', 'independente', 'corajosa'],
  },
  SORCERESS_MYSTICAL: {
    id: 'bf_isabella',
    name: 'Feiticeira Mística',
    description: 'Voz etérea e poderosa',
    gender: 'female',
    ageRange: 'adult',
    personality: ['misteriosa', 'poderosa', 'enigmática'],
  },

  // Narrador
  NARRATOR: {
    id: 'am_michael',
    name: 'Narrador',
    description: 'Voz neutra e clara para narração',
    gender: 'neutral',
    ageRange: 'adult',
    personality: ['neutro', 'claro', 'envolvente'],
  },

  // Vilões
  VILLAIN_MENACING: {
    id: 'bf_emma',
    name: 'Vilão Ameaçador',
    description: 'Voz intimidadora e sombria',
    gender: 'male',
    ageRange: 'adult',
    personality: ['ameaçador', 'cruel', 'intimidador'],
  },
  DRAGON: {
    id: 'bf_isabella',
    name: 'Dragão',
    description: 'Voz profunda e majestosa',
    gender: 'neutral',
    ageRange: 'old',
    personality: ['majestoso', 'poderoso', 'antigo'],
  },
};

export type VoicePresetId = keyof typeof VOICE_PRESETS;

export function getVoiceById(id: string): VoiceConfig | undefined {
  return Object.values(VOICE_PRESETS).find(voice => voice.id === id);
}

export function getVoicesByGender(gender: 'male' | 'female' | 'neutral'): VoiceConfig[] {
  return Object.values(VOICE_PRESETS).filter(voice => voice.gender === gender);
}

export function getAllVoices(): VoiceConfig[] {
  return Object.values(VOICE_PRESETS);
}