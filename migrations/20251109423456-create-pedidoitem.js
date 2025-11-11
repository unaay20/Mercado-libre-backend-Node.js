'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('pedidoitem', {
        id: { 
          type: Sequelize.INTEGER, 
          autoIncrement: true, 
          primaryKey: true 
        },
        pedidoId: { 
          type: Sequelize.INTEGER, 
          allowNull: false 
        },
        productoId: { 
          type: Sequelize.INTEGER, 
          allowNull: false 
        },
        cantidad: { 
          type: Sequelize.INTEGER, 
          allowNull: false 
        },
        precioUnitario: { 
          type: Sequelize.DECIMAL(10,2), 
          allowNull: false 
        },
        creadoEn: { 
          type: Sequelize.DATE, 
          allowNull: false, 
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
        }
      }, { transaction: t });

      await queryInterface.addConstraint('pedidoitem', {
        fields: ['pedidoId'],
        type: 'foreign key',
        name: 'fk_pedidoitem_pedido',
        references: { table: 'pedido', field: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('pedidoitem', {
        fields: ['productoId'],
        type: 'foreign key',
        name: 'fk_pedidoitem_producto',
        references: { table: 'producto', field: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addIndex('pedidoitem', ['pedidoId'], { name: 'idx_pedidoitem_pedido', transaction: t });
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeIndex('pedidoitem', 'idx_pedidoitem_pedido', { transaction: t }).catch(()=>{});
      await queryInterface.removeConstraint('pedidoitem', 'fk_pedidoitem_producto', { transaction: t }).catch(()=>{});
      await queryInterface.removeConstraint('pedidoitem', 'fk_pedidoitem_pedido', { transaction: t }).catch(()=>{});
      await queryInterface.dropTable('pedidoitem', { transaction: t });
    });
  }
};
