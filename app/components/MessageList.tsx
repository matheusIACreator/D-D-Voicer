'use client';

// components/MessageList.tsx
import { useState, useEffect, useRef } from 'react';
import { Message, Character } from '@/types/rpg';
import { AudioPlayer } from './AudioPlayer';
import { Loader2, User, BookOpen, Trash2, Copy, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MessageListProps {
  sessionId: string;
  characters: Character[];
  messages?: Message[];
  onNewMessage?: (message: Message) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export function MessageList({
  sessionId,
  characters,
  messages: externalMessages,
  onNewMessage,
  onDeleteMessage
}: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>(externalMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll suave
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll quando novas mensagens chegam
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sync com mensagens externas
  useEffect(() => {
    if (externalMessages) {
      setMessages(externalMessages);
    }
  }, [externalMessages]);

  const getCharacterById = (id: string) => {
    return characters.find((char) => char.id === id);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (confirm('Tem certeza que deseja deletar esta mensagem?')) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      onDeleteMessage?.(messageId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.length === 0 && !isLoading && (
          <EmptyState />
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className="animate-fadeIn"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <MessageBubble
              message={message}
              character={message.characterId ? getCharacterById(message.characterId) : undefined}
              onDelete={handleDeleteMessage}
            />
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-4">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Gerando áudio...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button (aparece quando não está no final) */}
      <ScrollToBottomButton
        containerRef={messagesContainerRef}
        onClick={scrollToBottom}
      />
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  character?: Character;
  onDelete?: (messageId: string) => void;
}

function MessageBubble({ message, character, onDelete }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const messageTypeStyles = {
    narration: 'bg-gradient-to-r from-purple-500/10 to-transparent border-l-4 border-purple-500',
    dialogue: 'bg-gradient-to-r from-blue-500/10 to-transparent border-l-4 border-blue-500',
    action: 'bg-gradient-to-r from-green-500/10 to-transparent border-l-4 border-green-500',
  };

  const messageTypeIcons = {
    narration: <BookOpen className="w-4 h-4" />,
    dialogue: <User className="w-4 h-4" />,
    action: <span className="text-lg">⚔️</span>,
  };

  const messageTypeLabels = {
    narration: 'Narração',
    dialogue: 'Diálogo',
    action: 'Ação',
  };

  const messageTypeColors = {
    narration: 'text-purple-400',
    dialogue: 'text-blue-400',
    action: 'text-green-400',
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative p-4 rounded-lg transition-all duration-200 ${messageTypeStyles[message.type]} ${isHovered ? 'shadow-lg' : ''
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={messageTypeColors[message.type]}>
            {messageTypeIcons[message.type]}
          </div>
          <span className={`text-xs font-medium ${messageTypeColors[message.type]}`}>
            {messageTypeLabels[message.type]}
          </span>
          {character && (
            <>
              <span className="text-gray-600">•</span>
              <div className="flex items-center gap-2">
                {character.imageUrl && (
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-700">
                    <img
                      src={character.imageUrl}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="text-xs text-gray-300 font-semibold">
                  {character.name}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(message.timestamp), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>

          {/* Action Buttons (aparecem no hover) */}
          {isHovered && !message.isGenerating && (
            <div className="flex gap-1">
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
                title="Copiar texto"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-400" />
                )}
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors"
                  title="Deletar mensagem"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Message Text */}
      <p className="text-white mb-3 leading-relaxed whitespace-pre-wrap">
        {message.text}
      </p>

      {/* Audio Player */}
      {message.audioUrl && !message.isGenerating && (
        <div className="mt-3">
          <AudioPlayer src={message.audioUrl} />
        </div>
      )}

      {/* Generating Indicator */}
      {message.isGenerating && (
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Gerando áudio...</span>
          <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-pulse w-1/2" />
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
      <div className="relative mb-6">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-gray-500 opacity-50" />
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 bg-purple-500/20 rounded-full animate-ping" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Nenhuma mensagem ainda
      </h3>
      <p className="text-gray-400 max-w-md">
        Comece sua aventura adicionando uma narração, diálogo ou ação usando
        os controles abaixo
      </p>
      <div className="mt-6 flex gap-2 text-sm text-gray-500">
        <span className="px-3 py-1 bg-purple-500/10 rounded-full">📖 Narração</span>
        <span className="px-3 py-1 bg-blue-500/10 rounded-full">💬 Diálogo</span>
        <span className="px-3 py-1 bg-green-500/10 rounded-full">⚔️ Ação</span>
      </div>
    </div>
  );
}

interface ScrollToBottomButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onClick: () => void;
}

function ScrollToBottomButton({ containerRef, onClick }: ScrollToBottomButtonProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShow(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="absolute bottom-24 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
      aria-label="Rolar para o final"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>
  );
}