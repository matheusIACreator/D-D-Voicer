'use client';

// components/SessionControls.tsx
import { useState } from 'react';
import { Character } from '@/types/rpg';
import { Send, Loader2, Mic } from 'lucide-react';

interface SessionControlsProps {
  sessionId: string;
  characters: Character[];
  onGenerateSpeech: (text: string, characterId: string | null, type: 'narration' | 'dialogue' | 'action') => Promise<void>;
  isGenerating?: boolean;
}

export function SessionControls({
  sessionId,
  characters,
  onGenerateSpeech,
  isGenerating = false,
}: SessionControlsProps) {
  const [inputText, setInputText] = useState('');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'narration' | 'dialogue' | 'action'>('dialogue');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim() || isGenerating) return;

    try {
      await onGenerateSpeech(inputText, selectedCharacterId, messageType);
      setInputText('');
    } catch (error) {
      console.error('Erro ao gerar fala:', error);
    }
  };

  const messageTypeOptions = [
    { value: 'narration', label: '📖 Narração', color: 'purple' },
    { value: 'dialogue', label: '💬 Diálogo', color: 'blue' },
    { value: 'action', label: '⚔️ Ação', color: 'green' },
  ] as const;

  return (
    <div className="border-t border-gray-700 bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Message Type Selector */}
        <div className="flex gap-2">
          {messageTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMessageType(option.value)}
              className={`
                flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${
                  messageType === option.value
                    ? `bg-${option.color}-500/20 text-${option.color}-400 border border-${option.color}-500/50`
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Character Selector - Only for dialogue */}
        {messageType === 'dialogue' && (
          <select
            value={selectedCharacterId || ''}
            onChange={(e) => setSelectedCharacterId(e.target.value || null)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="">🎭 Narrador</option>
            {characters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name} ({char.class})
              </option>
            ))}
          </select>
        )}

        {/* Text Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={
                messageType === 'narration'
                  ? 'Descreva o que acontece...'
                  : messageType === 'dialogue'
                  ? 'Digite o diálogo...'
                  : 'Descreva a ação...'
              }
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
              rows={3}
              disabled={isGenerating}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {inputText.length} / 500
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Gerar
              </>
            )}
          </button>
        </div>

        {/* Quick Tips */}
        <div className="text-xs text-gray-500">
          💡 Dica: Pressione <kbd className="px-1 bg-gray-800 rounded">Enter</kbd> para enviar,{' '}
          <kbd className="px-1 bg-gray-800 rounded">Shift + Enter</kbd> para nova linha
        </div>
      </form>
    </div>
  );
}