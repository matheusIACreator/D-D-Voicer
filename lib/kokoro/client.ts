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

  constructor() {
    this.apiUrl = process.env.KOKORO_API_URL || 
                  'https://api-inference.huggingface.co/models/hexgrad/Kokoro-82M';
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.useLocal = process.env.USE_LOCAL_TTS === 'true';
  }

  /**
   * Gera áudio usando a API do Hugging Face
   */
  async generateSpeech(
    text: string, 
    voiceId: string,
    options: KokoroOptions = {}
  ): Promise<Buffer> {
    if (this.useLocal) {
      return this.generateSpeechLocal(text, voiceId, options);
    }

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          inputs: text,
          parameters: {
            speaker: voiceId,
            speed: options.speed || 1.0,
            temperature: options.temperature || 0.7,
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
          timeout: 30000, // 30 segundos
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Erro na API do Hugging Face: ${error.message}`);
      }
      throw error;
    }
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
    try {
      if (this.useLocal) {
        // Verificar se Python e dependências estão disponíveis
        return new Promise((resolve) => {
          const python = spawn('python3', ['-c', 'import torch; print("ok")']);
          python.on('close', (code) => resolve(code === 0));
          python.on('error', () => resolve(false));
        });
      } else {
        // Verificar API do HF
        const response = await axios.get(this.apiUrl, {
          headers: { 'Authorization': `Bearer ${this.apiKey}` },
          timeout: 5000,
        });
        return response.status === 200;
      }
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const kokoroClient = new KokoroClient();