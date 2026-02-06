import { Beaker, ChevronRight, Target, Zap, Shield } from 'lucide-react';
import { protocolPhases, metabolicTimeline } from '@/types/app';
import { getCurrentPhase, getPhaseProgress, getPhaseIndex } from '@/lib/protocol';

interface ProtocoloTabProps {
  daysOnJourney: number;
}

const phaseIcons = [Target, Zap, Shield];

export const ProtocoloTab = ({ daysOnJourney }: ProtocoloTabProps) => {
  const currentPhase = getCurrentPhase(daysOnJourney);
  const phaseProgress = getPhaseProgress(daysOnJourney);
  const currentIndex = getPhaseIndex(daysOnJourney);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center pt-2">
        <h1 className="text-2xl font-bold text-foreground">Seu Protocolo</h1>
        <p className="text-muted-foreground mt-1">Método em execução — Dia {daysOnJourney}</p>
      </div>

      {/* Current Phase Card */}
      <div className="card-elevated p-5 border-l-4 border-primary">
        <div className="flex items-center gap-2 text-primary mb-3">
          <Beaker className="w-5 h-5" />
          <h2 className="font-bold">Fase Atual: {currentPhase.name}</h2>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{currentPhase.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso da fase</span>
            <span className="font-semibold text-primary">{Math.round(phaseProgress)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary transition-all duration-700 rounded-full" 
              style={{ width: `${phaseProgress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-primary-soft">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Objetivo da Fase</p>
          <p className="text-sm font-semibold text-foreground">{currentPhase.objective}</p>
        </div>
      </div>

      {/* Phase Overview */}
      <div className="card-elevated p-5">
        <h2 className="font-bold mb-4 text-sm uppercase tracking-wide text-muted-foreground">Fases do Protocolo</h2>
        <div className="space-y-3">
          {protocolPhases.map((phase, index) => {
            const Icon = phaseIcons[index] || Target;
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;

            return (
              <div
                key={phase.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  isActive ? 'bg-primary-soft border-2 border-primary/30' :
                  isCompleted ? 'bg-success-soft border border-success/20' :
                  'bg-muted border border-transparent'
                }`}
              >
                <div className={`p-2 rounded-xl ${
                  isActive ? 'bg-primary/20' :
                  isCompleted ? 'bg-success/20' :
                  'bg-background'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-primary' :
                    isCompleted ? 'text-success' :
                    'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${
                    isActive ? 'text-primary' :
                    isCompleted ? 'text-success' :
                    'text-muted-foreground'
                  }`}>
                    {phase.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isCompleted ? 'Fase concluída ✓' :
                     isActive ? `Em execução — Dia ${daysOnJourney}` :
                     `A partir do dia ${phase.startDay}`}
                  </p>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-primary" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Metabolic Timeline */}
      <div className="card-elevated p-5">
        <h2 className="font-bold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
          Linha do Tempo Metabólica
        </h2>
        <div className="space-y-0">
          {metabolicTimeline.map((item, index) => {
            const isCurrentPeriod = 
              (index === 0 && daysOnJourney <= 3) ||
              (index === 1 && daysOnJourney >= 4 && daysOnJourney <= 7) ||
              (index === 2 && daysOnJourney >= 8 && daysOnJourney <= 14) ||
              (index === 3 && daysOnJourney >= 15 && daysOnJourney <= 21) ||
              (index === 4 && daysOnJourney >= 22);
            const isPast = 
              (index === 0 && daysOnJourney > 3) ||
              (index === 1 && daysOnJourney > 7) ||
              (index === 2 && daysOnJourney > 14) ||
              (index === 3 && daysOnJourney > 21);

            return (
              <div key={index} className="flex gap-3">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${
                    isCurrentPeriod ? 'bg-primary ring-4 ring-primary/20' :
                    isPast ? 'bg-success' :
                    'bg-muted-foreground/30'
                  }`} />
                  {index < metabolicTimeline.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[40px] ${
                      isPast ? 'bg-success/40' : 'bg-border'
                    }`} />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-4 ${isCurrentPeriod ? '' : 'opacity-60'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide ${
                    isCurrentPeriod ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {item.period}
                  </p>
                  <p className={`font-semibold text-sm ${isCurrentPeriod ? 'text-foreground' : ''}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Protocol Status */}
      <div className="card-elevated p-4 text-center bg-primary-soft border border-primary/20">
        <p className="text-sm font-medium text-foreground">
          🔬 Acesso liberado — Protocolo Elixir Metabólico em execução
        </p>
      </div>
    </div>
  );
};
