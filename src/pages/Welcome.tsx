import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Beaker, Sparkles } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center space-y-8">
        {/* Logo / Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center animate-scale-in">
            <Beaker className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>

        {/* Positioning */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-foreground leading-tight">
            Seu protocolo diário<br />começa aqui
          </h1>
          <p className="text-muted-foreground text-base">
            Elixir Metabólico — o método que reprograma seu corpo sem dieta e sem culpa.
          </p>
        </div>

        {/* Subtle indicator */}
        <div className="flex items-center justify-center gap-2 text-primary">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Acesso exclusivo ao protocolo</span>
        </div>

        {/* CTA */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={() => navigate('/entrar')}
            className="w-full h-16 text-lg font-bold gradient-primary text-primary-foreground hover:opacity-90 transition-opacity rounded-2xl"
            size="lg"
          >
            Entrar / Criar acesso
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
