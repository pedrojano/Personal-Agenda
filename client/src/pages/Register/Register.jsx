import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Alert } from '../../components/ui/Alert/Alert';
import { AuthLayout } from '../../components/auth/AuthLayout';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/users/register', { name, email, password });
      alert("Conta criada!");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao criar conta");
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Crie sua conta" subtitle="Rápido e fácil">
      <Alert>{error}</Alert>
      <form onSubmit={handleRegister}>
        <Input label="Nome" icon={User} value={name} onChange={e=>setName(e.target.value)} required />
        <Input label="Email" icon={Mail} type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <Input label="Senha" icon={Lock} type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <Button type="submit" isLoading={loading} style={{marginTop: 20}}>Criar Conta</Button>
      </form>
      <p style={{textAlign:'center', marginTop: 20}}>
        Já tem conta? <Link to="/login" style={{color:'#2563eb', fontWeight:'bold'}}>Faça login</Link>
      </p>
    </AuthLayout>
  );
}