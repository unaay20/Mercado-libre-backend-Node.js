'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('carritoitem', {
        id: { 
          type: Sequelize.INTEGER, 
          autoIncrement: true, 
          primaryKey: true 
        },
        carritoId: { 
          type: Sequelize.INTEGER, 
          allowNull: false 
        },
        productoId: { 
          type: Sequelize.INTEGER, 
          allowNull: false 
        },
        cantidad: { 
          type: Sequelize.INTEGER, 
          allowNull: false, 
          defaultValue: 1 
        },
        precioUnitario: { 
          type: Sequelize.DECIMAL(10,2), 
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

      await queryInterface.addConstraint('carritoitem', {
        fields: ['carritoId'],
        type: 'foreign key',
        name: 'fk_carritoitem_carrito',
        references: { table: 'carrito', field: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('carritoitem', {
        fields: ['productoId'],
        type: 'foreign key',
        name: 'fk_carritoitem_producto',
        references: { table: 'producto', field: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addIndex('carritoitem', ['carritoId'], { name: 'idx_carritoitem_carrito', transaction: t });
      await queryInterface.addIndex('carritoitem', ['productoId'], { name: 'idx_carritoitem_producto', transaction: t });
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeIndex('carritoitem', 'idx_carritoitem_producto', { transaction: t }).catch(()=>{});
      await queryInterface.removeIndex('carritoitem', 'idx_carritoitem_carrito', { transaction: t }).catch(()=>{});
      await queryInterface.removeConstraint('carritoitem', 'fk_carritoitem_producto', { transaction: t }).catch(()=>{});
      await queryInterface.removeConstraint('carritoitem', 'fk_carritoitem_carrito', { transaction: t }).catch(()=>{});
      await queryInterface.dropTable('carritoitem', { transaction: t });
    });
  }
};
