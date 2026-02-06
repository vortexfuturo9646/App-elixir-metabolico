import { Calendar, CheckCircle2, Award, Star } from 'lucide-react';
import { UserData } from '@/types/app';
import { getMilestones } from '@/lib/protocol';

interface HistoricoTabProps {
  data: UserData;
  daysOnJourney: number;
  weightLost: number;
}

export const HistoricoTab = ({ data, daysOnJourney, weightLost }: HistoricoTabProps) => {
  const milestones = getMilestones(data, daysOnJourney, weightLost);
  const achievedCount = milestones.filter(m => m.achieved).length;

  // Build day history from weight entries and check-ins
  const recentDays = data.weightHistory.slice(-14).reverse();

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center pt-2">
        <h1 className="text-2xl font-bold text-foreground">Histórico do Protocolo</h1>
        <p className="text-muted-foreground mt-1">{achievedCount} marcos alcançados</p>
      </div>

      {/* Milestones */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 text-primary mb-4">
          <Award className="w-5 h-5" />
          <h2 className="font-bold text-sm uppercase tracking-wide">Marcos do Protocolo</h2>
        </div>
        <div className="space-y-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                milestone.achieved
                  ? 'bg-success-soft border border-success/20'
                  : 'bg-muted/50 border border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${milestone.achieved ? 'bg-success/20' : 'bg-muted'}`}>
                {milestone.achieved ? (
                  <Star className="w-4 h-4 text-success" />
                ) : (
                  <Star className="w-4 h-4 text-muted-foreground/40" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${milestone.achieved ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {milestone.label}
                </p>
                <p className={`text-xs ${milestone.achieved ? 'text-success' : 'text-muted-foreground/60'}`}>
                  {milestone.description}
                </p>
              </div>
              {milestone.achieved && (
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Day History */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 text-primary mb-4">
          <Calendar className="w-5 h-5" />
          <h2 className="font-bold text-sm uppercase tracking-wide">Registros Recentes</h2>
        </div>

        {recentDays.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentDays.map((entry) => (
              <div
                key={entry.date}
                className="flex items-center justify-between p-3 rounded-xl bg-muted"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString('pt-BR', {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </span>
                </div>
                <span className="font-semibold text-sm">{entry.weight} kg</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4 text-sm">
            Nenhum registro ainda. Execute seu primeiro ritual para começar.
          </p>
        )}
      </div>

      {/* Protocol Summary */}
      <div className="card-elevated p-5 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-primary-soft rounded-xl">
          <p className="text-2xl font-bold text-primary">{daysOnJourney}</p>
          <p className="text-xs text-muted-foreground">Dias no protocolo</p>
        </div>
        <div className="text-center p-3 bg-success-soft rounded-xl">
          <p className="text-2xl font-bold text-success">{data.streak}</p>
          <p className="text-xs text-muted-foreground">Sequência atual</p>
        </div>
      </div>

      {/* Encouragement */}
      <div className="card-elevated p-4 text-center border-l-4 border-primary">
        <p className="text-sm text-muted-foreground">
          Cada dia registrado é prova do seu compromisso. O protocolo funciona porque você executa.
        </p>
      </div>
    </div>
  );
};
