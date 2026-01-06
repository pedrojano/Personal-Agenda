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

exports.getMe = async (req, res) => {
  try {
    if (!req.userId) {
      return res
        .status(401)
        .json({ error: "ID de usuário não encontrado na requisição." });
    }

    const result = await db.query(
      "SELECT id, name, email, avatar_url FROM users WHERE id = $1",
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro no getMe:", error);
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
};

exports.updateMe = async (req, res) => {
  const { name, email, avatar_url } = req.body;

  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Não autorizado." });
    }

    await db.query("UPDATE users SET name = $1, email = $2, avatar_url = $3 WHERE id = $4", [
      name,
      email,
      avatar_url,
      req.userId,
    ]);
    res.json({ message: "Perfil atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro no updateMe:", error);

    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
};
