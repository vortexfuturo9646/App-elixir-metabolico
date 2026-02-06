import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Eye, EyeOff, Loader2, Beaker, Mail } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

type Mode = 'login' | 'signup' | 'forgot';

const emailSchema = z.string().trim().email('E-mail inválido').max(255);
const passwordSchema = z.string().min(6, 'Mínimo 6 caracteres').max(100);
const nameSchema = z.string().trim().min(1, 'Informe seu nome').max(100);

const Auth = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailSent, setEmailSent] = useState(false);

  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0].message;

    if (mode !== 'forgot') {
      const passResult = passwordSchema.safeParse(password);
      if (!passResult.success) newErrors.password = passResult.error.errors[0].message;
    }

    if (mode === 'signup') {
      const nameResult = nameSchema.safeParse(name);
      if (!nameResult.success) newErrors.name = nameResult.error.errors[0].message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    if (mode === 'forgot') {
      const { error } = await resetPassword(email.trim());
      setLoading(false);
      if (error) {
        setErrors({ general: error });
      } else {
        setEmailSent(true);
      }
      return;
    }

    if (mode === 'signup') {
      const { error } = await signUp(email.trim(), password, name.trim());
      setLoading(false);
      if (error) {
        setErrors({ general: error });
      }
      // Auto-confirmed, navigation handled by auth state change
      return;
    }

    // Login
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      setErrors({ general: error });
    }
    // Navigation handled by auth state change
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setErrors({});
    setEmailSent(false);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">E-mail enviado</h2>
          <p className="text-muted-foreground">
            Verifique sua caixa de entrada para redefinir sua senha.
          </p>
          <Button
            variant="outline"
            onClick={() => switchMode('login')}
            className="w-full"
          >
            Voltar para entrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-8">
      <div className="max-w-sm w-full mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Voltar</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Beaker className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {mode === 'login' && 'Entrar'}
              {mode === 'signup' && 'Criar acesso'}
              {mode === 'forgot' && 'Recuperar senha'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === 'login' && 'Acesse seu protocolo'}
              {mode === 'signup' && 'Ative seu protocolo'}
              {mode === 'forgot' && 'Enviaremos um link por e-mail'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium">{errors.general}</p>
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Nome</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="h-12"
                autoComplete="name"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">E-mail</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="h-12"
              autoComplete="email"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="h-12 pr-12"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
          )}

          {mode === 'login' && (
            <button
              type="button"
              onClick={() => switchMode('forgot')}
              className="text-sm text-primary hover:underline font-medium"
            >
              Esqueci minha senha
            </button>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base font-semibold gradient-primary text-primary-foreground hover:opacity-90 transition-opacity mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {mode === 'login' && 'Entrar'}
                {mode === 'signup' && 'Ativar conta'}
                {mode === 'forgot' && 'Enviar link'}
              </>
            )}
          </Button>
        </form>

        {/* Switch mode */}
        <div className="text-center mt-6">
          {mode === 'login' ? (
            <p className="text-sm text-muted-foreground">
              Ainda não tem acesso?{' '}
              <button onClick={() => switchMode('signup')} className="text-primary font-semibold hover:underline">
                Criar acesso
              </button>
            </p>
          ) : mode === 'signup' ? (
            <p className="text-sm text-muted-foreground">
              Já tem acesso?{' '}
              <button onClick={() => switchMode('login')} className="text-primary font-semibold hover:underline">
                Entrar
              </button>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Lembrou a senha?{' '}
              <button onClick={() => switchMode('login')} className="text-primary font-semibold hover:underline">
                Entrar
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
