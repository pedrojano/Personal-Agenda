const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const tasksRoutes = require("./routes/tasksRoutes");


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.send("API Agenda Pessoal - Online"));
app.use("/users", userRoutes);
app.use("/tasks", tasksRoutes);


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});