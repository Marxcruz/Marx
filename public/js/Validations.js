let hc = document.getElementById('hc')
let hc2 = document.getElementById('hc2')
let firstname = document.getElementById('firstname')
let lastname = document.getElementById('lastname')
let lastAppointment = document.getElementById('lastAppointment')
let box = document.getElementById('box')
let span = document.getElementById('errores-front')
let boxErrores = document.getElementById('box-errores-front')
let form = document.getElementById('form');
/* Modal */
let modal = document.getElementById('myModal');
let btnModal = document.querySelectorAll('#myBtn');

const validationHC = [
  { validator: value => value.toLowerCase() !== '', message: 'La historia clínica es obligatoria', index: 0 },
  { validator: value => value.length >= 4 && value.length <= 20, message: 'La historia clínica debe tener entre 4 y 20 caracteres', index: 0 },
  { validator: value => /^(?=.*[0-9])/.test(value), message: 'La historia clínica debe contener letras y números', index: 0 }
]
const validationHC2 = [
  { validator: value => value.toLowerCase() !== '', message: 'Debe repetir la historia clínica', index: 5 },
  { validator: value => value.length >= 4 && value.length <= 20, message: 'La historia clínica debe coincidir', index: 5 },
  { validator: value => /^(?=.*[0-9])/.test(value), message: 'La historia clínica debe coincidir', index: 5 },
  { validator: value => hc.value === value, message: 'La historia clínica debe coincidir', index: 5 }
]
const validationFirstName = [
  { validator: value => value.toLowerCase() !== '', message: 'El nombre no debe estar vacío', index: 1 },
  { validator: value => value.length >= 2 && value.length <= 100, message: 'El nombre debe tener entre 2 y 100 caracteres', index: 1 },
  { validator: value => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value), message: 'El nombre solo debe contener letras', index: 1 }
]
const validationLastName = [
  { validator: value => value.toLowerCase() !== '', message: 'El apellido no debe estar vacío', index: 2 },
  { validator: value => value.length >= 2 && value.length <= 100, message: 'El apellido debe tener entre 2 y 100 caracteres', index: 2 },
  { validator: value => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value), message: 'El apellido solo debe contener letras', index: 2 }
]
const validationLastAppointment = [
  { validator: value => value !== '', message: 'La fecha es obligatoria', index: 3 },
  { validator: value => !isNaN(Date.parse(value)), message: 'La fecha debe ser válida', index: 3 }
]
const validationsBox = [
  { validator: value => value.toLowerCase() !== '', message: 'El número de caja es obligatorio', index: 4 },
  { validator: value => value.length >= 1 && value.length <= 20, message: 'La caja debe tener entre 1 y 20 caracteres', index: 4 },
  { validator: value => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/.test(value), message: 'El número de caja solo debe contener letras y números', index: 4 }
]


const validateInput = (element, validations) => {
  let value = element.value.trim();

  for (let i = 0; i < validations.length; i++) {
    const validation = validations[i];
    if (!validation.validator(value)) {
      element.style.border = '1px solid #f04141';
      return validation.message;
    }
  }

  element.style.border = '1px solid #10dc60';
  return '';
};

hc.addEventListener('paste', (e) => {
  e.preventDefault()
})
hc2.addEventListener('paste', (e) => {
  e.preventDefault()
})

hc.addEventListener('input', () => {
  validateInput(hc, validationHC)
})
hc2.addEventListener('input', () => {
  validateInput(hc2, validationHC2)
})
firstname.addEventListener('input', () => {
  validateInput(firstname, validationFirstName)
})
lastname.addEventListener('input', () => {
  validateInput(lastname, validationLastName)
})
lastAppointment.addEventListener('input', () => {
  validateInput(lastAppointment, validationLastAppointment)
})
box.addEventListener('input', () => {
  validateInput(box, validationsBox)
})

form.addEventListener('submit', (event) => {
  event.preventDefault();
  let erroresForm = {};

  const validateForm = (element, validations, index) => {
    let value = element.value.trim();

    for (let i = 0; i < validations.length; i++) {
      const validation = validations[i];
      if (!validation.validator(value)) {
        element.style.border = '1px solid #f04141';
        erroresForm[index] = validation.message;
        boxErrores.style.display = 'block';
        return;
      }
    }

    element.style.border = '1px solid #10dc60';
    delete erroresForm[index];
  };

  validateForm(hc, validationHC, 0);
  validateForm(hc2, validationHC2, 5);
  validateForm(firstname, validationFirstName, 1);
  validateForm(lastname, validationLastName, 2);
  validateForm(lastAppointment, validationLastAppointment, 3);
  validateForm(box, validationsBox, 4);

  const errores = Object.values(erroresForm);
  if (errores.length > 0) {
    span.innerHTML = errores.join('.<br>');
  } else {
    span.innerHTML = '';
    form.submit();
  }

});
btnModal.forEach(function (btn) {
  btn.addEventListener('click', function () {
    modal.style.display = 'none';
  });
});

parceNum = (str) => {
  const numeros = str.match(/\d+/g);
  return numeros ? numeros.join('') : '';
};
hc.addEventListener('blur', () => {
  var ultimosTresNumeros = '';

  let value = hc.value.trim();
  let valueNum = parceNum(value);
  var matches = valueNum.match(/\d{3}$/);

  if (matches !== null) {
    ultimosTresNumeros = matches[0];
  }

  box.value = ultimosTresNumeros;
});

