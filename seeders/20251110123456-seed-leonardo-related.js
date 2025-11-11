'use strict';
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const LeonardoUUID = '00000000-0000-0000-0000-00000000u002';

    await queryInterface.bulkInsert('direccion', [
      {
        usuarioId: LeonardoUUID,
        calle: 'Av. Reforma 123',
        ciudad: 'Xalapa',
        estado: 'Veracruz',
        codigoPostal: '91000',
        pais: 'México',
        creadoEn: new Date()
      }
    ]);

    const dirRows = await queryInterface.sequelize.query(
      `SELECT id FROM direccion WHERE usuarioId = :usuarioId ORDER BY creadoEn DESC LIMIT 1`,
      { replacements: { usuarioId: LeonardoUUID }, type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const direccionId = dirRows.length ? dirRows[0].id : null;

    await queryInterface.bulkInsert('carrito', [
      {
        usuarioId: LeonardoUUID,
        creadoEn: new Date(),
        actualizadoEn: new Date()
      }
    ]);

    const cartRows = await queryInterface.sequelize.query(
      `SELECT id FROM carrito WHERE usuarioId = :usuarioId ORDER BY creadoEn DESC LIMIT 1`,
      { replacements: { usuarioId: LeonardoUUID }, type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const carritoId = cartRows.length ? cartRows[0].id : null;

    if (!carritoId) throw new Error('No se pudo obtener carritoId tras insert. Revisa la tabla carrito.');

    await queryInterface.bulkInsert('carritoitem', [
      { carritoId: carritoId, productoId: 2, cantidad: 1, precioUnitario: 2399.00, creadoEn: new Date(), actualizadoEn: new Date() },
      { carritoId: carritoId, productoId: 5, cantidad: 2, precioUnitario: 1957.00, creadoEn: new Date(), actualizadoEn: new Date() }
    ]);

    const total = (1 * 2399.00) + (2 * 1957.00);
    await queryInterface.bulkInsert('pedido', [
      {
        usuarioId: LeonardoUUID,
        direccionId: direccionId,
        total: total,
        estado: 'confirmado',
        creadoEn: new Date(),
        actualizadoEn: new Date()
      }
    ]);

    const pedidoRows = await queryInterface.sequelize.query(
      `SELECT id FROM pedido WHERE usuarioId = :usuarioId ORDER BY creadoEn DESC LIMIT 1`,
      { replacements: { usuarioId: LeonardoUUID }, type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const pedidoId = pedidoRows.length ? pedidoRows[0].id : null;

    if (!pedidoId) throw new Error('No se pudo obtener pedidoId tras insert. Revisa la tabla pedido.');

    await queryInterface.bulkInsert('pedidoitem', [
      { pedidoId: pedidoId, productoId: 2, cantidad: 1, precioUnitario: 2399.00, creadoEn: new Date() },
      { pedidoId: pedidoId, productoId: 5, cantidad: 2, precioUnitario: 1957.00, creadoEn: new Date() }
    ]);

   
  },

  async down (queryInterface, Sequelize) {
    const LeonardoUUID = '00000000-0000-0000-0000-00000000u002';

    await queryInterface.bulkDelete('pedidoitem', { }, {});
    await queryInterface.bulkDelete('pedido', { usuarioId: LeonardoUUID }, {});
    await queryInterface.bulkDelete('carritoitem', { }, {});
    await queryInterface.bulkDelete('carrito', { usuarioId: LeonardoUUID }, {});
    await queryInterface.bulkDelete('direccion', { usuarioId: LeonardoUUID }, {});
  }
};
