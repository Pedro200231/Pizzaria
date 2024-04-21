const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const User = require("../models/user");

const router = express.Router();

// Rota de login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Verifique se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Gera um token JWT, incluindo isAdmin
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.isAdmin }, // Adiciona isAdmin ao token
      "tokensupersecretobackend",
      { expiresIn: "1h" }
    );

    // Retorna o token
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});
// Rota de registro
router.post(
  "/register",
  [
    // Validações
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
      // Verifica se o e-mail já existe
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ error: "E-mail já está em uso" });
      }

      // Criptografa a senha antes de salvar
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Cria e salva o novo usuário
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
