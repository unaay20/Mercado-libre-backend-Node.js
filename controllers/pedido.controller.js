const { pedido, pedidoitem, carrito, carritoitem, producto, direccion, sequelize, usuario } = require('../models');
const { body, validationResult } = require('express-validator');

let self = {};

self.checkoutValidator = [
  body('direccionId').not().isEmpty().isInt(),
];

// GET: api/pedidos -> pedidos del usuario
self.getAll = async function (req, res, next) {
  try {
    const userEmail = req.user.id;

    const user = await usuario.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userId = user.id;    const data = await pedido.findAll({
      where: { usuarioId: userId },
      include: { model: pedidoitem }
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// GET: api/pedidos/:id
self.get = async function (req, res, next) {
  try {
    const userEmail = req.user.id;

    const user = await usuario.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userId = user.id;    const id = req.params.id;
    const data = await pedido.findOne({
      where: { id, usuarioId: userId },
      include: { model: pedidoitem }
    });
    if (!data) return res.status(404).send();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// POST: api/pedidos  -> checkout: crea pedido desde carrito
self.create = async function (req, res, next) {
  const t = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

    const userEmail = req.user.id;

    const user = await usuario.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userId = user.id;    const { direccionId } = req.body;

    const dir = await direccion.findOne({ where: { id: direccionId, usuarioId: userId }});
    if (!dir) {
      await t.rollback();
      return res.status(404).json({ message: 'Dirección no encontrada' });
    }

    const cart = await carrito.findOne({ where: { usuarioId: userId }});
    if (!cart) {
      await t.rollback();
      return res.status(400).json({ message: 'Carrito vacío' });
    }

    const items = await carritoitem.findAll({ where: { carritoId: cart.id }, include: producto });
    if (!items || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'Carrito vacío' });
    }

    let total = 0;
    for (const it of items) {
      const prod = await producto.findByPk(it.productoId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!prod || !prod.activo) {
        await t.rollback();
        return res.status(409).json({ message: `Producto no disponible: ${it.productoId}` });
      }
      if (prod.stock < it.cantidad) {
        await t.rollback();
        return res.status(409).json({ message: `Stock insuficiente para producto ${prod.id}` });
      }
      total += parseFloat(it.precioUnitario) * parseInt(it.cantidad, 10);
    }

    const newOrder = await pedido.create({
      usuarioId: userId,
      direccionId,
      total,
      estado: 'pendiente'
    }, { transaction: t });

    for (const it of items) {
      await pedidoitem.create({
        pedidoId: newOrder.id,
        productoId: it.productoId,
        cantidad: it.cantidad,
        precioUnitario: it.precioUnitario
      }, { transaction: t });

      const prod = await producto.findByPk(it.productoId, { transaction: t, lock: t.LOCK.UPDATE });
      prod.stock = prod.stock - it.cantidad;
      await prod.save({ transaction: t });
    }

    await carritoitem.destroy({ where: { carritoId: cart.id }, transaction: t });

    await t.commit();

    req.bitacora('pedido.crear', newOrder.id);
    res.status(201).json({ pedidoId: newOrder.id, total });
  } catch (error) {
    await t.rollback().catch(()=>{});
    next(error);
  }
};

module.exports = self;
