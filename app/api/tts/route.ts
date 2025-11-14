// app/api/tts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { kokoroClient } from '@/lib/kokoro/client';
import { getAudioFromCache, saveAudio } from '@/lib/utils/audio';
import { TTSRequest, TTSResponse } from '@/types/rpg';

export async function POST(request: NextRequest) {
  try {
    const body: TTSRequest = await request.json();
    const { text, characterId, sessionId, voiceId, speed = 1.0 } = body;

    // Validações
    if (!text || !sessionId || !voiceId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Parâmetros obrigatórios: text, sessionId, voiceId' 
        } as TTSResponse,
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Texto muito longo (máximo 500 caracteres)' 
        } as TTSResponse,
        { status: 400 }
      );
    }

    // Verificar cache
    const cachedAudio = await getAudioFromCache(text, voiceId);
    if (cachedAudio) {
      console.log('🎯 Áudio encontrado em cache');
      
      // TODO: Salvar mensagem no banco de dados
      // const message = await prisma.message.create({...})
      
      return NextResponse.json({
        success: true,
        audioUrl: cachedAudio,
        messageId: `temp-${Date.now()}`, // TODO: ID real do banco
      } as TTSResponse);
    }

    // Gerar novo áudio
    console.log('🎙️ Gerando novo áudio...');
    const audioBuffer = await kokoroClient.generateSpeech(text, voiceId, { speed });

    // Salvar áudio
    const audioUrl = await saveAudio(audioBuffer, text, voiceId);

    // TODO: Salvar mensagem no banco de dados
    // const message = await prisma.message.create({
    //   data: {
    //     sessionId,
    //     characterId,
    //     text,
    //     type: characterId ? 'dialogue' : 'narration',
    //     audioUrl,
    //   }
    // });

    console.log('✅ Áudio gerado com sucesso');

    return NextResponse.json({
      success: true,
      audioUrl,
      messageId: `temp-${Date.now()}`, // TODO: ID real do banco
    } as TTSResponse);

  } catch (error) {
    console.error('❌ Erro na API TTS:', error);

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    return NextResponse.json(
      { 
        success: false, 
        error: `Erro ao gerar áudio: ${errorMessage}` 
      } as TTSResponse,
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const isHealthy = await kokoroClient.healthCheck();
    
    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'Kokoro TTS',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}