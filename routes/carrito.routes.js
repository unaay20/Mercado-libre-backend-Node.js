const express = require('express');
const router = express.Router();

const carritoController = require('../controllers/carrito.controller');
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

// Rutas protegidas: usuario autenticado (ajusta roles si es necesario)
router.use(Authorize('Usuario,Administrador'), mapUserFromToken);

// GET /api/carrito
router.get('/', carritoController.get);

// POST /api/carrito/items -> agregar item
router.post('/items', carritoController.itemValidator, carritoController.create);

// PATCH /api/carrito/items/:itemId -> actualizar cantidad
router.patch('/items/:itemId', carritoController.itemValidator, carritoController.update);

// DELETE /api/carrito/items/:itemId -> eliminar item
router.delete('/items/:itemId', carritoController.delete);

// DELETE /api/carrito -> vaciar carrito
router.delete('/', carritoController.clear);

module.exports = router;
