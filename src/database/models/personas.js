const mongoose = require('mongoose');

const personasSchema = new mongoose.Schema({
  dni: {
    type: Number,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
  },
});

const Personas = mongoose.model('Personas', personasSchema);

module.exports = Personas;
