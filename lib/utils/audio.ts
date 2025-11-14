// lib/utils/audio.ts
import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

/**
 * Gera um hash único para cache de áudio
 */
export function generateAudioHash(text: string, voiceId: string): string {
  return createHash('md5')
    .update(`${text}-${voiceId}`)
    .digest('hex');
}

/**
 * Verifica se um áudio está em cache
 */
export async function getAudioFromCache(
  text: string,
  voiceId: string
): Promise<string | null> {
  const hash = generateAudioHash(text, voiceId);
  const filename = `${hash}.wav`;
  const filepath = path.join(process.cwd(), 'public', 'audio', filename);

  try {
    await fs.access(filepath);
    return `/audio/${filename}`;
  } catch {
    return null;
  }
}

/**
 * Salva um áudio no sistema de arquivos
 */
export async function saveAudio(
  audioBuffer: Buffer,
  text: string,
  voiceId: string
): Promise<string> {
  const hash = generateAudioHash(text, voiceId);
  const filename = `${hash}.wav`;
  const dirpath = path.join(process.cwd(), 'public', 'audio');
  const filepath = path.join(dirpath, filename);

  // Garantir que o diretório existe
  await fs.mkdir(dirpath, { recursive: true });

  // Salvar o arquivo
  await fs.writeFile(filepath, audioBuffer);

  return `/audio/${filename}`;
}

/**
 * Remove áudios antigos do cache (> 7 dias)
 */
export async function cleanOldAudioCache(daysOld: number = 7): Promise<number> {
  const audioDir = path.join(process.cwd(), 'public', 'audio');
  const now = Date.now();
  const maxAge = daysOld * 24 * 60 * 60 * 1000;
  let deletedCount = 0;

  try {
    const files = await fs.readdir(audioDir);

    for (const file of files) {
      const filepath = path.join(audioDir, file);
      const stats = await fs.stat(filepath);
      const age = now - stats.mtime.getTime();

      if (age > maxAge) {
        await fs.unlink(filepath);
        deletedCount++;
      }
    }
  } catch (error) {
    console.error('Erro ao limpar cache de áudio:', error);
  }

  return deletedCount;
}

/**
 * Converte duração de áudio para formato legível
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Estima a duração do áudio baseado no texto
 * (aproximadamente 150 palavras por minuto)
 */
export function estimateAudioDuration(text: string): number {
  const wordCount = text.split(/\s+/).length;
  const wordsPerSecond = 150 / 60;
  return Math.ceil(wordCount / wordsPerSecond);
}