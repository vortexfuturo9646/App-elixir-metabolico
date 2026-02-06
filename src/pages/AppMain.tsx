import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { HojeTab } from '@/components/tabs/HojeTab';
import { ProtocoloTab } from '@/components/tabs/ProtocoloTab';
import { EvolucaoTab } from '@/components/tabs/EvolucaoTab';
import { HistoricoTab } from '@/components/tabs/HistoricoTab';
import { PerfilTab } from '@/components/tabs/PerfilTab';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { UserData } from '@/types/app';
import { Loader2, Sparkles } from 'lucide-react';

type Tab = 'hoje' | 'protocolo' | 'evolucao' | 'historico' | 'perfil';

const AppMain = () => {
  const [activeTab, setActiveTab] = useState<Tab>('hoje');
  const [showActivation, setShowActivation] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data,
    loading,
    needsLanguage,
    updateWeight,
    confirmDay,
    toggleProtocolCheck,
    updateName,
    updateLanguage,
    resetProgress,
    isCheckedInToday,
    weightLost,
    daysOnJourney,
  } = useProfile();

  useEffect(() => {
    if (needsLanguage) {
      navigate('/idioma', { replace: true });
    }
  }, [needsLanguage, navigate]);

  // Show activation message on first load
  useEffect(() => {
    if (data && !loading) {
      const shown = sessionStorage.getItem('activation-shown');
      if (!shown) {
        setShowActivation(true);
        sessionStorage.setItem('activation-shown', 'true');
        setTimeout(() => setShowActivation(false), 3000);
      }
    }
  }, [data, loading]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Adapt CloudUserData to UserData interface for existing components
  const userData: UserData = {
    initialWeight: data.initialWeight,
    currentWeight: data.currentWeight,
    streak: data.streak,
    lastCheckIn: data.lastCheckIn,
    weightHistory: data.weightHistory,
    protocolChecks: data.protocolChecks,
    name: data.name,
    startDate: data.startDate,
    ritualCompleted: data.ritualCompleted,
    ritualCompletedDate: data.ritualCompletedDate,
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'hoje':
        return (
          <HojeTab
            data={userData}
            updateWeight={updateWeight}
            confirmDay={confirmDay}
            isCheckedInToday={isCheckedInToday}
            weightLost={weightLost}
            daysOnJourney={daysOnJourney}
            toggleProtocolCheck={toggleProtocolCheck}
          />
        );
      case 'protocolo':
        return <ProtocoloTab daysOnJourney={daysOnJourney} />;
      case 'evolucao':
        return <EvolucaoTab data={userData} weightLost={weightLost} daysOnJourney={daysOnJourney} />;
      case 'historico':
        return <HistoricoTab data={userData} daysOnJourney={daysOnJourney} weightLost={weightLost} />;
      case 'perfil':
        return (
          <PerfilTab
            data={userData}
            updateName={updateName}
            resetProgress={resetProgress}
            daysOnJourney={daysOnJourney}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Activation message */}
      {showActivation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center animate-scale-in bg-card p-8 rounded-2xl shadow-elevated">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="text-xl font-bold text-foreground">Acesso liberado</p>
            <p className="text-muted-foreground mt-1">Seu protocolo está ativo.</p>
          </div>
        </div>
      )}

      <main className="max-w-lg mx-auto px-4 pb-24 pt-4">
        {renderTab()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default AppMain;
