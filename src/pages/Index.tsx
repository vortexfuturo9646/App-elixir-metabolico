import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { HojeTab } from '@/components/tabs/HojeTab';
import { ProtocoloTab } from '@/components/tabs/ProtocoloTab';
import { EvolucaoTab } from '@/components/tabs/EvolucaoTab';
import { HistoricoTab } from '@/components/tabs/HistoricoTab';
import { PerfilTab } from '@/components/tabs/PerfilTab';
import { useUserData } from '@/hooks/useUserData';

type Tab = 'hoje' | 'protocolo' | 'evolucao' | 'historico' | 'perfil';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('hoje');
  const { 
    data, 
    updateWeight, 
    confirmDay, 
    toggleProtocolCheck, 
    updateName, 
    resetProgress,
    isCheckedInToday,
    weightLost,
    daysOnJourney,
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
            daysOnJourney={daysOnJourney}
            toggleProtocolCheck={toggleProtocolCheck}
          />
        );
      case 'protocolo':
        return <ProtocoloTab daysOnJourney={daysOnJourney} />;
      case 'evolucao':
        return <EvolucaoTab data={data} weightLost={weightLost} daysOnJourney={daysOnJourney} />;
      case 'historico':
        return <HistoricoTab data={data} daysOnJourney={daysOnJourney} weightLost={weightLost} />;
      case 'perfil':
        return (
          <PerfilTab 
            data={data}
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
      <main className="max-w-lg mx-auto px-4 pb-24 pt-4">
        {renderTab()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
