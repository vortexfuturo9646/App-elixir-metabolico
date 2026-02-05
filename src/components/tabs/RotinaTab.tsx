import { ListChecks, Droplets, Footprints, Moon, UtensilsCrossed, Target } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { RoutineCheck } from '@/types/app';

interface RotinaTabProps {
  routineChecks: RoutineCheck[];
  toggleRoutineCheck: (id: string) => void;
}

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  water: Droplets,
  method: Target,
  sleep: Moon,
  walk: Footprints,
  avoid: UtensilsCrossed,
};

export const RotinaTab = ({ routineChecks, toggleRoutineCheck }: RotinaTabProps) => {
  const completedCount = routineChecks.filter(c => c.completed).length;
  const totalCount = routineChecks.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center pt-2">
        <h1 className="text-2xl font-bold text-foreground">Rotina do Dia</h1>
        <p className="text-muted-foreground mt-1">Pequenas ações, grandes resultados</p>
      </div>

      {/* Progress Overview */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-primary">
            <ListChecks className="w-5 h-5" />
            <h2 className="font-bold">Progresso de Hoje</h2>
          </div>
          <span className="text-sm font-semibold text-muted-foreground">
            {completedCount}/{totalCount}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full gradient-success transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {progress === 100 && (
          <p className="text-success text-center mt-3 font-semibold animate-scale-in">
            🎉 Parabéns! Você completou tudo hoje!
          </p>
        )}
      </div>

      {/* Checklist */}
      <div className="card-elevated p-5 space-y-3">
        <p className="text-sm text-muted-foreground mb-4">
          Marque as ações que você completou hoje. Lembre-se: tudo é opcional, mas cada item faz diferença!
        </p>

        {routineChecks.map((check) => {
          const Icon = icons[check.id] || Target;
          return (
            <button
              key={check.id}
              onClick={() => toggleRoutineCheck(check.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                check.completed 
                  ? 'bg-success-soft border-2 border-success' 
                  : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
              }`}
            >
              <div className={`p-2 rounded-lg ${check.completed ? 'bg-success/20' : 'bg-background'}`}>
                <Icon className={`w-5 h-5 ${check.completed ? 'text-success' : 'text-muted-foreground'}`} />
              </div>
              <span className={`flex-1 text-left font-medium ${
                check.completed ? 'text-success line-through' : 'text-foreground'
              }`}>
                {check.label}
              </span>
              <Checkbox 
                checked={check.completed}
                className="pointer-events-none"
              />
            </button>
          );
        })}
      </div>

      {/* Tips */}
      <div className="card-elevated p-5 bg-primary-soft border border-primary/20">
        <p className="text-sm text-foreground leading-relaxed">
          💡 <strong>Dica:</strong> Não se cobre pela perfeição. Mesmo que complete apenas 
          1 ou 2 itens, você já está melhor do que ontem. O segredo é nunca zerar.
        </p>
      </div>
    </div>
  );
};
