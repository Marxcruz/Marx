module.exports = capitalizeLetter = (str) => {
  const palabras = str.split(' ');
  const resultado = palabras.map((palabra) => {
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
  });
  return resultado.join(' ');
};
