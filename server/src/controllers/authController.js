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
      idToken:  googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub, picture } = ticket.getPayload();

    const userCheck = await db.query(`SELECT * FROM users WHERE email =$1`, [
      email,
    ]);

    let userId;

    if (userCheck.rows.length === 0) {
      const newUser = await db.query(
        `INSERT INTO users ( name, email, google_id, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id`,
        [name, email, sub, picture]
      );
      userId = newUser.rows[0].id;
    } else {
      userId = userCheck.rows[0].id;
      await db.query(`UPDATE users SET avatar_url = $1 WHERE id = $2`, [
        picture,
        userId,
      ]);
    }

    const token = jwt.sign(
      {
        id: userId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: userId,
        name,
        email,
        avatar_url: picture,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao autenticar com google" });
  }

};