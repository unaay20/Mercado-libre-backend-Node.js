const express = require('express');
const router = express.Router();

const direccionController = require('../controllers/direccion.controller');
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

// Protección: usuarios autenticados
router.use(Authorize('Usuario,Administrador'), mapUserFromToken);

// GET /api/direcciones -> listar direcciones del usuario
router.get('/', direccionController.getAll);

// GET /api/direcciones/:id -> obtener una dirección
router.get('/:id', direccionController.get);

// POST /api/direcciones -> crear dirección
router.post('/', direccionController.direccionValidator, direccionController.create);

// PUT /api/direcciones/:id -> actualizar dirección
router.put('/:id', direccionController.direccionValidator, direccionController.update);

// DELETE /api/direcciones/:id -> eliminar dirección
router.delete('/:id', direccionController.delete);

module.exports = router;
