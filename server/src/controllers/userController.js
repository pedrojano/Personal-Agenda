const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Nome, email e senha são obrigatórios." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at`;

    const values = [name, email, hashedPassword];

    const result = await db.query(query, values);

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    if (error.code === "23505") {
      res.status(409).json({ error: "Email já está em uso." });
    }

    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
