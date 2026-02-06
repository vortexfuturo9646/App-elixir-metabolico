import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { defaultProtocolItems } from '@/types/app';

export interface Profile {
  name: string;
  language: string;
  initialWeight: number | null;
  currentWeight: number | null;
  streak: number;
  lastCheckIn: string | null;
  startDate: string;
  ritualCompleted: boolean;
  ritualCompletedDate: string | null;
}

export interface CloudUserData {
  initialWeight: number | null;
  currentWeight: number | null;
  streak: number;
  lastCheckIn: string | null;
  weightHistory: { date: string; weight: number }[];
  protocolChecks: { id: string; label: string; completed: boolean; pillar: string; description: string; guidance: string }[];
  name: string;
  startDate: string;
  ritualCompleted: boolean;
  ritualCompletedDate: string | null;
  language: string;
}

const todayStr = () => new Date().toISOString().split('T')[0];

export const useProfile = () => {
  const { user } = useAuth();
  const [data, setData] = useState<CloudUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsLanguage, setNeedsLanguage] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) { setLoading(false); return; }

    // Load profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile) { setLoading(false); return; }

    // Check if first login (no language set or default)
    if (!profile.language || profile.language === 'pt') {
      // Check if name is also empty -> first time user
      if (!profile.name && profile.streak === 0) {
        // Update name from auth metadata if available
        const authName = user.user_metadata?.name || '';
        if (authName) {
          await supabase.from('profiles').update({ name: authName }).eq('user_id', user.id);
          profile.name = authName;
        }
        setNeedsLanguage(true);
      }
    }

    // Load weight history
    const { data: weights } = await supabase
      .from('weight_history')
      .select('date, weight')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    // Load today's protocol checks
    const today = todayStr();
    const { data: checks } = await supabase
      .from('protocol_checks')
      .select('check_id, completed')
      .eq('user_id', user.id)
      .eq('date', today);

    const checkMap = new Map<string, boolean>(checks?.map(c => [c.check_id, c.completed as boolean]) || []);

    const protocolChecks = defaultProtocolItems.map(item => ({
      ...item,
      completed: checkMap.get(item.id) || false,
    }));

    setData({
      initialWeight: profile.initial_weight ? Number(profile.initial_weight) : null,
      currentWeight: profile.current_weight ? Number(profile.current_weight) : null,
      streak: profile.streak || 0,
      lastCheckIn: profile.last_check_in,
      weightHistory: (weights || []).map(w => ({ date: w.date, weight: Number(w.weight) })),
      protocolChecks,
      name: profile.name || '',
      startDate: profile.start_date || todayStr(),
      ritualCompleted: profile.ritual_completed || false,
      ritualCompletedDate: profile.ritual_completed_date,
      language: profile.language || 'pt',
    });

    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateWeight = async (type: 'initial' | 'current', value: number | null) => {
    if (!user || !data) return;

    const field = type === 'initial' ? 'initial_weight' : 'current_weight';
    await supabase.from('profiles').update({ [field]: value }).eq('user_id', user.id);

    if (type === 'current' && value !== null) {
      const today = todayStr();
      await supabase.from('weight_history').upsert(
        { user_id: user.id, date: today, weight: value },
        { onConflict: 'user_id,date' }
      );
    }

    await loadData();
  };

  const confirmDay = async () => {
    if (!user || !data) return;
    const today = todayStr();
    if (data.lastCheckIn === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const isConsecutive = data.lastCheckIn === yesterdayStr;

    await supabase.from('profiles').update({
      streak: isConsecutive ? data.streak + 1 : 1,
      last_check_in: today,
      ritual_completed: true,
      ritual_completed_date: today,
    }).eq('user_id', user.id);

    // Reset protocol checks for new day
    await supabase.from('protocol_checks').delete().eq('user_id', user.id).eq('date', today);

    await loadData();
  };

  const toggleProtocolCheck = async (id: string) => {
    if (!user || !data) return;
    const today = todayStr();
    const current = data.protocolChecks.find(c => c.id === id);
    if (!current) return;

    const newVal = !current.completed;

    await supabase.from('protocol_checks').upsert(
      { user_id: user.id, check_id: id, date: today, completed: newVal },
      { onConflict: 'user_id,check_id,date' }
    );

    // Optimistic update
    setData(prev => prev ? {
      ...prev,
      protocolChecks: prev.protocolChecks.map(c => c.id === id ? { ...c, completed: newVal } : c),
    } : null);
  };

  const updateName = async (name: string) => {
    if (!user) return;
    await supabase.from('profiles').update({ name }).eq('user_id', user.id);
    setData(prev => prev ? { ...prev, name } : null);
  };

  const updateLanguage = async (language: string) => {
    if (!user) return;
    await supabase.from('profiles').update({ language }).eq('user_id', user.id);
    setData(prev => prev ? { ...prev, language } : null);
  };

  const resetProgress = async () => {
    if (!user) return;
    
    await supabase.from('profiles').update({
      initial_weight: null,
      current_weight: null,
      streak: 0,
      last_check_in: null,
      start_date: todayStr(),
      ritual_completed: false,
      ritual_completed_date: null,
    }).eq('user_id', user.id);

    await supabase.from('weight_history').delete().eq('user_id', user.id);
    await supabase.from('protocol_checks').delete().eq('user_id', user.id);

    await loadData();
  };

  const today = todayStr();
  const isCheckedInToday = data?.lastCheckIn === today;
  const weightLost = data?.initialWeight && data?.currentWeight
    ? Math.max(0, data.initialWeight - data.currentWeight)
    : 0;
  const daysOnJourney = data ? Math.max(1, Math.ceil(
    (new Date().getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)
  )) : 1;

  return {
    data,
    loading,
    needsLanguage,
    setNeedsLanguage,
    updateWeight,
    confirmDay,
    toggleProtocolCheck,
    updateName,
    updateLanguage,
    resetProgress,
    isCheckedInToday,
    weightLost,
    daysOnJourney,
  };
};
