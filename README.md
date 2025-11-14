# 🎲 D&D Voicer

Aplicação para adicionar vozes narradas aos personagens e histórias de Dungeons & Dragons usando o modelo Kokoro-82M TTS.

## ✨ Funcionalidades

- 🎙️ **Geração de Voz**: Converte texto em áudio usando IA
- 🎭 **Múltiplas Vozes**: Diferentes vozes para cada personagem
- 📖 **Tipos de Mensagem**: Narração, diálogo e ações
- 💾 **Cache de Áudio**: Reutiliza áudios já gerados
- 🎨 **Interface Intuitiva**: Design moderno e responsivo
- 📊 **Gerenciamento de Sessões**: Organize suas campanhas

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Prisma** - ORM para banco de dados
- **Kokoro-82M** - Modelo de Text-to-Speech
- **Hugging Face** - API de modelos de IA

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- Python 3.9+ (para uso local do modelo)
- PostgreSQL (ou SQLite para desenvolvimento)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/matheusIACreator/D-D-Voicer.git
cd D-D-Voicer
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o `.env` e adicione suas chaves:
- `HUGGINGFACE_API_KEY`: Sua chave da API do Hugging Face
- `DATABASE_URL`: URL do seu banco de dados

4. **Configure o banco de dados**
```bash
npm run db:push
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse: http://localhost:3000

## 🎯 Uso Local do Modelo (Opcional)

Para usar o modelo Kokoro localmente no seu Mac M2:

1. **Instale as dependências Python**
```bash
pip3 install torch transformers torchaudio --break-system-packages
```

2. **Configure o `.env`**
```env
USE_LOCAL_TTS="true"
```

3. **Torne o script executável**
```bash
chmod +x scripts/kokoro_tts.py
```

## 🗂️ Estrutura do Projeto

```
dnd-voicer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── tts/          # API de geração de TTS
│   │   ├── campaign/         # Páginas de campanha
│   │   └── page.tsx          # Home
│   ├── components/           # Componentes React
│   ├── lib/
│   │   ├── kokoro/          # Cliente Kokoro
│   │   ├── db/              # Prisma client
│   │   └── utils/           # Utilitários
│   └── types/               # TypeScript types
├── public/
│   └── audio/               # Áudios gerados
├── prisma/
│   └── schema.prisma        # Schema do banco
└── scripts/
    └── kokoro_tts.py        # Script Python TTS
```

## 🎮 Como Usar

1. **Crie Personagens**: Adicione seus personagens com vozes específicas
2. **Inicie uma Sessão**: Crie uma nova sessão de jogo
3. **Adicione Mensagens**: 
   - Escolha entre Narração, Diálogo ou Ação
   - Selecione o personagem (para diálogos)
   - Digite o texto
   - Gere o áudio
4. **Reproduza**: Ouça as mensagens com as vozes geradas

## 🔧 Configuração de Vozes

As vozes pré-configuradas estão em `src/lib/kokoro/voices.ts`:

```typescript
WARRIOR_DEEP: 'Guerreiro Profundo'
WIZARD_OLD: 'Mago Ancião'
CLERIC_SOFT: 'Clériga Gentil'
NARRATOR: 'Narrador'
// ... e mais
```

## 📝 Comandos Úteis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run lint         # Lint do código
npm run db:studio    # Abre Prisma Studio
npm run db:push      # Sincroniza schema com banco
```

## 🐛 Troubleshooting

### Erro 403 no Git Push
```bash
git credential-osxkeychain erase <<EOF
host=github.com
protocol=https

EOF
```

### Modelo não carrega no Mac M2
- Certifique-se de ter pelo menos 8GB de RAM livre
- Use `USE_LOCAL_TTS="false"` para usar a API

### Áudio não gera
- Verifique sua chave do Hugging Face
- Teste o endpoint: `curl http://localhost:3000/api/tts`

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

**Matheus** - [GitHub](https://github.com/matheusIACreator)

---

⭐ Se este projeto te ajudou, considere dar uma estrela!