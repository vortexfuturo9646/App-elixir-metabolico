import { useState, useEffect } from 'react';
import { UserData, defaultProtocolItems } from '@/types/app';

const STORAGE_KEY = 'elixir-metabolico-data';

const getInitialData = (): UserData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    // Migration: convert old routineChecks to protocolChecks
    if (parsed.routineChecks && !parsed.protocolChecks) {
      parsed.protocolChecks = defaultProtocolItems.map(item => ({ ...item, completed: false }));
      delete parsed.routineChecks;
    }
    if (!parsed.ritualCompleted) parsed.ritualCompleted = false;
    if (!parsed.ritualCompletedDate) parsed.ritualCompletedDate = null;
    if (!parsed.protocolChecks) {
      parsed.protocolChecks = defaultProtocolItems.map(item => ({ ...item, completed: false }));
    }
    // Migration: enrich existing checks with new pillar/description/guidance fields
    if (parsed.protocolChecks && parsed.protocolChecks.length > 0 && !parsed.protocolChecks[0].pillar) {
      parsed.protocolChecks = defaultProtocolItems.map(item => {
        const existing = parsed.protocolChecks.find((c: any) => c.id === item.id);
        return { ...item, completed: existing?.completed || false };
      });
    }
    return parsed;
  }
  return {
    initialWeight: null,
    currentWeight: null,
    streak: 0,
    lastCheckIn: null,
    weightHistory: [],
    protocolChecks: defaultProtocolItems.map(item => ({ ...item, completed: false })),
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    ritualCompleted: false,
    ritualCompletedDate: null,
  };
};

export const useUserData = () => {
  const [data, setData] = useState<UserData>(getInitialData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateWeight = (type: 'initial' | 'current', value: number | null) => {
    setData(prev => {
      const updated = {
        ...prev,
        [type === 'initial' ? 'initialWeight' : 'currentWeight']: value,
      };
      
      if (type === 'current' && value !== null) {
        const today = new Date().toISOString().split('T')[0];
        const existingIndex = prev.weightHistory.findIndex(e => e.date === today);
        
        if (existingIndex >= 0) {
          updated.weightHistory = [...prev.weightHistory];
          updated.weightHistory[existingIndex] = { date: today, weight: value };
        } else {
          updated.weightHistory = [...prev.weightHistory, { date: today, weight: value }];
        }
      }
      
      return updated;
    });
  };

  const confirmDay = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setData(prev => {
      if (prev.lastCheckIn === today) {
        return prev;
      }
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const isConsecutive = prev.lastCheckIn === yesterdayStr;
      
      return {
        ...prev,
        streak: isConsecutive ? prev.streak + 1 : 1,
        lastCheckIn: today,
        ritualCompleted: true,
        ritualCompletedDate: today,
        protocolChecks: defaultProtocolItems.map(item => ({ ...item, completed: false })),
      };
    });
  };

  const toggleProtocolCheck = (id: string) => {
    setData(prev => ({
      ...prev,
      protocolChecks: prev.protocolChecks.map(check =>
        check.id === id ? { ...check, completed: !check.completed } : check
      ),
    }));
  };

  const updateName = (name: string) => {
    setData(prev => ({ ...prev, name }));
  };

  const resetProgress = () => {
    const fresh: UserData = {
      initialWeight: null,
      currentWeight: null,
      streak: 0,
      lastCheckIn: null,
      weightHistory: [],
      protocolChecks: defaultProtocolItems.map(item => ({ ...item, completed: false })),
      name: data.name,
      startDate: new Date().toISOString().split('T')[0],
      ritualCompleted: false,
      ritualCompletedDate: null,
    };
    setData(fresh);
  };

  const today = new Date().toISOString().split('T')[0];
  const isCheckedInToday = data.lastCheckIn === today;
  const weightLost = data.initialWeight && data.currentWeight 
    ? Math.max(0, data.initialWeight - data.currentWeight) 
    : 0;
  const daysOnJourney = Math.max(1, Math.ceil(
    (new Date().getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ));

  return {
    data,
    updateWeight,
    confirmDay,
    toggleProtocolCheck,
    updateName,
    resetProgress,
    isCheckedInToday,
    weightLost,
    daysOnJourney,
  };
};
