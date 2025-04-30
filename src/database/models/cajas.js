const mongoose = require('mongoose');

const cajasSchema = new mongoose.Schema({
  codigoBarras: {
    type: String,
    required: true,
  },
});

const Cajas = mongoose.model('Cajas', cajasSchema);

module.exports = Cajas;
