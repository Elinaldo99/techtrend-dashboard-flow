import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function RegisterPage({ onAuth }: { onAuth?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: 'Erro ao cadastrar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Cadastro realizado', description: 'Verifique seu e-mail para confirmar o cadastro.' });
      onAuth?.();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Cadastro</h2>
        <Input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Button>
        <div className="text-center text-sm mt-2">
          Já tem conta? <a href="/login" className="text-blue-600 hover:underline">Entrar</a>
        </div>
      </form>
    </div>
  );
}
