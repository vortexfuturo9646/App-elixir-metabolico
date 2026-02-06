import { useState } from 'react';
import { Droplets, Utensils, Footprints, Moon, CheckCircle2, ChevronDown, Shield } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ProtocolCheck } from '@/types/app';

interface ProtocolChecklistProps {
  checks: ProtocolCheck[];
  toggleCheck: (id: string) => void;
}

const pillarIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  water: Droplets,
  method: Utensils,
  walk: Footprints,
  sleep: Moon,
  avoid: CheckCircle2,
};

const getCompletionFeedback = (completed: number, total: number): { message: string; show: boolean } => {
  if (completed === 0) return { message: '', show: false };
  if (completed === total) {
    return {
      message: 'Protocolo completo. Sinais corretos enviados ao corpo hoje.',
      show: true,
    };
  }
  if (completed >= Math.ceil(total / 2)) {
    return {
      message: `${completed} de ${total} pilares executados. Você está no caminho certo.`,
      show: true,
    };
  }
  return {
    message: `${completed} pilar${completed > 1 ? 'es' : ''} ativo${completed > 1 ? 's' : ''}. Continue reforçando o protocolo.`,
    show: true,
  };
};

export const ProtocolChecklist = ({ checks, toggleCheck }: ProtocolChecklistProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const completedChecks = checks.filter(c => c.completed).length;
  const totalChecks = checks.length;
  const feedback = getCompletionFeedback(completedChecks, totalChecks);

  const handleToggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-primary">
          <Shield className="w-5 h-5" />
          <h2 className="font-bold text-sm uppercase tracking-wide">Protocolo Diário</h2>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">{completedChecks}/{totalChecks}</span>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        Seu corpo responde a sinais, não a esforço extremo.
      </p>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className="h-full gradient-primary transition-all duration-500 rounded-full"
          style={{ width: `${totalChecks > 0 ? (completedChecks / totalChecks) * 100 : 0}%` }}
        />
      </div>

      <div className="space-y-2">
        {checks.map((check) => {
          const Icon = pillarIcons[check.id] || Shield;
          const isExpanded = expandedId === check.id;

          return (
            <div key={check.id} className="rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCheck(check.id)}
                className={`w-full flex items-center gap-3 p-3 transition-all text-sm ${
                  check.completed
                    ? 'bg-success-soft border border-success/30'
                    : 'bg-muted hover:bg-muted/80 border border-transparent'
                } ${isExpanded ? 'rounded-t-xl rounded-b-none' : 'rounded-xl'}`}
              >
                <Checkbox checked={check.completed} className="pointer-events-none" />
                <Icon className={`w-4 h-4 flex-shrink-0 ${check.completed ? 'text-success' : 'text-muted-foreground'}`} />
                <span className={`flex-1 text-left ${check.completed ? 'text-success line-through' : 'text-foreground'}`}>
                  {check.label}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleExpand(check.id);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
                  aria-label="Ver detalhes"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wide leading-none">
                    {isExpanded ? 'Fechar' : 'Ver mais'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              </button>

              {isExpanded && (
                <div className={`px-4 py-3 border-x border-b rounded-b-xl animate-fade-in ${
                  check.completed ? 'bg-success-soft/50 border-success/20' : 'bg-muted/50 border-muted'
                }`}>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    {check.pillar}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed mb-2">{check.description}</p>
                  <div className="p-2.5 rounded-lg bg-primary-soft">
                    <p className="text-xs text-primary font-semibold mb-0.5">Orientação prática</p>
                    <p className="text-xs text-foreground leading-relaxed">{check.guidance}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {feedback.show && (
        <p className={`text-center text-sm mt-4 font-semibold animate-fade-in ${
          completedChecks === totalChecks ? 'text-success' : 'text-primary'
        }`}>
          {completedChecks === totalChecks && '✨ '}
          {feedback.message}
        </p>
      )}
    </div>
  );
};
