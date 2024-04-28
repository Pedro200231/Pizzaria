const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/auth"); 
const User = require("../models/user");

const router = express.Router();

router.put(
  "/me",
  authMiddleware, 
  [
    check("name").optional().isLength({ min: 3 }).withMessage("O nome deve ter pelo menos 3 caracteres"),
    check("password")
      .optional()
      .isLength({ min: 6 })
      .matches(/\d/)
      .withMessage("A senha deve ter pelo menos 6 caracteres e incluir um número"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;

    try {
      const user = await User.findByPk(req.user.userId); 
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      if (name) {
        user.name = name;
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10); 
        user.password = hashedPassword;
      }

      await user.save();
      return res.json({ message: "Dados pessoais atualizados com sucesso", user });
    } catch (error) {
      console.error("Erro ao atualizar dados pessoais:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.isAdmin }, 
      "tokensupersecretobackend",
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.post(
  "/register",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("O nome deve ter pelo menos 3 caracteres"),
    check("email")
      .isEmail()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .withMessage("E-mail inválido"),
    check("password")
      .isLength({ min: 6 })
      .matches(/[a-zA-Z]/)
      .matches(/\d/)
      .withMessage("A senha deve ter pelo menos 6 caracteres, incluindo letras e números"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, isAdmin } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ error: "E-mail já está em uso" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({ message: "Usuário criado com sucesso", user: newUser });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
);

module.exports = router;
