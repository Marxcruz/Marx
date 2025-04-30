'use strict';
const usuarios = require('../../Data/usuarios.json');

function generarDatos() {
  const datosUsuarios = usuarios.map(usuario => ({
    usuario: usuario.usuario,
    contraseña: usuario.contraseña,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  return datosUsuarios;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const datos = generarDatos();
    await queryInterface.bulkInsert('Usuarios', datos, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Usuarios', null, {});
  }
};
