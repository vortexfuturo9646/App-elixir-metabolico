import { useState } from 'react';
import { User, Settings, RotateCcw, Heart, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserData } from '@/types/app';
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
} from "@/components/ui/alert-dialog";

interface PerfilTabProps {
  data: UserData;
  updateName: (name: string) => void;
  resetProgress: () => void;
}

const encouragements = [
  "Você está no caminho certo!",
  "Cada dia é uma nova oportunidade.",
  "Acredite no processo.",
  "Pequenos passos levam a grandes conquistas.",
  "Você é mais forte do que imagina.",
];

export const PerfilTab = ({ data, updateName, resetProgress }: PerfilTabProps) => {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(data.name);

  const handleSaveName = () => {
    updateName(tempName);
    setEditingName(false);
  };

  const daysOnJourney = Math.ceil(
    (new Date().getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center pt-2">
        <h1 className="text-2xl font-bold text-foreground">Seu Perfil</h1>
        <p className="text-muted-foreground mt-1">Configurações e informações</p>
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
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Seu nome"
                  className="h-10"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveName} className="gradient-primary">
                  OK
                </Button>
              </div>
            ) : (
              <button 
                onClick={() => { setTempName(data.name); setEditingName(true); }}
                className="text-left"
              >
                <h2 className="text-xl font-bold">{data.name || 'Toque para adicionar seu nome'}</h2>
                <p className="text-sm text-muted-foreground">Toque para editar</p>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-elevated p-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Início da Jornada</span>
          </div>
          <p className="text-lg font-bold">
            {new Date(data.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </p>
          <p className="text-xs text-muted-foreground">{daysOnJourney} dias atrás</p>
        </div>

        <div className="card-elevated p-4">
          <div className="flex items-center gap-2 text-accent mb-2">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Maior Sequência</span>
          </div>
          <p className="text-lg font-bold">{data.streak} dias</p>
          <p className="text-xs text-muted-foreground">Continue assim!</p>
        </div>
      </div>

      {/* Weight Summary */}
      <div className="card-elevated p-5">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          Resumo
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted rounded-xl">
            <span className="text-muted-foreground">Peso inicial</span>
            <span className="font-semibold">{data.initialWeight ? `${data.initialWeight} kg` : '--'}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded-xl">
            <span className="text-muted-foreground">Peso atual</span>
            <span className="font-semibold">{data.currentWeight ? `${data.currentWeight} kg` : '--'}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-success-soft rounded-xl">
            <span className="text-success font-medium">Total perdido</span>
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
        <p className="text-muted-foreground italic">"{randomEncouragement}"</p>
      </div>

      {/* Reset Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar Progresso
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="mx-4 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso irá apagar todo o seu progresso: peso registrado, histórico, sequência de dias e checklist. 
              Seu nome será mantido. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={resetProgress}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, resetar tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
