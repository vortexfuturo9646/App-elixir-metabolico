import { TrendingUp, Calendar, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserData } from '@/types/app';

interface ProgressoTabProps {
  data: UserData;
  weightLost: number;
}

const encouragingMessages = [
  "Cada dia conta. Continue assim!",
  "Você está construindo uma nova versão de si mesmo.",
  "Lembre-se: progresso, não perfeição.",
  "O importante é não desistir.",
  "Você já deu o primeiro passo. Continue!",
];

export const ProgressoTab = ({ data, weightLost }: ProgressoTabProps) => {
  const chartData = data.weightHistory
    .slice(-14)
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      peso: entry.weight,
    }));

  const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];

  const daysOnJourney = Math.ceil(
    (new Date().getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center pt-2">
        <h1 className="text-2xl font-bold text-foreground">Seu Progresso</h1>
        <p className="text-muted-foreground mt-1">Visualize sua jornada</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-primary">{data.streak}</p>
          <p className="text-xs text-muted-foreground">Dias seguidos</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-success">-{weightLost.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">kg perdidos</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-2xl font-bold text-accent">{daysOnJourney}</p>
          <p className="text-xs text-muted-foreground">Dias de jornada</p>
        </div>
      </div>

      {/* Chart */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 text-primary mb-4">
          <TrendingUp className="w-5 h-5" />
          <h2 className="font-bold">Evolução do Peso</h2>
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
                  formatter={(value: number) => [`${value} kg`, 'Peso']}
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
            <p className="text-muted-foreground text-center px-4">
              Registre seu peso por alguns dias para ver o gráfico de evolução.
            </p>
          </div>
        )}
      </div>

      {/* History */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 text-primary mb-4">
          <Calendar className="w-5 h-5" />
          <h2 className="font-bold">Histórico Recente</h2>
        </div>

        {data.weightHistory.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {data.weightHistory.slice(-7).reverse().map((entry, index) => (
              <div 
                key={entry.date} 
                className="flex items-center justify-between p-3 rounded-xl bg-muted"
              >
                <span className="text-sm text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString('pt-BR', { 
                    weekday: 'short', 
                    day: '2-digit', 
                    month: '2-digit' 
                  })}
                </span>
                <span className="font-semibold">{entry.weight} kg</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Nenhum registro ainda. Comece hoje!
          </p>
        )}
      </div>

      {/* Encouragement */}
      <div className="card-elevated p-5 text-center border-l-4 border-success">
        <Heart className="w-6 h-6 text-success mx-auto mb-2" />
        <p className="text-muted-foreground">{randomMessage}</p>
      </div>
    </div>
  );
};
