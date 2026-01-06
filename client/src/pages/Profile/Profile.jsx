import React, { useState, useEffect } from "react";
import AppLayout from "../../layouts/AppLayout";
import api from "../../services/api";
import { Button } from "../../components/ui/Button/Button";
import { Input } from "../../components/ui/Input/Input";
import { User, Mail, Save } from "lucide-react";
import "./Profile.css";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        console.log("Iniciando busca do perfil...");
        const response = await api.get("/users/me");

        console.log("Dados recebidos:", response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          avatar_url: response.data.avatar_url || "",
        });
      } catch (error) {
        console.error("Erro ao carregar:", error);
        alert("Erro ao carregar dados do perfil.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
    setImageError(false);
  }, [formData.avatar_url]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/users/me", formData);
      alert("Perfil atualizado com sucesso!");
      localStorage.setItem("user_name", formData.name);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar.");
    }
  };

  const getInitial = () => {
    return formData.name && formData.name.length > 0
      ? formData.name.charAt(0).toUpperCase()
      : "U";
  };

  return (
    <AppLayout>
      <div className="profile-container">
        <div className="profile-header">
          {formData.avatar_url && !imageError ? (
            <img
              src={formData.avatar_url}
              alt="Avatar"
              className="avatar-circle"
              style={{ objectFit: "cover", padding: 0, border: "none" }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="avatar-circle">{getInitial()}</div>
          )}

          <h2>{formData.name ? formData.name : "Usuário"}</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Carregando dados...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="profile-form">
            <Input
              label="Nome Completo"
              icon={User}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Seu nome"
            />

            <Input
              label="E-mail"
              icon={Mail}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="seu@email.com"
            />

            <Button type="submit">
              <Save size={18} style={{ marginRight: 8 }} /> Salvar Alterações
            </Button>
          </form>
        )}
      </div>
    </AppLayout>
  );
}
