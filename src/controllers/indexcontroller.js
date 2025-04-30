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

      let query = {
        hc: { $regex: search.value, $options: 'i' },
        vigente: { $ne: 0 },
      };

      const count = await HistoriasClinicas.countDocuments(query);
      const rows = await HistoriasClinicas.find(query)
        .skip(parseInt(start))
        .limit(parseInt(length))
        .sort({ _id: -1 })
        .populate('personaId')
        .populate('cajaId');

      const data = {
        draw: draw,
        iTotalDisplayRecords: count,
        iTotalRecords: count,
        data: rows,
      };
      return res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener datos de la base');
    }
  },
  listado: async (req, res) => {
    res.render('listado', {
      title: 'Listado',
      capitalizeLetter,
      parceNum,
      parceDate,
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
