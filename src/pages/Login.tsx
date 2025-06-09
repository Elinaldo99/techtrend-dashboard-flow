import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onAuth }: { onAuth?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: 'Erro ao entrar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Login realizado', description: 'Bem-vindo!' });
      onAuth?.();
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Entrar</h2>
        <Input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
      </form>
    </div>
  );
}
