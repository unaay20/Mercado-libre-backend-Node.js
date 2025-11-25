const express = require('express');
const router = express.Router();

const direccionController = require('../controllers/direccion.controller');
const Authorize = require('../middlewares/auth.middleware');

// GET /api/direcciones -> listar direcciones del usuario
router.get('/', Authorize('Usuario,Administrador'), direccionController.getAll);

// GET /api/direcciones/:id -> obtener una dirección
router.get('/:id', Authorize('Usuario,Administrador'), direccionController.get);

// POST /api/direcciones -> crear dirección
router.post('/', Authorize('Usuario,Administrador'), direccionController.direccionValidator, direccionController.create);

// PUT /api/direcciones/:id -> actualizar dirección
router.put('/:id', Authorize('Usuario,Administrador'), direccionController.direccionValidator, direccionController.update);

// DELETE /api/direcciones/:id -> eliminar dirección
router.delete('/:id', Authorize('Usuario,Administrador'), direccionController.delete);

module.exports = router;