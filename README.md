# 🎲 D&D Voicer

Aplicação para adicionar vozes narradas aos personagens e histórias de Dungeons & Dragons usando Text-to-Speech com IA.

## ✨ Funcionalidades

- 🎙️ **Geração de Voz com IA**: Converte texto em áudio realista usando ElevenLabs
- 🎭 **Múltiplas Vozes**: Diferentes vozes para cada personagem (Adam, Bella, Rachel, Michael)
- 📖 **Tipos de Mensagem**: Narração, diálogo e ações com estilos visuais distintos
- 💾 **Cache Inteligente**: Reutiliza áudios já gerados para economizar recursos
- 🎨 **Interface Moderna**: Design responsivo com animações suaves
- 📊 **Gerenciamento de Campanhas**: Organize suas sessões de D&D
- ⚡ **GPU Acelerada**: Suporte para geração local com NVIDIA GPU

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Prisma ORM** - Gerenciamento de banco de dados
- **MySQL** - Banco de dados relacional
- **ElevenLabs API** - Text-to-Speech de alta qualidade
- **Lucide React** - Ícones SVG
- **date-fns** - Manipulação de datas

## 📦 Instalação

### Pré-requisitos

- **Node.js 18+** 
- **MySQL** (ou PostgreSQL)
- **Python 3.9+** (opcional, para uso local)
- **NVIDIA GPU** (opcional, para geração local)

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

3. **Configure o banco de dados MySQL**

Crie o banco no MySQL Workbench:
```sql
CREATE DATABASE `d-d-voicer` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;
```

4. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz:
```env
# Database
DATABASE_URL="mysql://root:sua_senha@127.0.0.1:3306/d-d-voicer"

# ElevenLabs (Recomendado - 10k caracteres grátis/mês)
USE_ELEVENLABS="true"
ELEVENLABS_API_KEY="sk_xxxxxxxxxxxxxxxxxxxxxxx"

# Outras opções
USE_LOCAL_TTS="false"
USE_REPLICATE="false"
```

**Como obter chaves:**
- **ElevenLabs**: https://elevenlabs.io/app/settings/api-keys (grátis até 10k caracteres/mês)
- **Replicate**: https://replicate.com/account/api-tokens (pago, ~$0.01/requisição)

5. **Sincronize o banco de dados**
```bash
npm run db:push
```

6. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 🎯 Opções de TTS

### 1. **ElevenLabs API** (Recomendado ✅)
- ✅ Melhor qualidade
- ✅ 10.000 caracteres grátis/mês
- ✅ Configuração em 5 minutos
- ✅ Vozes profissionais

```env
USE_ELEVENLABS="true"
ELEVENLABS_API_KEY="sk_xxx"
```

### 2. **Replicate API** (Pago 💰)
- Funciona bem
- ~$0.01 por requisição
- Bom para produção

```env
USE_REPLICATE="true"
REPLICATE_API_TOKEN="r8_xxx"
```

### 3. **GPU Local** (Avançado 🔧)
- Requer GPU NVIDIA (RTX 3050+)
- Instalação complexa
- Mais rápido depois de configurado

Veja: `SETUP_WINDOWS_GPU.md`

### 4. **Mock** (Apenas Testes)
- Gera silêncio
- Para testar interface
- Deixe tudo `false`

## 🗂️ Estrutura do Projeto

```
dnd-voicer/
├── src/
│   ├── app/
│   │   ├── api/tts/          # API de geração de TTS
│   │   ├── campaign/[id]/    # Página de campanha individual
│   │   ├── page.tsx          # Home com landing page
│   │   ├── layout.tsx        # Layout raiz
│   │   └── globals.css       # Estilos globais + animações
│   ├── components/
│   │   ├── AudioPlayer.tsx   # Player de áudio customizado
│   │   ├── CharacterCard.tsx # Card de personagem
│   │   ├── MessageList.tsx   # Lista de mensagens com animações
│   │   ├── SessionControls.tsx # Controles de geração
│   │   └── VoiceSelector.tsx # Seletor de vozes
│   ├── lib/
│   │   ├── kokoro/
│   │   │   ├── client.ts     # Cliente TTS (ElevenLabs/Replicate/Mock)
│   │   │   └── voices.ts     # Configuração de vozes
│   │   ├── db/prisma.ts      # Prisma client
│   │   └── utils/audio.ts    # Utilitários de áudio e cache
│   └── types/rpg.ts          # TypeScript interfaces
├── prisma/
│   └── schema.prisma         # Schema do banco (MySQL)
├── public/
│   └── audio/                # Cache de áudios gerados
├── scripts/
│   └── kokoro_tts.py         # Script Python para TTS local
└── requirements.txt          # Dependências Python
```

## 🎮 Como Usar

### 1. **Acesse a Home**
   - Veja a landing page com features
   - Clique em "Começar Aventura"

### 2. **Crie uma Campanha**
   - Acesse `/campaign/new`
   - Veja os personagens mock (Thorin e Elara)

### 3. **Gere Áudio**
   - Escolha o tipo: Narração/Diálogo/Ação
   - Digite o texto (ex: "Os aventureiros entram na taverna")
   - Clique em "Gerar"
   - Aguarde 2-5 segundos
   - Ouça o áudio com voz realista!

### 4. **Interaja**
   - Copie texto das mensagens
   - Delete mensagens indesejadas
   - Scroll automático para últimas mensagens
   - Botão "scroll to bottom" quando necessário

## 🔧 Vozes Disponíveis

As vozes estão mapeadas em `src/lib/kokoro/voices.ts`:

| ID | Nome | Tipo | Uso Sugerido |
|---|---|---|---|
| `af_bella` | Adam | Masculina Grave | Guerreiros, Bárbaros |
| `af_nicole` | Rachel | Feminina Madura | Sábias, Anciãs |
| `af_sarah` | Bella | Feminina Jovem | Ladinas, Bardas |
| `am_adam` | Adam | Masculina | Heróis |
| `am_michael` | Michael | Masculina | Narrador |
| `af_sky` | Bella | Feminina Suave | Clérigas, Curandeiras |
| `bf_emma` | Rachel | Feminina | Rangers |
| `bf_isabella` | Bella | Feminina | Feiticeiras |

## 📝 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Lint do código

npm run db:generate  # Gera Prisma Client
npm run db:push      # Sincroniza schema com banco
npm run db:studio    # Abre Prisma Studio (GUI)
```

## 🐛 Troubleshooting

### **Áudio está em silêncio**
```bash
# Limpar cache de áudio
Remove-Item -Recurse public\audio\*

# Reiniciar servidor
npm run dev
```

### **Erro 401 - ElevenLabs**
- Verifique se a chave está correta no `.env`
- Use o modelo `eleven_turbo_v2_5` (não `eleven_monolingual_v1`)
- Plano grátis tem limite de 10k caracteres/mês

### **Erro de conexão MySQL**
```bash
# Verificar se MySQL está rodando
Get-Service -Name *mysql*

# Testar conexão no Workbench
# Verificar senha e porta (padrão: 3306)
```

### **"Module not found"**
```bash
# Reinstalar dependências
npm install

# Limpar cache do Next.js
rm -rf .next
npm run dev
```

### **Python não encontrado (Windows)**
- Adicione Python ao PATH
- Ou use `USE_LOCAL_TTS="false"`

## 🎨 Paleta de Cores

```css
/* Primárias */
Blue:   #3B82F6
Purple: #A855F7
Green:  #10B981

/* Backgrounds */
Gray-900: #111827
Gray-800: #1F2937
Gray-700: #374151

/* Tipos de Mensagem */
Narração: Purple (#A855F7)
Diálogo:  Blue (#3B82F6)
Ação:     Green (#10B981)
```

## 🚀 Deploy

### **Vercel** (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Configurar:**
1. Adicione variáveis de ambiente no dashboard
2. Configure banco de dados (PlanetScale/Supabase)
3. Deploy!

### **Docker** (Opcional)
```dockerfile
# Dockerfile exemplo
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Limites e Custos

| Serviço | Plano Grátis | Custo Pago |
|---------|--------------|------------|
| **ElevenLabs** | 10k chars/mês | $1/10k chars |
| **Replicate** | $0 crédito | ~$0.01/req |
| **MySQL** | Grátis (local) | ~$5-15/mês (cloud) |
| **Vercel** | Hobby grátis | $20/mês (Pro) |

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

**Matheus Masago** 
- GitHub: [@matheusIACreator](https://github.com/matheusIACreator)
- LinkedIn: [Matheus Masago](https://linkedin.com/in/matheusmasago)

## 🙏 Agradecimentos

- [ElevenLabs](https://elevenlabs.io) - Text-to-Speech API
- [Hugging Face](https://huggingface.co) - Modelos de IA
- [Vercel](https://vercel.com) - Hospedagem
- Comunidade D&D 🎲

---

⭐ **Se este projeto te ajudou, considere dar uma estrela no GitHub!**

🎙️ **Boas aventuras e que suas histórias ganhem vida!**