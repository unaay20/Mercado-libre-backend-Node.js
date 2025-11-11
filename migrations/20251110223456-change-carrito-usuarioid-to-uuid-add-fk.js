'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.changeColumn('carrito', 'usuarioId', {
        type: Sequelize.UUID,
        allowNull: false
      }, { transaction: t });

      await queryInterface.addConstraint('carrito', {
        fields: ['usuarioId'],
        type: 'foreign key',
        name: 'fk_carrito_usuario',
        references: { table: 'usuario', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }, { transaction: t });
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeConstraint('carrito', 'fk_carrito_usuario', { transaction: t }).catch(()=>{});
      await queryInterface.changeColumn('carrito', 'usuarioId', {
        type: Sequelize.STRING,
        allowNull: false
      }, { transaction: t });
    });
  }
};
