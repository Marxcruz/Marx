const { validationResult } = require('express-validator');
const Usuarios = require('../database/models/usuarios');
const bcrypt = require('bcrypt');

module.exports = {
  showRegisterForm: (req, res) => {
    res.render('register', {
      title: 'Registro de Usuario',
      errors: {},
      oldData: {},
    });
  },

  processRegister: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('register', {
        title: 'Registro de Usuario',
        errors: errors.mapped(),
        oldData: req.body,
      });
    }

    try {
      const { usuario, contraseña } = req.body;
      const existingUser = await Usuarios.findOne({ usuario: usuario.trim() });
      if (existingUser) {
        return res.render('register', {
          title: 'Registro de Usuario',
          errors: { usuario: { msg: 'El usuario ya existe' } },
          oldData: req.body,
        });
      }

      const hashedPassword = await bcrypt.hash(contraseña, 10);

      const newUser = new Usuarios({
        usuario: usuario.trim(),
        contraseña: hashedPassword,
      });

      await newUser.save();

      return res.redirect('/login');
    } catch (error) {
      console.error(error);
      return res.render('register', {
        title: 'Registro de Usuario',
        errors: { general: { msg: 'Error en el servidor' } },
        oldData: req.body,
      });
    }
  },
};
