import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const languages = [
  { id: 'pt', label: 'Português', flag: '🇧🇷' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'en', label: 'English', flag: '🇺🇸' },
];

const LanguageSelect = () => {
  const [selected, setSelected] = useState('pt');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({ language: selected })
      .eq('user_id', user.id);

    setLoading(false);

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o idioma. Tente novamente.',
        variant: 'destructive',
      });
      return;
    }

    navigate('/app', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary-soft flex items-center justify-center mx-auto">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Escolha o idioma do seu protocolo
          </h1>
          <p className="text-muted-foreground text-sm">
            Você pode alterar depois no Perfil
          </p>
        </div>

        {/* Language options */}
        <div className="space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelected(lang.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                selected === lang.id
                  ? 'border-primary bg-primary-soft'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <span className="text-3xl">{lang.flag}</span>
              <span className="text-lg font-semibold text-foreground flex-1 text-left">
                {lang.label}
              </span>
              {selected === lang.id && (
                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Confirm */}
        <Button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full h-12 text-base font-semibold gradient-primary text-primary-foreground hover:opacity-90"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar idioma'}
        </Button>
      </div>
    </div>
  );
};

export default LanguageSelect;
