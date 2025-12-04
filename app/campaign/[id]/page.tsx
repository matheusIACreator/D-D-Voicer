'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Settings, Users as UsersIcon } from 'lucide-react';
import { Character, Message } from '@/types/rpg';
import { CharacterCard } from '@/app/components/CharacterCard';
import { MessageList } from '@/app/components/MessageList';
import { SessionControls } from '@/app/components/SessionControls';

// Mock data - substituir por dados reais do banco
const mockCharacters: Character[] = [
    {
        id: '1',
        name: 'Thorin Escudo de Ferro',
        voiceId: 'af_bella',
        description: 'Um anão guerreiro corajoso e leal',
        alignment: 'good',
        race: 'Anão',
        class: 'Guerreiro',
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        name: 'Elara Cantoluz',
        voiceId: 'af_sky',
        description: 'Uma elfa clériga sábia e compassiva',
        alignment: 'good',
        race: 'Elfa',
        class: 'Clériga',
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export default function CampaignPage() {
    const params = useParams();
    const router = useRouter();
    const campaignId = params.id as string;

    const [characters, setCharacters] = useState<Character[]>(mockCharacters);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showCharacterSelector, setShowCharacterSelector] = useState(false);

    // Mock campaign data
    const campaign = {
        id: campaignId,
        name: campaignId === 'new' ? 'Nova Campanha' : 'A Busca pelo Artefato Perdido',
        description: 'Uma aventura épica através das terras selvagens',
    };

    const handleGenerateSpeech = async (
        text: string,
        characterId: string | null,
        type: 'narration' | 'dialogue' | 'action'
    ) => {
        setIsGenerating(true);

        try {
            // Buscar a voz do personagem
            const character = characters.find((c) => c.id === characterId);
            const voiceId = character?.voiceId || 'am_michael'; // Narrador padrão

            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    characterId,
                    sessionId: campaignId,
                    voiceId,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Erro ao gerar áudio');
            }

            // Adicionar mensagem à lista
            const newMessage: Message = {
                id: data.messageId,
                sessionId: campaignId,
                characterId: characterId || undefined,
                type,
                text,
                audioUrl: data.audioUrl,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, newMessage]);
            console.log('Áudio gerado:', data.audioUrl);
        } catch (error) {
            console.error('Erro ao gerar fala:', error);
            alert('Erro ao gerar áudio. Tente novamente.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-400" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
                                {campaign.description && (
                                    <p className="text-sm text-gray-400">{campaign.description}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowCharacterSelector(!showCharacterSelector)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                <UsersIcon className="w-4 h-4" />
                                Personagens ({characters.length})
                            </button>
                            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                <Settings className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Character Selector Sidebar */}
            {showCharacterSelector && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowCharacterSelector(false)}>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-96 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Personagens</h2>
                            <button
                                onClick={() => setShowCharacterSelector(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {characters.map((character) => (
                                <CharacterCard
                                    key={character.id}
                                    character={character}
                                    showDetails={true}
                                />
                            ))}

                            <button className="w-full p-4 border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-lg text-gray-400 hover:text-blue-400 transition-colors flex items-center justify-center gap-2">
                                <Plus className="w-5 h-5" />
                                Adicionar Personagem
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 overflow-hidden">
                    <MessageList
                        sessionId={campaignId}
                        characters={characters}
                        messages={messages}
                    />
                </div>

                {/* Controls Area */}
                <SessionControls
                    sessionId={campaignId}
                    characters={characters}
                    onGenerateSpeech={handleGenerateSpeech}
                    isGenerating={isGenerating}
                />
            </div>
        </div>
    );
}