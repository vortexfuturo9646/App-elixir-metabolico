import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { HojeTab } from '@/components/tabs/HojeTab';
import { MetodoTab } from '@/components/tabs/MetodoTab';
import { ProgressoTab } from '@/components/tabs/ProgressoTab';
import { RotinaTab } from '@/components/tabs/RotinaTab';
import { PerfilTab } from '@/components/tabs/PerfilTab';
import { useUserData } from '@/hooks/useUserData';

type Tab = 'hoje' | 'metodo' | 'progresso' | 'rotina' | 'perfil';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('hoje');
  const { 
    data, 
    updateWeight, 
    confirmDay, 
    toggleRoutineCheck, 
    updateName, 
    resetProgress,
    isCheckedInToday,
    weightLost,
  } = useUserData();

  const renderTab = () => {
    switch (activeTab) {
      case 'hoje':
        return (
          <HojeTab 
            data={data} 
            updateWeight={updateWeight}
            confirmDay={confirmDay}
            isCheckedInToday={isCheckedInToday}
            weightLost={weightLost}
          />
        );
      case 'metodo':
        return <MetodoTab />;
      case 'progresso':
        return <ProgressoTab data={data} weightLost={weightLost} />;
      case 'rotina':
        return (
          <RotinaTab 
            routineChecks={data.routineChecks}
            toggleRoutineCheck={toggleRoutineCheck}
          />
        );
      case 'perfil':
        return (
          <PerfilTab 
            data={data}
            updateName={updateName}
            resetProgress={resetProgress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-lg mx-auto px-4 pb-24 pt-4">
        {renderTab()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
