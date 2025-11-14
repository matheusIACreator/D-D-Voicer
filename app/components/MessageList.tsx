'use client';

// components/VoiceSelector.tsx
import { useState } from 'react';
import { VoiceConfig } from '@/types/rpg';
import { getAllVoices, getVoicesByGender } from '@/lib/kokoro/voices';
import { Play } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoiceId?: string;
  onSelectVoice: (voiceId: string) => void;
  filterGender?: 'male' | 'female' | 'neutral' | 'all';
}

export function VoiceSelector({
  selectedVoiceId,
  onSelectVoice,
  filterGender = 'all',
}: VoiceSelectorProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'male' | 'female' | 'neutral'>(
    filterGender
  );

  const voices =
    selectedFilter === 'all'
      ? getAllVoices()
      : getVoicesByGender(selectedFilter);

  const genderLabels = {
    all: 'Todas',
    male: 'Masculinas',
    female: 'Femininas',
    neutral: 'Neutras',
  };

  const genderIcons = {
    male: '♂️',
    female: '♀️',
    neutral: '⚪',
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        {(['all', 'male', 'female', 'neutral'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`
              px-4 py-2 text-sm font-medium transition-colors relative
              ${
                selectedFilter === filter
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }
            `}
          >
            {genderLabels[filter]}
            {selectedFilter === filter && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      {/* Voice List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {voices.map((voice) => (
          <VoiceCard
            key={voice.id}
            voice={voice}
            isSelected={selectedVoiceId === voice.id}
            onSelect={() => onSelectVoice(voice.id)}
          />
        ))}
      </div>

      {voices.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          Nenhuma voz encontrada para este filtro
        </div>
      )}
    </div>
  );
}

interface VoiceCardProps {
  voice: VoiceConfig;
  isSelected: boolean;
  onSelect: () => void;
}

function VoiceCard({ voice, isSelected, onSelect }: VoiceCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlaySample = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implementar preview da voz
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const genderColors = {
    male: 'bg-blue-500/20 text-blue-400',
    female: 'bg-pink-500/20 text-pink-400',
    neutral: 'bg-gray-500/20 text-gray-400',
  };

  const ageLabels = {
    young: 'Jovem',
    adult: 'Adulto',
    old: 'Idoso',
  };

  return (
    <div
      onClick={onSelect}
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all
        hover:shadow-lg
        ${
          isSelected
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-700 bg-gray-800 hover:border-gray-600'
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{voice.name}</h4>
          <p className="text-xs text-gray-400">{voice.description}</p>
        </div>

        {/* Play Sample Button */}
        {voice.sampleUrl && (
          <button
            onClick={handlePlaySample}
            disabled={isPlaying}
            className="ml-2 p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
            aria-label="Ouvir amostra"
          >
            <Play className="w-4 h-4 text-blue-400" />
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        <span className={`text-xs px-2 py-1 rounded-full ${genderColors[voice.gender]}`}>
          {voice.gender === 'male' && '♂️ Masculino'}
          {voice.gender === 'female' && '♀️ Feminino'}
          {voice.gender === 'neutral' && '⚪ Neutro'}
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
          {ageLabels[voice.ageRange]}
        </span>
      </div>

      {/* Personality Traits */}
      <div className="flex flex-wrap gap-1 mt-2">
        {voice.personality.slice(0, 3).map((trait) => (
          <span key={trait} className="text-xs text-gray-500">
            #{trait}
          </span>
        ))}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="mt-3 flex items-center gap-2 text-xs text-blue-400">
          <svg
            className="w-4 h-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          Selecionada
        </div>
      )}
    </div>
  );
}