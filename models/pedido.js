'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pedido extends Model {
    static associate(models) {
      pedido.hasMany(models.pedidoitem, { as: 'items', foreignKey: 'pedidoId' });
      pedido.belongsTo(models.usuario, { foreignKey: 'usuarioId' });
      pedido.belongsTo(models.direccion, { foreignKey: 'direccionId' });
    }
  }
  pedido.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    direccionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pendiente'
    }
  }, {
    sequelize,
    modelName: 'pedido',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'creadoEn',
    updatedAt: 'actualizadoEn'
  });
  return pedido;
};
