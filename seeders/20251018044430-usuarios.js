'use strict';
const bcrypt = require('bcrypt');
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const AdministradorUUID = '00000000-0000-0000-0000-00000000a001';
    const UsuarioUUID = '00000000-0000-0000-0000-00000000u001';
    const LeonardoUUID = '00000000-0000-0000-0000-00000000u002';

    await queryInterface.bulkInsert('rol', [
      { id: AdministradorUUID, nombre: 'Administrador', createdAt: new Date(), updatedAt: new Date()},
      { id: UsuarioUUID, nombre: 'Usuario', createdAt: new Date(), updatedAt: new Date() }
    ]);

    await queryInterface.bulkInsert('usuario', [
      {
        id: crypto.randomUUID(),
        email: 'unaay@uv.mx',
        passwordhash: await bcrypt.hash('geminiJaime2', 10),
        nombre: 'Admin U Náay',
        rolid: AdministradorUUID,
        protegido: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: LeonardoUUID,
        email: 'leo@uv.mx',
        passwordhash: await bcrypt.hash('geminiJaime1', 10),
        nombre: 'Leonardo Martinez',
        rolid: UsuarioUUID,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuario', { email: ['unaay@uv.mx', 'leo@uv.mx'] }, {});
    await queryInterface.bulkDelete('rol', { nombre: ['Administrador', 'Usuario'] }, {});
  }
};
