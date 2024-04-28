const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); 
const authMiddleware = require("../middlewares/auth"); 
const adminMiddleware = require("../middlewares/admin");

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter usuários", error });
  }
});

router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, [
  check("name").optional().isLength({ min: 3 }).withMessage("O nome deve ter pelo menos 3 caracteres"),
  check("email").optional().isEmail().withMessage("E-mail inválido"),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .matches(/[a-zA-Z]/)
    .matches(/\d/)
    .withMessage("A senha deve ter pelo menos 6 caracteres, incluindo letras e números"),
], async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    if (name) user.name = name;
    if (email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({ error: "E-mail já está em uso." });
      }
      user.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword; 
    }

    await user.save();
    return res.json({ message: "Usuário atualizado com sucesso", user });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    await user.destroy();
    return res.json({ message: "Usuário excluído com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

module.exports = router;
