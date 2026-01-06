import React, { useEffect, useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalIcon,
} from "lucide-react";
import api from "../../services/api";

import AppLayout from "../../layouts/AppLayout";
import { Button } from "../../components/ui/Button/Button";
import { TaskModal } from "../../components/ui/TaskModal/TaskModal";

import "./Tasks.css";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const response = await api.get("/tasks");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.tasks || [];
      setTasks(data);
    } catch (error) {
      console.error("Erro", error);
    } finally {
      setLoading(false);
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const DaysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= DaysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthName = currentDate.toLocaleString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  const calendarDays = getDaysInMonth(currentDate);

  const getTasksForDay = (dayDate) => {
    if (!dayDate) return [];
    return tasks.filter((task) => {
      const taskStart = new Date(task.start_date);
      const taskEnd = new Date(task.end_date);
      const currentDay = new Date(dayDate);

      taskStart.setHours(0, 0, 0, 0);
      taskEnd.setHours(0, 0, 0, 0);
      currentDay.setHours(0, 0, 0, 0);

      return (
        currentDay.getTime() >= taskStart.getTime() &&
        currentDay.getTime() <= taskEnd.getTime()
      );
    });
  };

  async function handleSaveTask(taskData) {
    try {
      if (taskToEdit && taskToEdit.id) {
        const response = await api.put(`/tasks/${taskToEdit.id}`, taskData);
      } else {
        const response = await api.post("/tasks", taskData);
      }

      await loadTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar Tarefa");
    }
  }

  const openNewTask = (preSelectedDate = null) => {
    setTaskToEdit(
      preSelectedDate ? { start_date: preSelectedDate.toISOString() } : null
    );
    setIsModalOpen(true);
  };

  const openEditTask = (e, task) => {
    e.stopPropagation();
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="calendar-header">
        <div className="month-navigation">
          <button onClick={() => changeMonth(-1)} className="nav-btn">
            <ChevronLeft />
          </button>
          <h2>{monthName}</h2>
          <button onClick={() => changeMonth(1)} className="nav-btn">
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="calendar-grid-wrapper">
        <div className="weekdays-header">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((d) => (
            <div key={d} className="weekday">
              {d}
            </div>
          ))}
        </div>

        <div className="days-grid">
          {calendarDays.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            const isToday =
              day && day.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`day-cell ${!day ? "empty" : ""} ${
                  isToday ? "today" : ""
                }`}
                onClick={() => day && openNewTask(day)}
              >
                {day && (
                  <>
                    <span className="day-number">{day.getDate()}</span>

                    <div className="day-tasks-list">
                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`mini-task-chip ${task.status.toLowerCase()}`}
                          onClick={(e) => openEditTask(e, task)}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </AppLayout>
  );
}
