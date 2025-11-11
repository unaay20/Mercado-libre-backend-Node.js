'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carrito extends Model {
    static associate(models) {
      carrito.hasMany(models.carritoitem, { as: 'items', foreignKey: 'carritoId' });
      carrito.belongsTo(models.usuario, { foreignKey: 'usuarioId' });
    }
  }
  carrito.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'carrito',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'creadoEn',
    updatedAt: 'actualizadoEn'
  });
  return carrito;
};
