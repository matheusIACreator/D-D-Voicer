'use client';

// components/CharacterCard.tsx
import { Character } from '@/types/rpg';
import { Swords, Shield, Wand2, Music } from 'lucide-react';
import Image from 'next/image';

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onSelect?: (character: Character) => void;
  showDetails?: boolean;
}

const classIcons: Record<string, React.ReactNode> = {
  warrior: <Swords className="w-5 h-5" />,
  paladin: <Shield className="w-5 h-5" />,
  wizard: <Wand2 className="w-5 h-5" />,
  bard: <Music className="w-5 h-5" />,
};

const alignmentColors = {
  good: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  neutral: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  evil: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function CharacterCard({
  character,
  isSelected = false,
  onSelect,
  showDetails = true,
}: CharacterCardProps) {
  return (
    <div
      onClick={() => onSelect?.(character)}
      className={`
        relative p-4 rounded-lg border-2 transition-all cursor-pointer
        hover:shadow-lg hover:scale-105
        ${
          isSelected
            ? 'border-blue-500 bg-blue-500/10 shadow-blue-500/50'
            : 'border-gray-700 bg-gray-800 hover:border-gray-600'
        }
      `}
    >
      {/* Character Image */}
      <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-gray-900">
        {character.imageUrl ? (
          <Image
            src={character.imageUrl}
            alt={character.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            {classIcons[character.class.toLowerCase()] || <Swords className="w-12 h-12" />}
          </div>
        )}
      </div>

      {/* Character Info */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg text-white truncate">{character.name}</h3>

        {showDetails && (
          <>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">{character.race}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400">{character.class}</span>
            </div>

            {/* Alignment Badge */}
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                alignmentColors[character.alignment]
              }`}
            >
              {character.alignment === 'good' && '✨ Bom'}
              {character.alignment === 'neutral' && '⚖️ Neutro'}
              {character.alignment === 'evil' && '💀 Maligno'}
            </div>

            {/* Description */}
            {character.description && (
              <p className="text-sm text-gray-400 line-clamp-2 mt-2">
                {character.description}
              </p>
            )}
          </>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
}