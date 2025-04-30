const { validationResult } = require('express-validator');
const Usuarios = require('../database/models/usuarios');
const bcrypt = require('bcryptjs');

module.exports = {
  login: (req, res) => {
    res.render('login', {
      title: 'Iniciar Sesión',
    });
  },
  processLogin: async (req, res) => {
    let errors = validationResult(req);
    if (errors.isEmpty()) {
      const { user, pass } = req.body;
      try {
        const foundUser = await Usuarios.findOne({
          usuario: user.trim().toLowerCase()
        });

        if (foundUser && await bcrypt.compare(pass, foundUser.contraseña)) {
          req.session.userLogin = {
            id: foundUser._id,
            usuario: foundUser.usuario,
          };

          if (req.body.recordarme) {
            res.cookie('recordarme', req.session.userLogin, {
              maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semana
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production'
            });
          }

          return res.redirect('/listado');
        } else {
          return res.render('login', {
            title: 'Iniciar Sesión',
            errors: { 
              general: { msg: 'Credenciales inválidas' }
            }
          });
        }
      } catch (error) {
        console.error('Error en login:', error);
        return res.render('login', {
          title: 'Iniciar Sesión',
          errors: { general: { msg: 'Error en el servidor' } }
        });
      }
    } else {
      return res.render('login', {
        title: 'Iniciar Sesión',
        errors: errors.mapped()
      });
    }
  },
  logout: (req, res) => {
    req.session.destroy();
    res.clearCookie('recordarme');
    return res.redirect('/');
  }
};
