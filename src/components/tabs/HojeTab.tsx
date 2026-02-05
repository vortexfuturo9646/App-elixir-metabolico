import { useState, useEffect } from 'react';
import { Flame, Scale, TrendingDown, CheckCircle2, Sparkles, Clock, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserData } from '@/types/app';

interface HojeTabProps {
  data: UserData;
  updateWeight: (type: 'initial' | 'current', value: number | null) => void;
  confirmDay: () => void;
  isCheckedInToday: boolean;
  weightLost: number;
}

const mentalReinforcements = [
  {
    title: "Você está no controle",
    text: "Cada escolha que você faz hoje é sua. Não existe perfeição, existe intenção. Você decidiu estar aqui, e isso já é uma vitória."
  },
  {
    title: "Pequenos passos, grandes conquistas",
    text: "Não se cobre por resultados imediatos. O que você está construindo é um novo padrão, não uma corrida. Confie no processo."
  },
  {
    title: "Você já chegou até aqui",
    text: "Olhe para trás: você começou. Muitos desistem antes de tentar. Você está fazendo. Continue, um dia de cada vez."
  },
  {
    title: "Consistência é liberdade",
    text: "Quando você mantém o hábito, não precisa mais pensar tanto. O esforço de hoje cria a facilidade de amanhã."
  },
  {
    title: "Seu corpo escuta suas escolhas",
    text: "Cada dia que você segue em frente, seu corpo aprende um novo caminho. Você está reprogramando anos de hábitos antigos."
  },
  {
    title: "Dias difíceis também contam",
    text: "Se hoje foi mais difícil, tudo bem. O importante é que você está aqui. Um dia imperfeito ainda é um dia de progresso."
  },
  {
    title: "Você merece essa transformação",
    text: "Não é sobre punição, é sobre cuidado. Você está escolhendo se tratar melhor. Isso é força, não sacrifício."
  },
];

const getContinuityMessage = (streak: number, daysOnJourney: number): string => {
  if (streak === 0) {
    return "Hoje é um ótimo dia para começar.";
  }
  if (streak === 1) {
    return "Primeiro passo dado. O segundo é o mais importante.";
  }
  if (streak < 7) {
    return `${streak} dias seguidos. Você está criando um padrão.`;
  }
  if (streak < 14) {
    return `${streak} dias! Seu cérebro já está se adaptando.`;
  }
  if (streak < 30) {
    return `${streak} dias de consistência. Isso já é um hábito.`;
  }
  return `${streak} dias. Você se tornou outra pessoa.`;
};

const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

const getStreakWarning = (lastCheckIn: string | null, streak: number): { show: boolean; message: string } => {
  if (!lastCheckIn || streak === 0) {
    return { show: false, message: "" };
  }

  const today = new Date();
  const lastCheck = new Date(lastCheckIn);
  const todayStr = today.toISOString().split('T')[0];
  
  // Already checked in today
  if (lastCheckIn === todayStr) {
    return { show: false, message: "" };
  }

  const hour = today.getHours();
  
  // After 8 PM and haven't checked in
  if (hour >= 20) {
    return { 
      show: true, 
      message: `Sua sequência de ${streak} dias está esperando por você. Ainda dá tempo!` 
    };
  }
  
  return { show: false, message: "" };
};

export const HojeTab = ({ data, updateWeight, confirmDay, isCheckedInToday, weightLost }: HojeTabProps) => {
  const [editingInitial, setEditingInitial] = useState(false);
  const [editingCurrent, setEditingCurrent] = useState(false);
  const [tempInitial, setTempInitial] = useState(data.initialWeight?.toString() || '');
  const [tempCurrent, setTempCurrent] = useState(data.currentWeight?.toString() || '');
  const [showCelebration, setShowCelebration] = useState(false);

  const todayReinforcement = mentalReinforcements[new Date().getDay() % mentalReinforcements.length];
  
  const daysOnJourney = Math.ceil(
    (new Date().getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const continuityMessage = getContinuityMessage(data.streak, daysOnJourney);
  const streakWarning = getStreakWarning(data.lastCheckIn, data.streak);
  const greeting = getTimeBasedGreeting();

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
      {/* Header with personalized greeting */}
      <div className="text-center pt-2">
        <h1 className="text-2xl font-bold text-foreground">
          {greeting}{data.name ? `, ${data.name}` : ''}!
        </h1>
        <p className="text-muted-foreground mt-1">{continuityMessage}</p>
      </div>

      {/* Streak Warning - gentle reminder */}
      {streakWarning.show && (
        <div className="card-elevated p-4 border-l-4 border-warning bg-warning/5 animate-pulse-soft">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-warning flex-shrink-0" />
            <p className="text-sm text-foreground">{streakWarning.message}</p>
          </div>
        </div>
      )}

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center animate-scale-in">
            <div className="w-24 h-24 rounded-full gradient-success flex items-center justify-center mx-auto mb-4 animate-bounce-soft">
              <Trophy className="w-12 h-12 text-success-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">+1 dia!</p>
            <p className="text-muted-foreground">Você manteve o compromisso</p>
          </div>
        </div>
      )}

      {/* Progress Card */}
      <div className="card-elevated p-5 space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Scale className="w-5 h-5" />
          <h2 className="font-bold text-lg">Seu Progresso</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Initial Weight */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">Peso Inicial</label>
            {editingInitial ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={tempInitial}
                  onChange={(e) => setTempInitial(e.target.value)}
                  className="h-10"
                  placeholder="kg"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveInitial} className="gradient-primary">
                  OK
                </Button>
              </div>
            ) : (
              <button 
                onClick={() => { setTempInitial(data.initialWeight?.toString() || ''); setEditingInitial(true); }}
                className="w-full text-left p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              >
                <span className="text-xl font-bold">
                  {data.initialWeight ? `${data.initialWeight} kg` : '-- kg'}
                </span>
              </button>
            )}
          </div>

          {/* Current Weight */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">Peso Atual</label>
            {editingCurrent ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={tempCurrent}
                  onChange={(e) => setTempCurrent(e.target.value)}
                  className="h-10"
                  placeholder="kg"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveCurrent} className="gradient-primary">
                  OK
                </Button>
              </div>
            ) : (
              <button 
                onClick={() => { setTempCurrent(data.currentWeight?.toString() || ''); setEditingCurrent(true); }}
                className="w-full text-left p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              >
                <span className="text-xl font-bold">
                  {data.currentWeight ? `${data.currentWeight} kg` : '-- kg'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Weight Lost - positive framing */}
        {weightLost > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-success-soft">
            <TrendingDown className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Você já eliminou</p>
              <p className="text-lg font-bold text-success">-{weightLost.toFixed(1)} kg</p>
            </div>
          </div>
        )}
      </div>

      {/* Streak Card - enhanced with psychological elements */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${isCheckedInToday ? 'bg-success-soft' : 'bg-accent-soft'}`}>
              <Flame className={`w-6 h-6 ${isCheckedInToday ? 'text-success' : 'text-accent'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sua Sequência</p>
              <p className="text-2xl font-bold">{data.streak} {data.streak === 1 ? 'dia' : 'dias'}</p>
            </div>
          </div>
          {data.streak >= 7 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-warning/10 text-warning">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {data.streak >= 30 ? 'Lendário!' : data.streak >= 14 ? 'Impressionante!' : 'Incrível!'}
              </span>
            </div>
          )}
        </div>

        {/* Motivational subtext */}
        {data.streak > 0 && !isCheckedInToday && (
          <p className="text-sm text-muted-foreground mb-4 italic">
            "{data.streak} {data.streak === 1 ? 'dia' : 'dias'} de esforço. Não deixe isso ir embora."
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
              Compromisso cumprido hoje ✓
            </>
          ) : (
            'Confirmar meu dia'
          )}
        </Button>

        {/* Post-confirmation positive feedback */}
        {isCheckedInToday && (
          <p className="text-center text-sm text-success mt-3 animate-fade-in">
            Você honrou seu compromisso. Volte amanhã para continuar.
          </p>
        )}
      </div>

      {/* Mental Reinforcement Card - control-focused language */}
      <div className="card-elevated p-5 border-l-4 border-primary">
        <h3 className="font-bold text-foreground mb-2">{todayReinforcement.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {todayReinforcement.text}
        </p>
      </div>

      {/* Journey milestone messages */}
      {daysOnJourney >= 7 && daysOnJourney < 8 && (
        <div className="card-elevated p-4 bg-primary-soft border border-primary/20 text-center">
          <p className="text-sm font-medium text-foreground">
            🎯 Uma semana de jornada! Você está provando para si mesmo que é possível.
          </p>
        </div>
      )}

      {daysOnJourney >= 30 && daysOnJourney < 31 && (
        <div className="card-elevated p-4 bg-success-soft border border-success/20 text-center">
          <p className="text-sm font-medium text-foreground">
            🏆 Um mês inteiro! Você não é mais a mesma pessoa que começou.
          </p>
        </div>
      )}
    </div>
  );
};
