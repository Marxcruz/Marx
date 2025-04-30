const { validationResult } = require('express-validator');
let Usuarios;
try {
  Usuarios = require('../database/models/usuarios');
  console.log('Modelo Usuarios cargado correctamente');
} catch (error) {
  console.error('Error al cargar el modelo Usuarios:', error);
}

module.exports = {

  login: (req, res) => {
    res.render('login', {
      title: 'Iniciar Sesión',
    });
  },
  processLogin: async (req, res) => {
    let errors = validationResult(req);
    console.log(req.body);
    if (errors.isEmpty()) {
      const user = req.body.user ? req.body.user.trim() : '';
      try {
        if (!Usuarios) {
          console.error('Modelo Usuarios no está definido');
          return res.render('login', {
            title: 'Iniciar Sesión',
            errors: { general: { msg: 'Error interno: modelo de usuario no disponible' } },
          });
        }
        const foundUser = await Usuarios.findOne({ usuario: user });
        if (foundUser) {
          req.session.userLogin = {
            id: foundUser._id,
            usuario: foundUser.usuario,
          };
          res.cookie('recordarme', req.session.userLogin, {
            maxAge: 1000 * 60,
          });
          return res.redirect('/listado');
        } else {
          return res.render('login', {
            title: 'Iniciar Sesión',
            errors: { user: { msg: 'Usuario no encontrado' } },
          });
        }
      } catch (error) {
        console.error(error);
        return res.render('login', {
          title: 'Iniciar Sesión',
          errors: { general: { msg: 'Error en el servidor' } },
        });
      }
    } else {
      return res.render('login', {
        title: 'Iniciar Sesión',
        errors: errors.mapped(),
      });
    }
  },
};
