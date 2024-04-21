const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body; // Confirme se está recebendo email e senha

  try {
    console.log("Tentativa de login recebida");

    // Verificar se o usuário existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("Usuário não encontrado");
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    console.log("Usuário encontrado:", user);

    // Verifique se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(password);

    if (!isPasswordValid) {
      console.log("Senha incorreta");
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    console.log("Senha correta, gerando token");

    // Gera um token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "tokensupersecretobackend", // Certifique-se de que a chave secreta é consistente
      { expiresIn: "1h" }
    );

    // Retorna o token
    return res.json({ token });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

module.exports = router;
