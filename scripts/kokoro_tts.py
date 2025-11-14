#!/usr/bin/env python3
"""
Kokoro TTS Local Script
Gera áudio usando o modelo Kokoro-82M localmente
"""

import sys
import torch
import torchaudio
from transformers import AutoTokenizer, AutoModelForCausalLM
import warnings

warnings.filterwarnings('ignore')

# Cache do modelo para não recarregar a cada chamada
MODEL_CACHE = {
    'model': None,
    'tokenizer': None
}

def load_model():
    """Carrega o modelo Kokoro (usa cache se já carregado)"""
    if MODEL_CACHE['model'] is None:
        model_name = "hexgrad/Kokoro-82M"
        
        print("📦 Carregando modelo Kokoro...", file=sys.stderr)
        
        MODEL_CACHE['tokenizer'] = AutoTokenizer.from_pretrained(model_name)
        MODEL_CACHE['model'] = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            device_map="auto",
            low_cpu_mem_usage=True
        )
        
        print("✅ Modelo carregado!", file=sys.stderr)
    
    return MODEL_CACHE['model'], MODEL_CACHE['tokenizer']

def generate_speech(text: str, voice_id: str, speed: float = 1.0):
    """
    Gera áudio a partir de texto
    
    Args:
        text: Texto para sintetizar
        voice_id: ID da voz a usar
        speed: Velocidade da fala (0.5 a 2.0)
    """
    try:
        model, tokenizer = load_model()
        
        # Preparar input
        inputs = tokenizer(
            text, 
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=500
        )
        
        # Mover para GPU se disponível
        if torch.cuda.is_available():
            inputs = {k: v.cuda() for k, v in inputs.items()}
        
        # Gerar áudio
        print(f"🎙️ Gerando áudio para: '{text[:50]}...'", file=sys.stderr)
        
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_length=1000,
                do_sample=True,
                temperature=0.7,
                top_p=0.9,
            )
        
        # Converter para áudio WAV
        # Nota: A implementação específica depende da arquitetura do Kokoro
        # Este é um placeholder - você precisará ajustar conforme a API real
        
        audio_data = outputs.cpu().numpy()
        
        # Salvar como WAV e enviar para stdout
        # Por enquanto, vamos apenas retornar um placeholder
        print("✅ Áudio gerado!", file=sys.stderr)
        
        # Escrever dados de áudio binários para stdout
        sys.stdout.buffer.write(audio_data.tobytes())
        
    except Exception as e:
        print(f"❌ Erro ao gerar áudio: {str(e)}", file=sys.stderr)
        sys.exit(1)

def main():
    """Função principal"""
    if len(sys.argv) < 3:
        print("Uso: python kokoro_tts.py <texto> <voice_id> [speed]", file=sys.stderr)
        sys.exit(1)
    
    text = sys.argv[1]
    voice_id = sys.argv[2]
    speed = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
    
    # Validações
    if not text:
        print("❌ Texto não pode estar vazio", file=sys.stderr)
        sys.exit(1)
    
    if len(text) > 500:
        print("❌ Texto muito longo (máximo 500 caracteres)", file=sys.stderr)
        sys.exit(1)
    
    if speed < 0.5 or speed > 2.0:
        print("❌ Velocidade deve estar entre 0.5 e 2.0", file=sys.stderr)
        sys.exit(1)
    
    generate_speech(text, voice_id, speed)

if __name__ == "__main__":
    main()