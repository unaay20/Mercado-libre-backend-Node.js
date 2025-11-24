// controllers/carrito.controller.js
const { carrito, carritoitem, producto, Sequelize } = require("../models");
const { body, validationResult } = require("express-validator");
const { usuario } = require("../models");

let self = {};

self.itemValidator = [
  body("productoId").optional().not().isEmpty(),
  body("cantidad").not().isEmpty().isInt({ min: 1 }),
];

// GET: api/carrito -> obtener carrito del usuario
self.get = async function (req, res, next) {
  try {
    const userEmail = req.user.id;

    const user = await usuario.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const userId = user.id;

    let cart = await carrito.findOne({
      where: { usuarioId: userId },
      include: {
        model: carritoitem,
        as: "items",
        include: { model: producto },
      },
    });

    if (!cart) {
      cart = await carrito.create({ usuarioId: userId });
      return res.status(200).json({ items: [], total: 0 });
    }

    let total = 0;
    if (cart.items) {
      for (const item of cart.items) {
        total += parseFloat(item.precioUnitario) * parseInt(item.cantidad, 10);
      }
    }

    res.status(200).json({
      items: cart.items || [],
      total,
    });
  } catch (error) {
    next(error);
  }
};

// POST: api/carrito/items -> agregar item
self.create = async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

    const userEmail = req.user.id;

    const user = await usuario.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const userId = user.id;

    const { productoId, cantidad } = req.body;

    const prod = await producto.findByPk(productoId);
    if (!prod)
      return res.status(404).json({ message: "Producto no encontrado" });

    let [cart] = await carrito.findOrCreate({
      where: { usuarioId: userId },
      defaults: { usuarioId: userId },
    });

    let item = await carritoitem.findOne({
      where: { carritoId: cart.id, productoId },
    });

    if (item) {
      item.cantidad = parseInt(item.cantidad, 10) + parseInt(cantidad, 10);
      await item.save();
    } else {
      item = await carritoitem.create({
        carritoId: cart.id,
        productoId,
        cantidad,
        precioUnitario: prod.precio,
      });
    }

    req.bitacora("carrito.agregar", `${cart.id}:${productoId}`);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// PATCH: api/carrito/items/:itemId -> actualizar cantidad
self.update = async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

    const userEmail = req.user.id;

    const user = await usuario.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const userId = user.id;
    const itemId = req.params.itemId;
    const { cantidad } = req.body;

    const cart = await carrito.findOne({ where: { usuarioId: userId } });
    if (!cart)
      return res.status(404).json({ message: "Carrito no encontrado" });

    const item = await carritoitem.findOne({
      where: { id: itemId, carritoId: cart.id },
    });
    if (!item) return res.status(404).json({ message: "Item no encontrado" });

    if (cantidad <= 0) {
      await item.destroy();
    } else {
      item.cantidad = cantidad;
      await item.save();
    }

    req.bitacora("carrito.actualizar", itemId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// DELETE: api/carrito/items/:itemId -> eliminar item
self.delete = async function (req, res, next) {
  try {
    const userEmail = req.user.id;

    const user = await usuario.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userId = user.id;
    const itemId = req.params.itemId;


    const cart = await carrito.findOne({ where: { usuarioId: userId } });
    if (!cart)
      return res.status(404).json({ message: "Carrito no encontrado" });

    const deleted = await carritoitem.destroy({
      where: { id: itemId, carritoId: cart.id },
    });

    if (deleted === 0)
      return res.status(404).json({ message: "Item no encontrado" });

    req.bitacora("carrito.eliminar", itemId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// DELETE: api/carrito -> vaciar carrito
self.clear = async function (req, res, next) {
  try {
    const userEmail = req.user.id;

    const user = await usuario.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userId = user.id;
    const cart = await carrito.findOne({ where: { usuarioId: userId } });

    if (!cart)
      return res.status(404).json({ message: "Carrito no encontrado" });

    await carritoitem.destroy({ where: { carritoId: cart.id } });

    req.bitacora("carrito.vaciar", cart.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = self;
