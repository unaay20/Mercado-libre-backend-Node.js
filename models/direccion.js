'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class direccion extends Model {
    static associate(models) {
      direccion.belongsTo(models.usuario, { foreignKey: 'usuarioId' });
      direccion.hasMany(models.pedido, { foreignKey: 'direccionId' });
    }
  }
  direccion.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    calle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codigoPostal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pais: {
      type: DataTypes.STRING,
      allowNull: true
    },
    creadoEn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'direccion',
    freezeTableName: true,
    timestamps: false
  });
  return direccion;
};
