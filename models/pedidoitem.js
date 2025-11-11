'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pedidoitem extends Model {
    static associate(models) {
      pedidoitem.belongsTo(models.pedido, { foreignKey: 'pedidoId' });
      pedidoitem.belongsTo(models.producto, { foreignKey: 'productoId' });
    }
  }
  pedidoitem.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    pedidoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    creadoEn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'pedidoitem',
    freezeTableName: true,
    timestamps: false
  });
  return pedidoitem;
};
