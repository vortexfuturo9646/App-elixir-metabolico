import { useState, useEffect } from 'react';
import { UserData, defaultRoutineItems } from '@/types/app';

const STORAGE_KEY = 'habit-tracker-data';

const getInitialData = (): UserData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    initialWeight: null,
    currentWeight: null,
    streak: 0,
    lastCheckIn: null,
    weightHistory: [],
    routineChecks: defaultRoutineItems.map(item => ({ ...item, completed: false })),
    name: '',
    startDate: new Date().toISOString().split('T')[0],
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
        routineChecks: defaultRoutineItems.map(item => ({ ...item, completed: false })),
      };
    });
  };

  const toggleRoutineCheck = (id: string) => {
    setData(prev => ({
      ...prev,
      routineChecks: prev.routineChecks.map(check =>
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
      routineChecks: defaultRoutineItems.map(item => ({ ...item, completed: false })),
      name: data.name,
      startDate: new Date().toISOString().split('T')[0],
    };
    setData(fresh);
  };

  const isCheckedInToday = data.lastCheckIn === new Date().toISOString().split('T')[0];
  const weightLost = data.initialWeight && data.currentWeight 
    ? Math.max(0, data.initialWeight - data.currentWeight) 
    : 0;

  return {
    data,
    updateWeight,
    confirmDay,
    toggleRoutineCheck,
    updateName,
    resetProgress,
    isCheckedInToday,
    weightLost,
  };
};
