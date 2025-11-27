import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import api from "../services/api";
import { GoogleLogin } from "@react-oauth/google";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";

import { AuthLayout } from "../components/auth/AuthLayout";
import {
  AuthHeader,
  AuthDivider,
  AuthFooter,
} from "../components/auth/AuthComponents";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/users/login", { email, password });
      const { token, user } = response.data;
      localStorage.setItem("user_token", token);
      localStorage.setItem("user_data", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Erro de conexão.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      console.log("Token do Google:", credentialResponse.credential);

      const response = await api.post("/users/google-login", {
        googleToken: credentialResponse.credential,
      });

      const { token, user } = response.data;

      localStorage.setItem("user_token", token);
      localStorage.setItem("user_data", JSON.stringify(user));

      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login com Google", err);
      setError("Erro ao autenticar com o Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      brandingTitle="Agenda Pessoal Pro"
      brandingSubtitle="Seu sistema de organização definitivo."
    >
      <AuthHeader
        title="Bem-vindo de volta"
        subtitle="Insira suas credenciais para acessar."
      />

      <Alert>{error}</Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={loading}>
          Entrar na Plataforma <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>

      <AuthDivider text="Ou continue com" />

      <div className="w-full flex justify-center mt-4">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Erro ao conectar com Google")}
          text="signin_with"
          shape="pill"
          width="300"
        />
      </div>

      <AuthFooter
        text="Não tem uma conta?"
        linkText="Crie agora gratuitamente"
        linkTo="/register"
      />
    </AuthLayout>
  );
}
