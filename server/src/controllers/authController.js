const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await db.query(query, [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        error: "E-mail ou senha incorretos",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        error: "E-mail ou senha incorretos",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    delete user.password;

    res.json({
      message: "Login realizado com sucesso!",
      token: token,
      user: user,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      error: "Erro interno no servidor",
    });
  }
};

exports.googleLogin = async (req, res) => {
  const { googleToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await db.query(userQuery, [email]);

    let user = userResult.rows[0];

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      const createQuery = `
      INSERT INTO users (name, email, password, avatar_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;

      const newUser = await db.query(createQuery, [
        name,
        email,
        hashedPassword,
        picture,
      ]);
      user = newUser.rows[0];
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      messagem: "Login Google realizado",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
      }
    });
  } catch (error){
    console.error("Erro no Google Login", error);
    res.status(500).json({
      error: "Token Google Iválido"
    })
  }
};
