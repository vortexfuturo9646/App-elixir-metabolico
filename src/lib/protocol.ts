import { protocolPhases, ProtocolPhase, Milestone, UserData } from '@/types/app';

export const getCurrentPhase = (daysOnJourney: number): ProtocolPhase => {
  for (const phase of protocolPhases) {
    if (daysOnJourney >= phase.startDay && daysOnJourney <= phase.endDay) {
      return phase;
    }
  }
  return protocolPhases[protocolPhases.length - 1];
};

export const getPhaseProgress = (daysOnJourney: number): number => {
  const phase = getCurrentPhase(daysOnJourney);
  if (phase.id === 'estabilizacao') {
    return Math.min(100, ((daysOnJourney - phase.startDay + 1) / 30) * 100);
  }
  const daysInPhase = daysOnJourney - phase.startDay + 1;
  return Math.min(100, (daysInPhase / phase.durationDays) * 100);
};

export const getPhaseIndex = (daysOnJourney: number): number => {
  const phase = getCurrentPhase(daysOnJourney);
  return protocolPhases.findIndex(p => p.id === phase.id);
};

export const getMilestones = (data: UserData, daysOnJourney: number, weightLost: number): Milestone[] => {
  return [
    {
      id: 'protocol_activated',
      label: 'Protocolo Ativado',
      description: 'Você iniciou o Elixir Metabólico',
      achieved: true,
    },
    {
      id: 'first_ritual',
      label: 'Primeiro Ritual Concluído',
      description: 'O primeiro passo é o mais importante',
      achieved: data.streak >= 1 || data.lastCheckIn !== null,
    },
    {
      id: 'three_day_streak',
      label: 'Sequência de 3 dias',
      description: 'Seu corpo começou a reconhecer o padrão',
      achieved: data.streak >= 3,
      streakRequired: 3,
    },
    {
      id: 'first_week',
      label: 'Primeira Semana Consolidada',
      description: 'O protocolo já faz parte da sua rotina',
      achieved: daysOnJourney >= 7 && data.streak >= 5,
      dayRequired: 7,
    },
    {
      id: 'acceleration_phase',
      label: 'Fase de Aceleração Atingida',
      description: 'Seu metabolismo entrou em ritmo acelerado',
      achieved: daysOnJourney >= 8,
      dayRequired: 8,
    },
    {
      id: 'two_weeks',
      label: 'Protocolo Consolidado (14 dias)',
      description: 'Você já construiu um novo padrão',
      achieved: data.streak >= 14,
      streakRequired: 14,
    },
    {
      id: 'metabolism_stabilized',
      label: 'Metabolismo Estabilizado',
      description: 'O protocolo se tornou parte de quem você é',
      achieved: daysOnJourney >= 22,
      dayRequired: 22,
    },
    {
      id: 'first_kg',
      label: 'Primeiro kg eliminado',
      description: 'Os resultados começaram a aparecer',
      achieved: weightLost >= 1,
      weightRequired: 1,
    },
    {
      id: 'three_kg',
      label: '3kg eliminados',
      description: 'Evolução metabólica em andamento',
      achieved: weightLost >= 3,
      weightRequired: 3,
    },
    {
      id: 'five_kg',
      label: '5kg eliminados',
      description: 'Transformação visível — você é outra pessoa',
      achieved: weightLost >= 5,
      weightRequired: 5,
    },
  ];
};

export const interpretWeightProgress = (
  weightLost: number,
  daysOnJourney: number,
  recentEntries: { date: string; weight: number }[]
): { title: string; message: string; type: 'positive' | 'neutral' | 'encouraging' } => {
  // Check recent trend (last 3 entries)
  if (recentEntries.length >= 3) {
    const last3 = recentEntries.slice(-3);
    const trend = last3[2].weight - last3[0].weight;

    if (trend > 0.5) {
      return {
        title: 'Fase de Adaptação',
        message: 'Seu corpo está se reorganizando internamente. Variações são normais e fazem parte do processo metabólico. O protocolo continua ativo.',
        type: 'encouraging',
      };
    }
  }

  if (weightLost <= 0) {
    if (daysOnJourney <= 3) {
      return {
        title: 'Ajuste Interno em Andamento',
        message: 'Nos primeiros dias, o corpo reconhece o novo padrão. Os números ainda não refletem o que está acontecendo por dentro.',
        type: 'neutral',
      };
    }
    return {
      title: 'Processo Interno Ativo',
      message: 'Retenção temporária ou adaptação metabólica. Seu corpo está trabalhando mesmo quando a balança não mostra. Continue.',
      type: 'encouraging',
    };
  }

  if (weightLost < 2) {
    return {
      title: 'Evolução Inicial',
      message: `Seu protocolo já eliminou ${weightLost.toFixed(1)}kg. O metabolismo está respondendo. Cada dia consolida mais o resultado.`,
      type: 'positive',
    };
  }

  if (weightLost < 5) {
    return {
      title: 'Aceleração Confirmada',
      message: `${weightLost.toFixed(1)}kg eliminados. Seu corpo já reconhece o ritmo do protocolo. Os resultados estão se acumulando.`,
      type: 'positive',
    };
  }

  return {
    title: 'Transformação em Curso',
    message: `${weightLost.toFixed(1)}kg eliminados. O protocolo está entregando resultados reais. Você está provando que é possível.`,
    type: 'positive',
  };
};

export const getProtocolStatusMessage = (streak: number, isCheckedIn: boolean): string => {
  if (isCheckedIn) return 'Protocolo executado. Hoje você reforçou o processo. ✓';
  if (streak === 0) return 'Seu protocolo aguarda ativação. Comece enviando os sinais certos ao seu corpo.';
  return `Protocolo ativo — ${streak} ${streak === 1 ? 'dia' : 'dias'} consecutivos. Cada dia reforça o padrão.`;
};

export const getConfirmationMessage = (): string => {
  const messages = [
    'Protocolo executado. Hoje você reforçou o processo.',
    'Sinais corretos enviados ao corpo hoje.',
    'Mais um dia de protocolo ativo. Seu corpo reconhece o padrão.',
    'Compromisso mantido. Você está construindo um novo ritmo.',
    'Dia concluído. Consistência é o que transforma.',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

export const getRitualMessage = (streak: number): string => {
  if (streak === 0) return 'Ative seu protocolo hoje';
  if (streak === 1) return 'Protocolo ativado. Mantenha o ritmo.';
  if (streak < 7) return `${streak} dias de protocolo ativo. Seu corpo já sente a diferença.`;
  if (streak < 14) return `${streak} dias! Aceleração metabólica em andamento.`;
  if (streak < 21) return `${streak} dias de consistência. O protocolo já é parte de você.`;
  return `${streak} dias. Metabolismo estabilizado. Você se transformou.`;
};
