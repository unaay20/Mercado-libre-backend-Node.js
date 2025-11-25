const express = require('express');
const router = express.Router();

const pedidoController = require('../controllers/pedido.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET /api/pedidos -> listar pedidos del usuario
router.get('/', Authorize('Usuario,Administrador'), pedidoController.getAll);

// GET /api/pedidos/:id -> detalle de un pedido
router.get('/:id', Authorize('Usuario,Administrador'), pedidoController.get);

// POST /api/pedidos -> crear pedido (checkout)
router.post('/', Authorize('Usuario,Administrador'), pedidoController.checkoutValidator, pedidoController.create);

module.exports = router;