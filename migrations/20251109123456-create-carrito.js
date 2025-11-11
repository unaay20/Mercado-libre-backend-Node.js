'use strict';
module.exports = {
    async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('carrito', {
        id: { 
            type: Sequelize.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        usuarioId: { 
            type: Sequelize.STRING, 
            allowNull: false 
        },
        creadoEn: { 
            type: Sequelize.DATE, 
            allowNull: false, 
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
        },
        actualizadoEn: { 
            type: Sequelize.DATE, 
            allowNull: false, 
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
        }
      }, { transaction: t });

      await queryInterface.addIndex('carrito', ['usuarioId'], { name: 'idx_carrito_usuario', transaction: t });
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeIndex('carrito', 'idx_carrito_usuario', { transaction: t }).catch(()=>{});
      await queryInterface.dropTable('carrito', { transaction: t });
    });
  }
};
