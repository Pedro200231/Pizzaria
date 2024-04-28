const express = require("express");
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/auth");
const PizzaAd = require("../models/pizza");
const User = require("../models/user");
const Comment = require("../models/comment")
const multerConfig = require("../../config/multer");
const { Sequelize } = require("sequelize");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  multerConfig.single("imageUrl"),
  async (req, res) => {
    const { name, description, ingredients, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const newAd = await PizzaAd.create({
        name,
        description,
        ingredients: ingredients ? ingredients.split(",") : null,
        price,
        imageUrl,
        userId: req.user.userId,
      });

      return res.status(201).json({ message: "Anúncio criado com sucesso", ad: newAd });
    } catch (error) {
      console.error("Erro ao criar anúncio de pizza:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
);

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
        (ingredient) => ({ ingredients: { [Sequelize.Op.like]: `%${ingredient}%` } })
      );
      query.where[Sequelize.Op.and] = likeQueries;
    }

    if (maxPrice) {
      query.where.price = { [Sequelize.Op.lte]: parseFloat(maxPrice) };
    }

    const ads = await PizzaAd.findAll(query);

    return res.status(200).json({ message: "Anúncios de pizzas obtidos com sucesso", ads });
  } catch (error) {
    console.error("Erro ao obter anúncios de pizzas:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.post("/:pizzaId/comments", async (req, res) => {
  const { pizzaId } = req.params;
  const { text, userId } = req.body;

  try {
    const pizza = await PizzaAd.findByPk(pizzaId);
    if (!pizza) {
      return res.status(404).json({ error: "Publicação não encontrada." });
    }

    const newComment = await Comment.create({
      text,
      pizzaId,
      userId,
    });

    return res.status(201).json({ message: "Comentário adicionado com sucesso.", comment: newComment });
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});


router.get("/:pizzaId/comments", async (req, res) => {
  const { pizzaId } = req.params;

  try {
    const comments = await Comment.findAll({
      where: { pizzaId },
      include: [{ model: User, attributes: ["name", "email"] }],
    });

    return res.status(200).json({ message: "Comentários obtidos com sucesso.", comments });
  } catch (error) {
    console.error("Erro ao obter comentários:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.post("/:pizzaId/like", async (req, res) => {
  const { pizzaId } = req.params;

  try {
    const pizza = await PizzaAd.findByPk(pizzaId);
    if (!pizza) {
      return res.status(404).json({ error: "Publicação não encontrada." });
    }

    pizza.increment("likeCount"); 
    return res.status(200).json({ message: "Publicação curtida com sucesso." });
  } catch (error) {
    console.error("Erro ao curtir publicação:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});


module.exports = router;

