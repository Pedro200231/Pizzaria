const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Rota para criar um novo usuário
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await User.create({ name, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar usuário", error });
  }
});

// Rota para listar todos os usuários (apenas para administradores)
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: "Erro ao obter usuários", error });
  }
});

module.exports = router;
