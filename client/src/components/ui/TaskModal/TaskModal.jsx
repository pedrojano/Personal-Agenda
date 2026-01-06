import React, { useState, useEffect } from "react";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Modal } from "../Modal/Modal";
import "./TaskModal.css";

export function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("PENDENTE");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title || "");
        setStartDate(
          taskToEdit.start_date
            ? taskToEdit.start_date.toString().slice(0, 16)
            : ""
        );
        setEndDate(
          taskToEdit.end_date ? taskToEdit.end_date.toString().slice(0, 16) : ""
        );
        setStatus(taskToEdit.status || "PENDENTE");
      } else {
        setTitle("");
        setStartDate("");
        setEndDate("");
        setStatus("PENDENTE");
        s;
      }
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await onSave({ title, start_date: startDate, end_date: endDate, status });
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit && taskToEdit.id ? "Editar Tarefa" : "Nova Tarefa"}
    >
      <form onSubmit={handleSubmit} className="task-form">
        <Input
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Ex: Reunião de Projeto"
        />

        {taskToEdit && (
          <div className="input-group">
            <label
              style={{
                display: "block",
                marginBottom: 5,
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "#374151",
              }}
            >
              Situação
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                outline: "none",
              }}
            >
              <option value="PENDENTE">🟡 Pendente</option>
              <option value="CONCLUIDA">🟢 Concluída</option>
              <option value="CANCELADA">🔴 Cancelada</option>
            </select>
          </div>
        )}

        <div className="form-dates-grid">
          <div className="date-input-group">
            <label>Início</label>
            <input
              type="datetime-local"
              className="native-date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="date-input-group">
            <label>Fim</label>
            <input
              type="datetime-local"
              className="native-date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="modal-footer">
          <div style={{ width: "100px" }}>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
          <div style={{ width: "100px" }}>
            <Button type="submit" isLoading={loading}>
              Salvar
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
