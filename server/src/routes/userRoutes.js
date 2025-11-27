const express = require("express");
const db = require("../config/db");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", userController.createUser);
router.post("/login", authController.login);
router.get("/me", authMiddleware, async (req, res) => {
  
    try {
    const result = await db.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.userId]
    );
    const user = result.rows[0];

    res.json({
      message: "Acesso autorizado",
      user: user,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

module.exports = router;
