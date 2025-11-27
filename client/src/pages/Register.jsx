import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import api from "../services/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { AuthLayout } from "../components/auth/AuthLayout";
import {
  AuthHeader,
  AuthDivider,
  AuthFooter,
} from "../components/auth/AuthComponents";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/users/register", { name, email, password });

      alert("Conta criada com sucesso! Você será redirecionado para o login.");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      brandingTitle="Junte-se ao Agenda Pro"
      brandingSubtitle="Comece hoje a organizar sua vida pessoal e profissional com máxima eficiência."
    >
      <AuthHeader
        title="Crie sua conta"
        subtitle="É rápido, simples e gratuito."
      />

      <Alert>{error}</Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome Completo"
          icon={User}
          type="text"
          placeholder="Ex: Pedro Silva"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="E-mail"
          icon={Mail}
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Senha"
          icon={Lock}
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={loading} className="mt-6">
          Criar Conta <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>

      <AuthDivider text="Ou cadastre-se com" />

      <Button type="button" variant="outline">
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="h-5 w-5 mr-2"
          alt="Google"
        />
        Google
      </Button>

      <AuthFooter
        text="Já tem uma conta?"
        linkText="Faça login"
        linkTo="/login"
      />
    </AuthLayout>
  );
}
