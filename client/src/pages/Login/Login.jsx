import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../services/api';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Alert } from '../../components/ui/Alert/Alert';
import { AuthLayout } from '../../components/auth/AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/users/login', { email, password });
      localStorage.setItem('user_token', res.data.token);
      localStorage.setItem('user_data', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao logar");
    } finally { setLoading(false); }
  };

  const handleGoogle = async (cred) => {
    try {
      const res = await api.post('/users/google-login', { googleToken: cred.credential });
      localStorage.setItem('user_token', res.data.token);
      localStorage.setItem('user_data', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) { setError("Erro com Google"); }
  };

  return (
    <AuthLayout title="Bem-vindo" subtitle="Acesse sua conta">
      <Alert>{error}</Alert>
      <form onSubmit={handleLogin}>
        <Input label="Email" icon={Mail} type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <Input label="Senha" icon={Lock} type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <Button type="submit" isLoading={loading} style={{marginTop: 20}}>Entrar <ArrowRight size={18} /></Button>
      </form>
      <div className="auth-divider"><span>Ou</span></div>
      <div style={{display:'flex', justifyContent:'center'}}>
        <GoogleLogin onSuccess={handleGoogle} onError={() => setError('Falha Google')} />
      </div>
      <p style={{textAlign:'center', marginTop: 20}}>
        Não tem conta? <Link to="/register" style={{color:'#2563eb', fontWeight:'bold'}}>Crie agora</Link>
      </p>
    </AuthLayout>
  );
}