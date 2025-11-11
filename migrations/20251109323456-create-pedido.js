'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('pedido', {
        id: { 
          type: Sequelize.INTEGER, 
          autoIncrement: true, 
          primaryKey: true 
        },
        usuarioId: { 
          type: Sequelize.STRING, 
          allowNull: false 
        },
        direccionId: { 
          type: Sequelize.INTEGER, 
          allowNull: false 
        },
        total: { 
          type: Sequelize.DECIMAL(12,2), 
          allowNull: false 
        },
        estado: { 
          type: Sequelize.STRING, 
          allowNull: false, 
          defaultValue: 'pendiente' 
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

      await queryInterface.addIndex('pedido', ['usuarioId'], { name: 'idx_pedido_usuario', transaction: t });
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeIndex('pedido', 'idx_pedido_usuario', { transaction: t }).catch(()=>{});
      await queryInterface.dropTable('pedido', { transaction: t });
    });
  }
};
