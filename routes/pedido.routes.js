const express = require('express');
const router = express.Router();

const pedidoController = require('../controllers/pedido.controller');
const Authorize = require('../middlewares/auth.middleware');
const ClaimTypes = require('../config/claimtypes');

function mapUserFromToken(req, res, next) {
  if (!req.decodedToken) return res.status(401).send();
  req.user = {
    id: req.decodedToken.sub || req.decodedToken[ClaimTypes.Name] || req.decodedToken.id,
    email: req.decodedToken[ClaimTypes.Name] || null
  };
  next();
}

// Protección: solo usuarios autenticados
router.use(Authorize('Usuario,Administrador'), mapUserFromToken);

// GET /api/pedidos -> listar pedidos del usuario
router.get('/', pedidoController.getAll);

// GET /api/pedidos/:id -> detalle de un pedido
router.get('/:id', pedidoController.get);

// POST /api/pedidos -> crear pedido (checkout)
router.post('/', pedidoController.checkoutValidator, pedidoController.create);

module.exports = router;
