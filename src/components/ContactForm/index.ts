import { createForm } from 'final-form';

const onSubmit = (values: any) => console.table(values);

const form = createForm({
  onSubmit,
  validate: (values) => {
    const errors = {} as any;
    if (!values.name) {
      errors.name = 'Required';
    }
    if (!values.email) {
      errors.email = 'Required';
    }
    if (values.message === '#00FF00') {
      errors.message = 'Gross! Not green! 🤮';
    }
    return errors;
  },
});

document.getElementById('form')!.addEventListener('submit', (event) => {
  event.preventDefault();
  form.submit();
});
// document.getElementById('reset')!.addEventListener('click', () => form.reset());

const registered = {};

function registerField(input: any) {
  const { name } = input;
  form.registerField(
    name,
    (fieldState) => {
      const { blur, change, error, focus, touched, value } = fieldState;
      const errorElement = document.getElementById(name + '_error');
      // @ts-ignore
      if (!registered[name]) {
        // first time, register event listeners
        input.addEventListener('blur', () => blur());
        input.addEventListener('input', (event: any) =>
          change(input.type === 'checkbox' ? event.target.checked : event.target.value),
        );
        input.addEventListener('focus', () => focus());
        // @ts-ignore
        registered[name] = true;
      }

      // show/hide errors
      if (errorElement) {
        if (touched && error) {
          errorElement.innerHTML = error;
          errorElement.style.display = 'block';
        } else {
          errorElement.innerHTML = '';
          errorElement.style.display = 'none';
        }
      }
    },
    {
      value: true,
      error: true,
      touched: true,
    },
  );
}

[...document.forms[0]].forEach((input) => {
  // @ts-ignore
  if (input.name) {
    registerField(input);
  }
});
