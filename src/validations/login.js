const { check } = require('express-validator');
const Usuarios = require('../database/models/usuarios');
const bcrypt = require('bcryptjs');

module.exports = [
  check('user')
    .trim()
    .notEmpty()
    .withMessage('Debe ingresar usuario')
    .isLength({ min: 3 })
    .withMessage('El usuario debe tener al menos 3 caracteres')
    .custom(async (value) => {
      const usuario = await Usuarios.findOne({
        usuario: value.toLowerCase()
      });
      
      if (!usuario) {
        throw new Error('Credenciales inválidas');
      }
      return true;
    }),

  check('pass')
    .notEmpty()
    .withMessage('Debe ingresar contraseña')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .custom(async (value, { req }) => {
      const usuario = await Usuarios.findOne({
        usuario: req.body.user.toLowerCase()
      });

      if (!usuario || !(await bcrypt.compare(value, usuario.contraseña))) {
        throw new Error('Credenciales inválidas');
      }
      return true;
    }),
];
