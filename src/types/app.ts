export interface UserData {
  initialWeight: number | null;
  currentWeight: number | null;
  streak: number;
  lastCheckIn: string | null;
  weightHistory: WeightEntry[];
  protocolChecks: ProtocolCheck[];
  name: string;
  startDate: string;
  ritualCompleted: boolean;
  ritualCompletedDate: string | null;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface ProtocolCheck {
  id: string;
  label: string;
  completed: boolean;
}

export interface ProtocolPhase {
  id: 'ativacao' | 'aceleracao' | 'estabilizacao';
  name: string;
  description: string;
  objective: string;
  durationDays: number;
  startDay: number;
  endDay: number;
}

export interface Milestone {
  id: string;
  label: string;
  description: string;
  achieved: boolean;
  dayRequired?: number;
  streakRequired?: number;
  weightRequired?: number;
}

export const protocolPhases: ProtocolPhase[] = [
  {
    id: 'ativacao',
    name: 'Ativação',
    description: 'Seu corpo está reconhecendo o novo padrão. É o momento de ajuste interno — o metabolismo começa a responder.',
    objective: 'Criar a base do protocolo e estabelecer o ritual diário',
    durationDays: 7,
    startDay: 1,
    endDay: 7,
  },
  {
    id: 'aceleracao',
    name: 'Aceleração',
    description: 'O protocolo está em plena execução. Seu metabolismo já reconhece o ritmo e começa a trabalhar a seu favor.',
    objective: 'Intensificar os resultados com consistência consolidada',
    durationDays: 14,
    startDay: 8,
    endDay: 21,
  },
  {
    id: 'estabilizacao',
    name: 'Estabilização',
    description: 'Você atingiu o ponto de equilíbrio. O protocolo agora faz parte de quem você é. Manter é mais fácil do que começar.',
    objective: 'Consolidar o novo padrão metabólico como hábito permanente',
    durationDays: 999,
    startDay: 22,
    endDay: 999,
  },
];

export const defaultProtocolItems: Omit<ProtocolCheck, 'completed'>[] = [
  { id: 'water', label: 'Hidratação do protocolo (2L)' },
  { id: 'method', label: 'Método executado' },
  { id: 'sleep', label: 'Descanso restaurador (7-8h)' },
  { id: 'walk', label: 'Movimento ativo (20 min)' },
  { id: 'avoid', label: 'Controle alimentar mantido' },
];

export const metabolicTimeline = [
  { period: 'Dias 1-3', title: 'Ajuste Interno', description: 'Seu corpo está se preparando para o novo ritmo. É normal sentir diferença.' },
  { period: 'Dias 4-7', title: 'Desinchaço Inicial', description: 'O protocolo começa a agir. A retenção diminui e você sente mais leveza.' },
  { period: 'Semana 2', title: 'Aceleração Metabólica', description: 'O metabolismo reconhece o padrão. Os resultados ficam mais visíveis.' },
  { period: 'Semana 3', title: 'Ritmo Consolidado', description: 'Seu corpo já trabalha a seu favor. O esforço diminui e os resultados continuam.' },
  { period: 'Semana 4+', title: 'Estabilização', description: 'O protocolo se torna parte de você. Manter é mais fácil que começar.' },
];
