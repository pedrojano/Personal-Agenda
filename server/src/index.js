const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const userController = require("./controllers/userController");
const authController = require("./controllers/authController");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");

    res.json({
      message: "Banco conectado com sucesso!",
      time_from_db: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao conectar ao banco de dados" });
  }
});

//rputes
app.post("/users", userController.createUser);
app.post("/login", authController.login);


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    // console.log(`Teste a conexão acessando: http://localhost:${PORT}`);
});
