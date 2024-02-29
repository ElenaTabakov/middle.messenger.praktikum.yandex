import './scss/styles.scss';
import { error } from './pages/Error';

const googleStyleForm = () : void => {
  // eslint-disable-next-line max-len
  const fields : NodeListOf<HTMLInputElement> = document.querySelectorAll('.input_wrapper:not(.flex-row) input');

  fields.forEach((field : HTMLInputElement) => {
    field.addEventListener('blur', (event: FocusEvent) => {
      const sel = event.target as HTMLInputElement;
      const parent = sel.parentNode as HTMLElement | undefined;
      if (sel.value) {
        sel.classList.add('filled__input');
        parent?.classList.add('filled');
      } else {
        sel.classList.remove('filled__input');
        parent?.classList.remove('filled');
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const elementExists = document.querySelector('.form__google-style');

  if (elementExists) { googleStyleForm(); }
});

                     