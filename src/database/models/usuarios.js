const mongoose = require('mongoose');

const usuariosSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
  },
  contraseña: {
    type: String,
    required: true,
  },
});

const Usuarios = mongoose.model('Usuarios', usuariosSchema);

module.exports = Usuarios;
