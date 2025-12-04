// lib/kokoro/client.ts
import axios from 'axios';
import { spawn } from 'child_process';
import path from 'path';

export interface KokoroOptions {
  speed?: number;
  temperature?: number;
  useLocal?: boolean;
}

export class KokoroClient {
  private apiUrl: string;
  private apiKey: string | undefined;
  private useLocal: boolean;
  private useReplicate: boolean;
  private replicateToken: string | undefined;
  private useElevenLabs: boolean;
  private elevenLabsKey: string | undefined;

  constructor() {
    this.apiUrl = process.env.KOKORO_API_URL ||
      'https://api-inference.huggingface.co/models/hexgrad/Kokoro-82M';
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.useLocal = process.env.USE_LOCAL_TTS === 'true';
    this.useReplicate = process.env.USE_REPLICATE === 'true';
    this.replicateToken = process.env.REPLICATE_API_TOKEN;
    this.useElevenLabs = process.env.USE_ELEVENLABS === 'true';
    this.elevenLabsKey = process.env.ELEVENLABS_API_KEY;
  }

  /**
   * Mapeamento de vozes para ElevenLabs
   */
  private mapVoiceToElevenLabs(voiceId: string): string {
    const voiceMap: Record<string, string> = {
      // Vozes masculinas
      'af_bella': 'pNInz6obpgDQGcFmaJgB', // Adam
      'af_nicole': '21m00Tcm4TlvDq8ikWAM', // Rachel (pode ser voz velha)
      'af_sarah': 'EXAVITQu4vr4xnSDxMaL', // Bella
      'am_adam': 'pNInz6obpgDQGcFmaJgB', // Adam
      'am_michael': 'flq6f7yk4E4fJM5XTYuZ', // Michael

      // Vozes femininas
      'af_sky': 'EXAVITQu4vr4xnSDxMaL', // Bella
      'bf_emma': '21m00Tcm4TlvDq8ikWAM', // Rachel
      'bf_isabella': 'EXAVITQu4vr4xnSDxMaL', // Bella
    };

    return voiceMap[voiceId] || 'pNInz6obpgDQGcFmaJgB'; // Adam como padrão
  }

  /**
   * Gera áudio usando ElevenLabs API
   */
  private async generateWithElevenLabs(
    text: string,
    voiceId: string,
    options: KokoroOptions = {}
  ): Promise<Buffer> {
    try {
      console.log('🎙️ Usando ElevenLabs API...');

      const elevenLabsVoiceId = this.mapVoiceToElevenLabs(voiceId);

      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`,
        {
          text: text,
          model_id: 'eleven_turbo_v2_5',  // ← Mudou aqui
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            // Removido style e use_speaker_boost
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': this.elevenLabsKey,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
          timeout: 30000,
        }
      );

      console.log('✅ Áudio gerado com ElevenLabs!');
      return Buffer.from(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Erro ElevenLabs:', error.response?.data || error.message);
        throw new Error(`Erro na ElevenLabs API: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Gera áudio usando Replicate API
   */
  private async generateWithReplicate(
    text: string,
    voiceId: string,
    options: KokoroOptions = {}
  ): Promise<Buffer> {
    try {
      console.log('🔄 Usando Replicate API...');

      // Usar modelo Coqui TTS no Replicate
      const response = await axios.post(
        'https://api.replicate.com/v1/predictions',
        {
          version: 'cjwbw/coqui-ai-tts:latest',
          input: {
            text: text,
            speaker: voiceId,
          }
        },
        {
          headers: {
            'Authorization': `Token ${this.replicateToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      // Aguardar processamento
      let prediction = response.data;
      let attempts = 0;
      while ((prediction.status === 'starting' || prediction.status === 'processing') && attempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const statusResponse = await axios.get(
          `https://api.replicate.com/v1/predictions/${prediction.id}`,
          {
            headers: {
              'Authorization': `Token ${this.replicateToken}`,
            }
          }
        );
        prediction = statusResponse.data;
        attempts++;
      }

      if (prediction.status === 'succeeded' && prediction.output) {
        // Baixar áudio da URL gerada
        const audioResponse = await axios.get(prediction.output, {
          responseType: 'arraybuffer'
        });
        console.log('✅ Áudio gerado com Replicate!');
        return Buffer.from(audioResponse.data);
      } else {
        throw new Error(`Replicate failed: ${prediction.error || 'Unknown error'}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Erro Replicate:', error.response?.data || error.message);
        throw new Error(`Erro na Replicate API: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Gera áudio usando a melhor opção disponível
   */
  async generateSpeech(
    text: string,
    voiceId: string,
    options: KokoroOptions = {}
  ): Promise<Buffer> {
    // Usar local se configurado
    if (this.useLocal) {
      return this.generateSpeechLocal(text, voiceId, options);
    }

    // Usar ElevenLabs se configurado (PRIORIDADE)
    if (this.useElevenLabs && this.elevenLabsKey) {
      return this.generateWithElevenLabs(text, voiceId, options);
    }

    // Usar Replicate se configurado
    if (this.useReplicate && this.replicateToken) {
      return this.generateWithReplicate(text, voiceId, options);
    }

    // MOCK: Retornar áudio de silêncio como placeholder
    console.warn('⚠️ Usando áudio MOCK (silêncio). Configure ElevenLabs, Replicate ou Python local!');
    return this.generateMockAudio(text);
  }

  /**
   * Gera áudio mock (silêncio) - placeholder
   */
  private generateMockAudio(text: string): Buffer {
    // Gerar WAV de silêncio de 2 segundos
    const sampleRate = 24000;
    const duration = 2; // segundos
    const numSamples = sampleRate * duration;

    // WAV header (44 bytes) + dados
    const buffer = Buffer.alloc(44 + numSamples * 2);

    // WAV header
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + numSamples * 2, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16); // fmt chunk size
    buffer.writeUInt16LE(1, 20);  // PCM
    buffer.writeUInt16LE(1, 22);  // mono
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * 2, 28);
    buffer.writeUInt16LE(2, 32);  // block align
    buffer.writeUInt16LE(16, 34); // bits per sample
    buffer.write('data', 36);
    buffer.writeUInt32LE(numSamples * 2, 40);

    // Dados (silêncio = zeros)
    for (let i = 0; i < numSamples; i++) {
      buffer.writeInt16LE(0, 44 + i * 2);
    }

    return buffer;
  }

  /**
   * Gera áudio localmente usando Python
   */
  private async generateSpeechLocal(
    text: string,
    voiceId: string,
    options: KokoroOptions = {}
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(process.cwd(), 'scripts', 'kokoro_tts.py');

      const python = spawn('python3', [
        scriptPath,
        text,
        voiceId,
        String(options.speed || 1.0),
      ]);

      let buffer = Buffer.alloc(0);
      const chunks: Buffer[] = [];

      python.stdout.on('data', (data: Buffer) => {
        chunks.push(data);
      });

      python.stderr.on('data', (data: Buffer) => {
        console.error('Erro Python:', data.toString());
      });

      python.on('close', (code) => {
        if (code === 0) {
          buffer = Buffer.concat(chunks);
          resolve(buffer);
        } else {
          reject(new Error(`Processo Python terminou com código ${code}`));
        }
      });

      python.on('error', (error) => {
        reject(new Error(`Erro ao executar Python: ${error.message}`));
      });
    });
  }

  /**
   * Verifica se o modelo está disponível
   */
  async healthCheck(): Promise<boolean> {
    if (this.useElevenLabs && this.elevenLabsKey) {
      try {
        const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
          headers: { 'xi-api-key': this.elevenLabsKey },
          timeout: 5000,
        });
        return response.status === 200;
      } catch {
        return false;
      }
    }

    if (this.useReplicate && this.replicateToken) {
      try {
        const response = await axios.get('https://api.replicate.com/v1/models', {
          headers: { 'Authorization': `Token ${this.replicateToken}` },
          timeout: 5000,
        });
        return response.status === 200;
      } catch {
        return false;
      }
    }

    // Mock sempre retorna true
    return true;
  }
}

// Singleton instance
export const kokoroClient = new KokoroClient();