const router = require('express').Router()
const usuarios = require('../controllers/usuarios.controller')
const Authorize = require('../middlewares/auth.middleware')

// GET: api/usuarios
router.get('/', Authorize('Usuario,Administrador'), usuarios.getAll)

// GET: api/usuarios/email
router.get('/:email', Authorize('Usuario,Administrador'), usuarios.get)

// POST: api/usuarios
router.post('/', Authorize('Administrador'), usuarios.create)

// PUT: api/usuarios/email
router.put('/:email', Authorize('Administrador'), usuarios.update)

// DELETE: api/usuarios/email
router.delete('/:email', Authorize('Administrador'), usuarios.delete)

module.exports = router