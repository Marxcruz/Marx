module.exports = function parceDate(fechaString) {
  const date = new Date(fechaString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`;
};

/* parceDate('Thu Feb 06 1997 21:00:00 GMT-0300 (hora estándar de Argentina)') */
