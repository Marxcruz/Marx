const { validationResult } = require('express-validator');
const HistoriasClinicas = require('../database/models/historiasclinicas');
const Cajas = require('../database/models/cajas');
const Personas = require('../database/models/personas');
const capitalizeLetter = require('../utils/capitalizeLetter');
const parceNum = require('../utils/parceNum');
const parceDate = require('../utils/parceDate');

module.exports = {
  index: (req, res) => {
    const errors = validationResult(req);
    res.render('index', {
      title: 'Archivo',
      errors,
      recordCreated: false,
      valuesErrors: '',
    });
  },
  addHc: async (req, res) => {
    const errors = validationResult(req);
    const { hc, firstname, lastAppointment, lastname, box } = req.body;
    const lastAppointmentDate = new Date(lastAppointment);
    if (errors.isEmpty()) {
      try {
        // Crear caja
        const boxDataBase = new Cajas({
          codigoBarras: box.trim(),
        });
        await boxDataBase.save();
        const boxId = boxDataBase._id;

        // Crear persona
        const person = new Personas({
          nombre: firstname.trim(),
          apellido: lastname.trim(),
          dni: parceNum(hc),
        });
        await person.save();
        const personId = person._id;

        // Crear historia clinica
        const historia = new HistoriasClinicas({
          hc: hc.trim(),
          ultimoRegistro: lastAppointmentDate,
          personaId: personId,
          cajaId: boxId,
          vigente: 1,
        });
        await historia.save();

        return res.render('index', {
          title: 'Archivo',
          errors: errors.mapped(),
          req: req.body,
          recordCreated: true,
        });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .send('Error al crear los registros en la base de datos');
      }
    } else {
      console.error(errors);
      return res.render('index', {
        title: 'Archivo',
        errors: errors.mapped(),
        req: req.body,
        recordCreated: false,
      });
    }
  },
  historias: async (req, res) => {
    try {
      let { draw, length, start, search } = req.query;
      length = parseInt(length) || 10;
      start = parseInt(start) || 0;

      let query = { vigente: { $ne: 0 } };
      
      if (search && search.value) {
        query.$or = [
          { hc: { $regex: search.value, $options: 'i' } }
        ];
      }

      const total = await HistoriasClinicas.countDocuments({ vigente: { $ne: 0 } });
      const filtered = await HistoriasClinicas.countDocuments(query);
      
      const historias = await HistoriasClinicas.find(query)
        .skip(start)
        .limit(length)
        .sort({ _id: -1 })
        .populate('personaId')
        .populate('cajaId');

      const data = historias.map(historia => ({
        id: historia._id,
        hc: historia.hc,
        ultimoRegistro: historia.ultimoRegistro,
        persona: {
          nombre: historia.personaId.nombre,
          apellido: historia.personaId.apellido
        }
      }));

      return res.json({
        draw: parseInt(draw),
        recordsTotal: total,
        recordsFiltered: filtered,
        data: data
      });
    } catch (error) {
      console.error('Error en historias:', error);
      return res.status(500).json({
        error: 'Error al obtener datos de la base',
        details: error.message
      });
    }
  },
  listado: (req, res) => {
    res.render('listado', {
      title: 'Listado de Historias'
    });
  },
  paciente: async (req, res) => {
    try {
      const errors = validationResult(req);
      const pacient = await HistoriasClinicas.findById(req.params.id)
        .populate('personaId')
        .populate('cajaId');
      if (!pacient || pacient.vigente === 0) {
        res.redirect('/listado');
      } else {
        res.render('paciente', {
          title: 'Paciente',
          errors,
          historia: pacient,
          capitalizeLetter,
          parceNum,
          parceDate,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
  destroy: async (req, res) => {
    try {
      await HistoriasClinicas.findByIdAndUpdate(req.params.id, { vigente: 0 });
      res.redirect('/listado');
    } catch (error) {
      console.error(error);
    }
  },
  logout: (req, res) => {
    req.session.destroy();
    res.cookie('recordarme', null, { MaxAge: -1 });
    res.redirect('/');
  },
  edit: async (req, res) => {
    try {
      const errors = validationResult(req);
      const pacient = await HistoriasClinicas.findById(req.params.id)
        .populate('personaId')
        .populate('cajaId');
      if (!pacient || pacient.vigente === 0) {
        res.redirect('/listado');
      } else {
        res.render('edit', {
          title: 'Editar',
          errors,
          historia: pacient,
          capitalizeLetter,
          parceNum,
          parceDate,
          recordCreated: false,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
  processEdit: async (req, res) => {
    const { hc, firstname, lastname, lastAppointment, box } = req.body;
    const lastAppointmentDate = new Date(lastAppointment);
    try {
      await HistoriasClinicas.findByIdAndUpdate(req.params.id, {
        hc: hc.trim(),
        ultimoRegistro: lastAppointmentDate.setDate(lastAppointmentDate.getDate() + 1),
      });
      await Cajas.findByIdAndUpdate(req.params.id, {
        codigoBarras: box.trim(),
      });
      await Personas.findByIdAndUpdate(req.params.id, {
        nombre: firstname.trim(),
        apellido: lastname.trim(),
      });
      res.redirect('/hc/' + req.params.id);
    } catch (error) {
      console.error(error);
    }
  },
};
