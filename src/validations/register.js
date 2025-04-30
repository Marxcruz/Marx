const { check } = require('express-validator');

module.exports = [
  check('usuario')
    .trim()
    .notEmpty()
    .withMessage('El usuario es obligatorio')
    .isLength({ min: 4 })
    .withMessage('El usuario debe tener al menos 4 caracteres'),
  check('contraseña')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  check('confirmarContraseña')
    .custom((value, { req }) => value === req.body.contraseña)
    .withMessage('Las contraseñas no coinciden'),
];
