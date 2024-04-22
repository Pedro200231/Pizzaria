const express = require("express");
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/auth");
const PizzaAd = require("../models/pizza");
const User = require("../models/user");
const multerConfig = require("../../config/multer"); // Importar a configuração do Multer
const { Sequelize } = require("sequelize");

const router = express.Router();

// Rota para criar um novo anúncio de pizza
router.post(
  "/",
  authMiddleware,
  multerConfig.single("imageUrl"), // Middleware para aceitar um único arquivo chamado "image"
  async (req, res) => {
    const { name, description, ingredients, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Define o caminho do arquivo

    try {
      const newAd = await PizzaAd.create({
        name,
        description,
        ingredients: ingredients ? ingredients.split(",") : null, // Transforma a string em array
        price,
        imageUrl,
        userId: req.user.userId, // Adiciona o ID do usuário autenticado
      });

      return res.status(201).json({ message: "Anúncio criado com sucesso", ad: newAd });
    } catch (error) {
      console.error("Erro ao criar anúncio de pizza:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
);

// Rota para ver todas as pizzas publicadas

// Rota para listar anúncios de pizzas com filtros opcionais
router.get("/", async (req, res) => {
  try {
    const { ingredients, maxPrice } = req.query;

    const query = {
      include: [{ model: User, as: "publisher", attributes: ["name", "email"] }],
      where: {},
    };

    if (ingredients) {
      const ingredientArray = ingredients.split(",").map((item) => item.trim());
      const likeQueries = ingredientArray.map(
        (ingredient) => ({ ingredients: { [Sequelize.Op.like]: `%${ingredient}%` } }) // Usando LIKE para buscar ingredientes
      );
      query.where[Sequelize.Op.and] = likeQueries; // Todos os ingredientes devem estar presentes
    }

    if (maxPrice) {
      query.where.price = { [Sequelize.Op.lte]: parseFloat(maxPrice) }; // Verifica se é menor ou igual ao preço máximo
    }

    const ads = await PizzaAd.findAll(query);

    return res.status(200).json({ message: "Anúncios de pizzas obtidos com sucesso", ads });
  } catch (error) {
    console.error("Erro ao obter anúncios de pizzas:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

module.exports = router;

