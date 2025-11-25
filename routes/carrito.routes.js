const express = require('express');
const router = express.Router();

const carritoController = require('../controllers/carrito.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET /api/carrito
router.get('/', Authorize('Usuario,Administrador'), carritoController.get);

// POST /api/carrito/items -> agregar item
router.post('/items', Authorize('Usuario,Administrador'), carritoController.itemValidator, carritoController.create);

// PATCH /api/carrito/items/:itemId -> actualizar cantidad
router.patch('/items/:itemId', Authorize('Usuario,Administrador'), carritoController.itemValidator, carritoController.update);

// DELETE /api/carrito/items/:itemId -> eliminar item
router.delete('/items/:itemId', Authorize('Usuario,Administrador'), carritoController.delete);

// DELETE /api/carrito -> vaciar carrito
router.delete('/', Authorize('Usuario,Administrador'), carritoController.clear);

module.exports = router;