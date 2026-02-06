import { useState } from 'react';
import { Flame, Scale, TrendingDown, CheckCircle2, Sparkles, Clock, Trophy, Beaker, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UserData, ProtocolCheck } from '@/types/app';
import { getCurrentPhase, getRitualMessage, getProtocolStatusMessage } from '@/lib/protocol';

interface HojeTabProps {
  data: UserData;
  updateWeight: (type: 'initial' | 'current', value: number | null) => void;
  confirmDay: () => void;
  isCheckedInToday: boolean;
  weightLost: number;
  daysOnJourney: number;
  toggleProtocolCheck: (id: string) => void;
}

const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

const getStreakWarning = (lastCheckIn: string | null, streak: number): { show: boolean; message: string } => {
  if (!lastCheckIn || streak === 0) return { show: false, message: '' };
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  if (lastCheckIn === todayStr) return { show: false, message: '' };
  if (today.getHours() >= 20) {
    return {
      show: true,
      message: `Seu protocolo de ${streak} dias ainda está aberto hoje. Ainda dá tempo!`,
    };
  }
  return { show: false, message: '' };
};

const protocolIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  water: Scale,
  method: Beaker,
  sleep: Clock,
  walk: TrendingDown,
  avoid: Shield,
};

export const HojeTab = ({ data, updateWeight, confirmDay, isCheckedInToday, weightLost, daysOnJourney, toggleProtocolCheck }: HojeTabProps) => {
  const [editingInitial, setEditingInitial] = useState(false);
  const [editingCurrent, setEditingCurrent] = useState(false);
  const [tempInitial, setTempInitial] = useState(data.initialWeight?.toString() || '');
  const [tempCurrent, setTempCurrent] = useState(data.currentWeight?.toString() || '');
  const [showCelebration, setShowCelebration] = useState(false);

  const currentPhase = getCurrentPhase(daysOnJourney);
  const ritualMessage = getRitualMessage(data.streak);
  const streakWarning = getStreakWarning(data.lastCheckIn, data.streak);
  const greeting = getTimeBasedGreeting();
  const statusMessage = getProtocolStatusMessage(data.streak, isCheckedInToday);

  const completedChecks = data.protocolChecks.filter(c => c.completed).length;
  const totalChecks = data.protocolChecks.length;

  const handleSaveInitial = () => {
    const value = parseFloat(tempInitial);
    updateWeight('initial', isNaN(value) ? null : value);
    setEditingInitial(false);
  };

  const handleSaveCurrent = () => {
    const value = parseFloat(tempCurrent);
    updateWeight('current', isNaN(value) ? null : value);
    setEditingCurrent(false);
  };

  const handleConfirmDay = () => {
    confirmDay();
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="text-center pt-2">
        <h1 className="text-2xl font-bold text-foreground">
          {greeting}{data.name ? `, ${data.name}` : ''}
        </h1>
        <p className="text-muted-foreground mt-1">{ritualMessage}</p>
      </div>

      {/* Phase Indicator */}
      <div className="card-elevated p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-soft">
            <Beaker className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Fase Atual</p>
            <p className="font-bold text-foreground">{currentPhase.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Dia {daysOnJourney}</p>
            <p className="text-sm font-semibold text-primary">Protocolo ativo</p>
          </div>
        </div>
      </div>

      {/* Streak Warning */}
      {streakWarning.show && (
        <div className="card-elevated p-4 border-l-4 border-warning bg-warning/5 animate-pulse-soft">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-warning flex-shrink-0" />
            <p className="text-sm text-foreground">{streakWarning.message}</p>
          </div>
        </div>
      )}

      {/* Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center animate-scale-in">
            <div className="w-24 h-24 rounded-full gradient-success flex items-center justify-center mx-auto mb-4 animate-bounce-soft">
              <Trophy className="w-12 h-12 text-success-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">Ritual concluído!</p>
            <p className="text-muted-foreground">Você manteve o protocolo ativo</p>
          </div>
        </div>
      )}

      {/* Ritual + Streak Card */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${isCheckedInToday ? 'bg-success-soft' : 'bg-accent-soft'}`}>
              <Flame className={`w-6 h-6 ${isCheckedInToday ? 'text-success' : 'text-accent'}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Sequência do Protocolo</p>
              <p className="text-2xl font-bold">{data.streak} {data.streak === 1 ? 'dia' : 'dias'}</p>
            </div>
          </div>
          {data.streak >= 7 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-warning/10 text-warning">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold">
                {data.streak >= 21 ? 'Estabilizado!' : data.streak >= 14 ? 'Acelerado!' : 'Ativado!'}
              </span>
            </div>
          )}
        </div>

        {data.streak > 0 && !isCheckedInToday && (
          <p className="text-sm text-muted-foreground mb-4 italic">
            "{data.streak} {data.streak === 1 ? 'dia' : 'dias'} de protocolo ativo. Não interrompa agora."
          </p>
        )}

        <Button
          onClick={handleConfirmDay}
          disabled={isCheckedInToday}
          className={`w-full h-12 text-base font-semibold transition-all ${
            isCheckedInToday
              ? 'bg-success/20 text-success border-2 border-success'
              : 'gradient-primary text-primary-foreground hover:opacity-90'
          }`}
        >
          {isCheckedInToday ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Ritual do dia concluído ✓
            </>
          ) : (
            'Executar ritual do dia'
          )}
        </Button>

        {isCheckedInToday && (
          <p className="text-center text-sm text-success mt-3 animate-fade-in">
            Protocolo executado. Você manteve o compromisso com seu processo.
          </p>
        )}
      </div>

      {/* Protocol Checklist - compact */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="w-5 h-5" />
            <h2 className="font-bold text-sm uppercase tracking-wide">Protocolo Diário</h2>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{completedChecks}/{totalChecks}</span>
        </div>

        <div className="space-y-2">
          {data.protocolChecks.map((check) => {
            const Icon = protocolIcons[check.id] || Shield;
            return (
              <button
                key={check.id}
                onClick={() => toggleProtocolCheck(check.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm ${
                  check.completed
                    ? 'bg-success-soft border border-success/30'
                    : 'bg-muted hover:bg-muted/80 border border-transparent'
                }`}
              >
                <Checkbox checked={check.completed} className="pointer-events-none" />
                <span className={`flex-1 text-left ${check.completed ? 'text-success line-through' : 'text-foreground'}`}>
                  {check.label}
                </span>
              </button>
            );
          })}
        </div>

        {completedChecks === totalChecks && totalChecks > 0 && (
          <p className="text-center text-sm text-success mt-3 font-semibold animate-scale-in">
            ✨ Protocolo completo! Você cuidou de cada detalhe hoje.
          </p>
        )}
      </div>

      {/* Weight Progress - compact */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 text-primary mb-3">
          <Scale className="w-5 h-5" />
          <h2 className="font-bold text-sm uppercase tracking-wide">Registro Corporal</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Peso Inicial</label>
            {editingInitial ? (
              <div className="flex gap-2">
                <Input type="number" value={tempInitial} onChange={(e) => setTempInitial(e.target.value)} className="h-9 text-sm" placeholder="kg" autoFocus />
                <Button size="sm" onClick={handleSaveInitial} className="gradient-primary h-9 px-3">OK</Button>
              </div>
            ) : (
              <button onClick={() => { setTempInitial(data.initialWeight?.toString() || ''); setEditingInitial(true); }} className="w-full text-left p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                <span className="text-lg font-bold">{data.initialWeight ? `${data.initialWeight} kg` : '-- kg'}</span>
              </button>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Peso Atual</label>
            {editingCurrent ? (
              <div className="flex gap-2">
                <Input type="number" value={tempCurrent} onChange={(e) => setTempCurrent(e.target.value)} className="h-9 text-sm" placeholder="kg" autoFocus />
                <Button size="sm" onClick={handleSaveCurrent} className="gradient-primary h-9 px-3">OK</Button>
              </div>
            ) : (
              <button onClick={() => { setTempCurrent(data.currentWeight?.toString() || ''); setEditingCurrent(true); }} className="w-full text-left p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                <span className="text-lg font-bold">{data.currentWeight ? `${data.currentWeight} kg` : '-- kg'}</span>
              </button>
            )}
          </div>
        </div>

        {weightLost > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-success-soft mt-3">
            <TrendingDown className="w-5 h-5 text-success" />
            <div>
              <p className="text-xs text-muted-foreground">Protocolo eliminou</p>
              <p className="text-lg font-bold text-success">-{weightLost.toFixed(1)} kg</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Message */}
      <div className="card-elevated p-4 border-l-4 border-primary">
        <p className="text-sm text-muted-foreground leading-relaxed">{statusMessage}</p>
      </div>
    </div>
  );
};
