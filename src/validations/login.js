const { check } = require('express-validator');
const db = require('../database/models');

module.exports = [
  check('user')
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage('Debe ingresar usuario')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/)
    .withMessage('Credenciales inválidas')
    .custom((value) => {
      return db.Usuarios.findOne({
        where: {
          usuario: value,
        },
      })
        .then((usuario) => {
          if (!usuario) {
            return Promise.reject('Credenciales inválidas');
          }
        })
        .catch(() => Promise.reject('Credenciales inválidas'));
    }),

  check('pass')
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage('Debe ingresar contraseña')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/)
    .withMessage('Credenciales inválidas')
    .custom((value, { req }) => {
      return db.Usuarios.findOne({
        where: {
          usuario: req.body.user,
        },
      })
        .then((usuario) => {
          if (value !== usuario.contraseña) {
            return Promise.reject('Credenciales inválidas');
          }
        })
        .catch(() => Promise.reject('Credenciales inválidas'));
    }),
];
