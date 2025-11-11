const { direccion } = require('../models');
const { body, validationResult } = require('express-validator');

let self = {};

self.direccionValidator = [
  body('calle').not().isEmpty(),
  body('ciudad').not().isEmpty(),
  body('codigoPostal').not().isEmpty()
];

// GET: api/direcciones
self.getAll = async function (req, res, next) {
  try {
    const userId = req.user.id;
    const data = await direccion.findAll({ where: { usuarioId: userId } });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// GET: api/direcciones/:id
self.get = async function (req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const data = await direccion.findOne({ where: { id, usuarioId: userId }});
    if (!data) return res.status(404).send();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// POST: api/direcciones
self.create = async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

    const userId = req.user.id;
    const body = req.body;
    const data = await direccion.create({ usuarioId: userId, ...body });
    req.bitacora('direccion.crear', data.id);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

// PUT: api/direcciones/:id
self.update = async function (req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const body = req.body;

    const [updated] = await direccion.update(body, { where: { id, usuarioId: userId }});
    if (updated === 0) return res.status(404).send();
    req.bitacora('direccion.editar', id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// DELETE: api/direcciones/:id
self.delete = async function (req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const deleted = await direccion.destroy({ where: { id, usuarioId: userId }});
    if (deleted === 0) return res.status(404).send();
    req.bitacora('direccion.eliminar', id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = self;
