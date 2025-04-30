const mongoose = require('mongoose');

const historiasClinicasSchema = new mongoose.Schema({
  hc: {
    type: String,
    required: true,
  },
  ultimoRegistro: {
    type: Date,
    required: true,
  },
  personaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personas',
    required: true,
  },
  cajaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cajas',
    required: true,
  },
  vigente: {
    type: Number,
    default: 1,
  },
});

const HistoriasClinicas = mongoose.model('HistoriasClinicas', historiasClinicasSchema);

module.exports = HistoriasClinicas;
