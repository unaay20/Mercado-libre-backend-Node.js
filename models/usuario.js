'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuario extends Model {
    static associate(models) {
      usuario.belongsTo(models.rol, { foreignKey: 'rolid' });
      usuario.hasOne(models.carrito, { foreignKey: 'usuarioId' });
      usuario.hasMany(models.direccion, { foreignKey: 'usuarioId' });
      usuario.hasMany(models.pedido, { foreignKey: 'usuarioId' });
    }
  }
  usuario.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    passwordhash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    protegido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    rolid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'usuario',
  });
  return usuario;
};