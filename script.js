document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const loadingSpinner = document.getElementById('loading-spinner');
  const responseMessage = document.getElementById('response-message');

  const validators = {
    nombre: value =>
      value.trim().length >= 3 ? '' : 'Ingrese un nombre válido (mínimo 3 caracteres)',
    email: value => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? '' : 'Ingrese un correo válido';
    },
    telefono: value => {
      if (value.trim() === '') return '';
      const phoneRegex = /^[0-9()+\- ]{7,15}$/;
      return phoneRegex.test(value) ? '' : 'Número de teléfono inválido';
    },
    mensaje: value =>
      value.trim().length >= 10 ? '' : 'El mensaje debe tener al menos 10 caracteres'
  };

  Object.keys(validators).forEach(fieldName => {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);

    field.addEventListener('blur', function () {
      const error = validators[fieldName](this.value);
      errorElement.textContent = error;
      this.classList.toggle('error', !!error);
    });

    field.addEventListener('input', function () {
      if (this.classList.contains('error')) {
        errorElement.textContent = '';
        this.classList.remove('error');
      }
    });
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    let formValid = true;
    Object.keys(validators).forEach(fieldName => {
      const field = document.getElementById(fieldName);
      const errorElement = document.getElementById(`${fieldName}-error`);
      const error = validators[fieldName](field.value);
      errorElement.textContent = error;
      field.classList.toggle('error', !!error);
      if (error) formValid = false;
    });

    if (!formValid) return;

    loadingSpinner.style.display = 'block';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xwpbrqje', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        responseMessage.textContent = 'Mensaje enviado correctamente. ¡Gracias!';
        responseMessage.className = 'message success';
        form.reset();
      } else {
        responseMessage.textContent = 'Error al enviar el formulario. Intente más tarde.';
        responseMessage.className = 'message error';
      }
    } catch (error) {
      responseMessage.textContent = 'Error inesperado: ' + error.message;
      responseMessage.className = 'message error';
    } finally {
      loadingSpinner.style.display = 'none';
      submitBtn.disabled = false;
      responseMessage.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
