import Link from 'next/link';
import { Swords, Users, BookOpen, Mic, Sparkles, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Header/Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">D&D Voicer</h1>
          </div>
          <div className="flex gap-4">
            <Link
              href="/campaigns"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Campanhas
            </Link>
            <Link
              href="/characters"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Personagens
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">
              Powered by Kokoro-82M AI
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Dê Vida às suas
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Histórias de D&D
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Transforme suas aventuras épicas em experiências imersivas com vozes narradas por IA.
            <br />
            Cada personagem com sua voz única, cada momento ganha vida.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/campaign/new"
              className="group px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/75 hover:scale-105"
            >
              <Swords className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Começar Aventura
            </Link>
            <Link
              href="/characters"
              className="px-8 py-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Criar Personagens
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">10+</div>
              <div className="text-sm text-gray-400">Vozes Únicas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">3</div>
              <div className="text-sm text-gray-400">Tipos de Narrativa</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">∞</div>
              <div className="text-sm text-gray-400">Possibilidades</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            ✨ Funcionalidades
          </h2>
          <p className="text-gray-400 text-lg">
            Tudo que você precisa para criar sessões inesquecíveis
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Mic className="w-12 h-12" />}
            title="Vozes IA Realistas"
            description="Cada personagem tem sua própria voz distinta usando tecnologia de ponta em síntese de voz"
            color="blue"
          />
          <FeatureCard
            icon={<BookOpen className="w-12 h-12" />}
            title="Narração Imersiva"
            description="Transforme suas descrições em narrações envolventes e profissionais que prendem a atenção"
            color="purple"
          />
          <FeatureCard
            icon={<Users className="w-12 h-12" />}
            title="Gestão de Personagens"
            description="Crie e gerencie quantos personagens precisar, cada um com características únicas"
            color="green"
          />
          <FeatureCard
            icon={<Zap className="w-12 h-12" />}
            title="Geração Instantânea"
            description="Áudio gerado em segundos, sem espera. Aproveite sua GPU para máxima velocidade"
            color="yellow"
          />
          <FeatureCard
            icon={<Sparkles className="w-12 h-12" />}
            title="Cache Inteligente"
            description="Reutiliza áudios já gerados para economizar tempo e recursos"
            color="pink"
          />
          <FeatureCard
            icon={<Swords className="w-12 h-12" />}
            title="Tipos de Ação"
            description="Narração, diálogos e ações - cada tipo com seu estilo único"
            color="red"
          />
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gray-800/30 border-y border-gray-700">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              🎯 Como Funciona
            </h2>
            <p className="text-gray-400 text-lg">
              Comece em minutos, não em horas
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Step
              number={1}
              title="Crie seus Personagens"
              description="Adicione personagens com nomes, classes, raças e escolha uma voz única para cada um. Desde guerreiros graves até feiticeiras misteriosas."
              icon="👤"
            />
            <Step
              number={2}
              title="Inicie uma Sessão"
              description="Crie uma nova sessão de jogo para sua campanha. Organize suas aventuras e mantenha tudo registrado."
              icon="🎲"
            />
            <Step
              number={3}
              title="Gere Áudio"
              description="Digite o texto da narração, diálogo ou ação e gere áudio instantaneamente. Sua GPU faz o trabalho pesado."
              icon="🎙️"
            />
            <Step
              number={4}
              title="Reproduza e Imersão"
              description="Ouça suas histórias ganharem vida com vozes realistas e envolventes. Seus jogadores vão amar!"
              icon="🎧"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Crie sua primeira campanha agora e surpreenda seus jogadores
          </p>
          <Link
            href="/campaign/new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/50 hover:shadow-blue-500/75 hover:scale-105"
          >
            <Swords className="w-5 h-5" />
            Criar Primeira Campanha
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Swords className="w-6 h-6 text-blue-500" />
              <span className="text-white font-semibold">D&D Voicer</span>
            </div>
            <div className="text-center text-gray-400">
              <p>Feito com ❤️ para mestres e jogadores de D&D</p>
              <p className="text-sm mt-1">
                Powered by{' '}
                <a
                  href="https://huggingface.co/hexgrad/Kokoro-82M"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Kokoro-82M TTS
                </a>
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="https://github.com/matheusIACreator/D-D-Voicer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'green' | 'yellow' | 'pink' | 'red';
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400',
    green: 'from-green-500/20 to-green-600/5 border-green-500/30 text-green-400',
    yellow: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30 text-yellow-400',
    pink: 'from-pink-500/20 to-pink-600/5 border-pink-500/30 text-pink-400',
    red: 'from-red-500/20 to-red-600/5 border-red-500/30 text-red-400',
  };

  return (
    <div
      className={`p-6 bg-gradient-to-br ${colorClasses[color]} border rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer group`}
    >
      <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: string;
}

function Step({ number, title, description, icon }: StepProps) {
  return (
    <div className="flex gap-6 items-start group">
      <div className="flex-shrink-0 relative">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform">
          {number}
        </div>
        <div className="absolute -bottom-2 -right-2 text-3xl">{icon}</div>
      </div>
      <div className="flex-1 pt-3">
        <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}