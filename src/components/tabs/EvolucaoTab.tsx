import { TrendingUp, Activity, Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserData } from '@/types/app';
import { interpretWeightProgress } from '@/lib/protocol';

interface EvolucaoTabProps {
  data: UserData;
  weightLost: number;
  daysOnJourney: number;
}

export const EvolucaoTab = ({ data, weightLost, daysOnJourney }: EvolucaoTabProps) => {
  const chartData = data.weightHistory
    .slice(-14)
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      peso: entry.weight,
    }));

  const interpretation = interpretWeightProgress(weightLost, daysOnJourney, data.weightHistory);

  const interpretationColors = {
    positive: { bg: 'bg-success-soft', border: 'border-success', icon: 'text-success' },
    neutral: { bg: 'bg-primary-soft', border: 'border-primary', icon: 'text-primary' },
    encouraging: { bg: 'bg-accent-soft', border: 'border-accent', icon: 'text-accent' },
  };

  const colors = interpretationColors[interpretation.type];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center pt-2">
        <h1 className="text-2xl font-bold text-foreground">Evolução Metabólica</h1>
        <p className="text-muted-foreground mt-1">Dia {daysOnJourney} do protocolo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-primary">{data.streak}</p>
          <p className="text-xs text-muted-foreground">Protocolo ativo</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-success">{weightLost > 0 ? `-${weightLost.toFixed(1)}` : '—'}</p>
          <p className="text-xs text-muted-foreground">kg eliminados</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-accent">{daysOnJourney}</p>
          <p className="text-xs text-muted-foreground">Dias no método</p>
        </div>
      </div>

      {/* Intelligent Interpretation */}
      <div className={`card-elevated p-5 border-l-4 ${colors.border}`}>
        <div className="flex items-center gap-2 mb-3">
          <Brain className={`w-5 h-5 ${colors.icon}`} />
          <h2 className="font-bold text-sm">{interpretation.title}</h2>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{interpretation.message}</p>
      </div>

      {/* Chart */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 text-primary mb-4">
          <TrendingUp className="w-5 h-5" />
          <h2 className="font-bold text-sm uppercase tracking-wide">Curva de Evolução</h2>
        </div>

        {chartData.length > 1 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value} kg`, 'Registro']}
                />
                <Line 
                  type="monotone" 
                  dataKey="peso" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center bg-muted rounded-xl">
            <p className="text-muted-foreground text-center px-4 text-sm">
              Registre seu peso por alguns dias para visualizar a curva de evolução do protocolo.
            </p>
          </div>
        )}
      </div>

      {/* Body Intelligence */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 text-primary mb-3">
          <Activity className="w-5 h-5" />
          <h2 className="font-bold text-sm uppercase tracking-wide">Inteligência Corporal</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {daysOnJourney <= 3
            ? 'Seu corpo está no período de ajuste interno. As mudanças acontecem de dentro para fora — confie no processo.'
            : daysOnJourney <= 7
            ? 'A fase de desinchaço inicial está em andamento. Seu organismo está respondendo ao protocolo.'
            : daysOnJourney <= 14
            ? 'O metabolismo entrou em fase de aceleração. Os resultados tendem a ser mais consistentes a partir de agora.'
            : daysOnJourney <= 21
            ? 'Seu corpo consolidou o novo ritmo. A consistência que você construiu está gerando resultados acumulados.'
            : 'O protocolo está estabilizado. Manter é mais fácil do que começar — e você já provou isso.'
          }
        </p>
      </div>

      {/* Encouragement */}
      <div className="card-elevated p-4 text-center bg-primary-soft border border-primary/20">
        <p className="text-sm text-foreground">
          Progresso ≠ apenas balança. Seu corpo está mudando por dentro antes de mudar por fora.
        </p>
      </div>
    </div>
  );
};
