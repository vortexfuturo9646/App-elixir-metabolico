import { CalendarCheck, Beaker, TrendingUp, Clock, User } from 'lucide-react';

type Tab = 'hoje' | 'protocolo' | 'evolucao' | 'historico' | 'perfil';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'hoje', label: 'Hoje', icon: CalendarCheck },
  { id: 'protocolo', label: 'Protocolo', icon: Beaker },
  { id: 'evolucao', label: 'Evolução', icon: TrendingUp },
  { id: 'historico', label: 'Histórico', icon: Clock },
  { id: 'perfil', label: 'Perfil', icon: User },
];

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-50">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                isActive 
                  ? 'bg-primary-soft text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-xs font-semibold ${isActive ? 'text-primary' : ''}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  );
};
