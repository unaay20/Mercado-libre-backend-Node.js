'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carritoitem extends Model {
    static associate(models) {
      carritoitem.belongsTo(models.carrito, { foreignKey: 'carritoId' });
      carritoitem.belongsTo(models.producto, { foreignKey: 'productoId' });
    }
  }
  carritoitem.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    carritoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'carritoitem',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'creadoEn',
    updatedAt: 'actualizadoEn'
  });
  return carritoitem;
};
