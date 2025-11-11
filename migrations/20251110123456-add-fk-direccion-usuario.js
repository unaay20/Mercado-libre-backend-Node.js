'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.changeColumn('direccion', 'usuarioId', {
        type: Sequelize.UUID,
        allowNull: false
      }, { transaction: t });

      await queryInterface.addConstraint('direccion', {
        fields: ['usuarioId'],
        type: 'foreign key',
        name: 'fk_direccion_usuario',
        references: { table: 'usuario', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }, { transaction: t });
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeConstraint('direccion', 'fk_direccion_usuario', { transaction: t }).catch(()=>{});

      await queryInterface.changeColumn('direccion', 'usuarioId', {
        type: Sequelize.STRING,
        allowNull: false
      }, { transaction: t });
    });
  }
};
