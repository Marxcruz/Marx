module.exports = {
    error: (req, res) => {
      if (res.status(404)) {
        res.render('index', {
          message: 'Pagina no encontrada',
        });
      }
    },

}