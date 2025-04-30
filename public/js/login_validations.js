let user = document.getElementById('user')
let pass = document.getElementById('pass')
let form = document.getElementById('form')
let span = document.getElementById('errores-front')
let boxErrores = document.getElementById('box-errores-front')


const userValidation = [
    { validator: value => value.toLowerCase() !== '', message: 'Debe ingresar usuario', index: 0 },
    { validator: value => value.length >= 4 && value.length <= 20, message: 'Credenciales inválidas', index: 1 },
    { validator: value => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/.test(value), message: 'Credenciales inválidas', index: 2 }
]
const passValidation = [
    { validator: value => value.toLowerCase() !== '', message: 'Debe ingresar contraseña', index: 0 },
    { validator: value => value.length >= 2 && value.length <= 100, message: 'Credenciales inválidas', index: 1 },
    { validator: value => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/.test(value), message: 'Credenciales inválidas', index: 2 }
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

user.addEventListener('input', () => {
    validateInput(user, userValidation)
})
pass.addEventListener('input', () => {
    validateInput(pass, passValidation)
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
          boxErrores.style.textAlign = 'center';
          return;
        }
      }
  
      element.style.border = '1px solid #10dc60';
      delete erroresForm[index];
    };
  
    validateForm(user, userValidation, 0);
    validateForm(pass, passValidation, 1);
  
    const errores = Object.values(erroresForm);
    if (errores.length > 0) {
      span.innerHTML = errores.join('.<br>');
    } else {
      span.innerHTML = '';
      form.submit();
    }
  });