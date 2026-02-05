import { useState } from 'react';
import { Flame, Scale, TrendingDown, CheckCircle2, Sparkles } from 'lucide-react';
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
    title: "Consistência vence intensidade",
    text: "Não importa se você perdeu pouco ou muito hoje. O que importa é que você está aqui, fazendo a sua parte. Pequenos passos diários criam grandes transformações ao longo do tempo."
  },
  {
    title: "Seu corpo está trabalhando",
    text: "Mesmo quando a balança não muda, seu metabolismo está se adaptando. Cada dia de consistência fortalece novos hábitos e prepara seu corpo para mudanças duradouras."
  },
  {
    title: "Progresso não é linear",
    text: "Alguns dias o peso sobe, outros desce. Isso é completamente normal. O importante é a tendência ao longo das semanas, não as oscilações diárias."
  },
];

export const HojeTab = ({ data, updateWeight, confirmDay, isCheckedInToday, weightLost }: HojeTabProps) => {
  const [editingInitial, setEditingInitial] = useState(false);
  const [editingCurrent, setEditingCurrent] = useState(false);
  const [tempInitial, setTempInitial] = useState(data.initialWeight?.toString() || '');
  const [tempCurrent, setTempCurrent] = useState(data.currentWeight?.toString() || '');

  const todayReinforcement = mentalReinforcements[new Date().getDay() % mentalReinforcements.length];

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

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="text-center pt-2">
        <h1 className="text-2xl font-bold text-foreground">
          {data.name ? `Olá, ${data.name}!` : 'Bem-vindo!'}
        </h1>
        <p className="text-muted-foreground mt-1">Como está seu dia hoje?</p>
      </div>

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

        {/* Weight Lost */}
        {weightLost > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-success-soft">
            <TrendingDown className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Peso perdido</p>
              <p className="text-lg font-bold text-success">-{weightLost.toFixed(1)} kg</p>
            </div>
          </div>
        )}
      </div>

      {/* Streak Card */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-accent-soft">
              <Flame className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sequência Atual</p>
              <p className="text-2xl font-bold">{data.streak} {data.streak === 1 ? 'dia' : 'dias'}</p>
            </div>
          </div>
          {data.streak >= 7 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-warning/10 text-warning">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Incrível!</span>
            </div>
          )}
        </div>

        <Button 
          onClick={confirmDay}
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
              Dia Confirmado!
            </>
          ) : (
            'Confirmar Dia Concluído'
          )}
        </Button>
      </div>

      {/* Mental Reinforcement Card */}
      <div className="card-elevated p-5 border-l-4 border-primary">
        <h3 className="font-bold text-foreground mb-2">{todayReinforcement.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {todayReinforcement.text}
        </p>
      </div>
    </div>
  );
};
