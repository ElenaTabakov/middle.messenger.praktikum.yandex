import './scss/styles.scss';

const googleStyleForm = () => {
  const fields = document.querySelectorAll('.input_wrapper:not(.flex-row) input');

  for (const field of fields) {
      field.addEventListener('blur', (event) => {
          const sel = event.target;
          const parent = sel.parentNode;
          if (sel.value) {
              sel.classList.add('filled__input');
              parent.classList.add('filled');
          } else {
              sel.classList.remove('filled__input');
              parent.classList.remove('filled');
          }
      });
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  let elementExists = document.querySelector('.form__google-style');

  if(elementExists) 
      googleStyleForm();

});