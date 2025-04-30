const { check } = require('express-validator');

module.exports = [
  check('hc')
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage('La historia clinica es obligatoria')
    .bail()
    .isLength({ min: 4, max: 20 })
    .withMessage('La historia clinica debe tener entre 4 y 20 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/)
    .withMessage('La historia clinica solo debe contener letras y números'),
  check('hc2').custom((value, { req }) => {
    const hc = req.body.hc.trim().toLowerCase();
    const hc2 = value.trim().toLowerCase();

    if (hc !== hc2) {
      throw new Error('La historia clínica no coincide');
    }

    return true;
  }),
  check('firstname')
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage('El nombre no debe estar vacio')
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo debe contener letras'),
  check('lastname')
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage('El apellido no debe estar vacio')
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo debe contener letras'),
  check('lastAppointment')
    .notEmpty()
    .withMessage('La fecha es obligatoria')
    .bail()
    .isDate()
    .withMessage('La fecha debe ser valida'),
  check('box')
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage('El numero de caja es obligatorio')
    .bail()
    .isLength({ min: 1, max: 20 })
    .withMessage('La caja debe tener entre 2 y 20 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/)
    .withMessage('El numero de caja solo debe contener letras y números'),
];
