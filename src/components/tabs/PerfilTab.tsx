import { useState } from 'react';
import { User, Settings, RotateCcw, Heart, Calendar, Beaker, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserData } from '@/types/app';
import { getCurrentPhase } from '@/lib/protocol';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PerfilTabProps {
  data: UserData;
  updateName: (name: string) => void;
  resetProgress: () => void;
  daysOnJourney: number;
}

const protocolMessages = [
  'Seu protocolo está ativo. Continue executando.',
  'Consistência é o combustível da transformação.',
  'Você está construindo algo que a maioria desiste de tentar.',
  'O método funciona quando você executa. E você está executando.',
  'Cada dia é uma prova de que você escolheu mudar.',
];

export const PerfilTab = ({ data, updateName, resetProgress, daysOnJourney }: PerfilTabProps) => {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(data.name);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const currentPhase = getCurrentPhase(daysOnJourney);
  const encouragement = protocolMessages[new Date().getDay() % protocolMessages.length];

  const handleSaveName = () => {
    updateName(tempName);
    setEditingName(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center pt-2">
        <h1 className="text-2xl font-bold text-foreground">Seu Perfil</h1>
        <p className="text-muted-foreground mt-1">Protocolo Elixir Metabólico</p>
      </div>

      {/* Profile Card */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            {editingName ? (
              <div className="flex gap-2">
                <Input value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="Seu nome" className="h-10" autoFocus />
                <Button size="sm" onClick={handleSaveName} className="gradient-primary">OK</Button>
              </div>
            ) : (
              <button onClick={() => { setTempName(data.name); setEditingName(true); }} className="text-left">
                <h2 className="text-xl font-bold">{data.name || 'Toque para adicionar seu nome'}</h2>
                <p className="text-sm text-muted-foreground">Toque para editar</p>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Protocol Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-elevated p-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Início</span>
          </div>
          <p className="text-lg font-bold">
            {new Date(data.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </p>
          <p className="text-xs text-muted-foreground">{daysOnJourney} dias no protocolo</p>
        </div>

        <div className="card-elevated p-4">
          <div className="flex items-center gap-2 text-accent mb-2">
            <Beaker className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Fase</span>
          </div>
          <p className="text-lg font-bold">{currentPhase.name}</p>
          <p className="text-xs text-muted-foreground">Em execução</p>
        </div>
      </div>

      {/* Weight Summary */}
      <div className="card-elevated p-5">
        <h3 className="font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
          <Settings className="w-4 h-4 text-primary" />
          Resumo do Protocolo
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted rounded-xl">
            <span className="text-muted-foreground text-sm">Peso inicial</span>
            <span className="font-semibold">{data.initialWeight ? `${data.initialWeight} kg` : '--'}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded-xl">
            <span className="text-muted-foreground text-sm">Peso atual</span>
            <span className="font-semibold">{data.currentWeight ? `${data.currentWeight} kg` : '--'}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-success-soft rounded-xl">
            <span className="text-success font-medium text-sm">Eliminado pelo protocolo</span>
            <span className="font-bold text-success">
              {data.initialWeight && data.currentWeight
                ? `-${Math.max(0, data.initialWeight - data.currentWeight).toFixed(1)} kg`
                : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Encouragement */}
      <div className="card-elevated p-5 text-center border-l-4 border-primary">
        <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
        <p className="text-muted-foreground italic text-sm">"{encouragement}"</p>
      </div>

      {/* Reset */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reiniciar Protocolo
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="mx-4 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Reiniciar o Protocolo?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso irá resetar todo o progresso: registros de peso, sequência, histórico e checklist do protocolo.
              Seu nome será mantido. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={resetProgress} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sim, reiniciar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout */}
      <Button
        variant="ghost"
        onClick={async () => {
          await signOut();
          navigate('/', { replace: true });
        }}
        className="w-full text-muted-foreground hover:text-foreground"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sair da conta
      </Button>
    </div>
  );
};
