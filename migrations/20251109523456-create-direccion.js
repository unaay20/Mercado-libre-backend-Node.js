'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('direccion', {
        id: { 
          type: Sequelize.INTEGER, 
          autoIncrement: true, 
          primaryKey: true 
        },
        usuarioId: { 
          type: Sequelize.STRING, 
          allowNull: false 
        },
        calle: { 
          type: Sequelize.STRING, 
          allowNull: true 
        },
        ciudad: { 
          type: Sequelize.STRING, 
          allowNull: true 
        },
        estado: { 
          type: Sequelize.STRING, 
          allowNull: true 
        },
        codigoPostal: { 
          type: Sequelize.STRING, 
          allowNull: true 
        },
        pais: { 
          type: Sequelize.STRING, 
          allowNull: true 
        },
        creadoEn: { 
          type: Sequelize.DATE, 
          allowNull: false, 
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
        }
      }, { transaction: t });

      await queryInterface.addIndex('direccion', ['usuarioId'], { name: 'idx_direccion_usuario', transaction: t });
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeIndex('direccion', 'idx_direccion_usuario', { transaction: t }).catch(()=>{});
      await queryInterface.dropTable('direccion', { transaction: t });
    });
  }
};
