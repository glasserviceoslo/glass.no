import { useForm } from '$hooks/solid/useForm';

interface FormValues {
  name: string;
  email: string;
  message: string;
}

const onSubmit = async (data: FormValues) =>
  await fetch('/.netlify/functions/sendEmail', {
    method: 'POST',
    body: JSON.stringify(data),
  });

const validate = (values: FormValues) => {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  if (!values.name) errors.name = 'Required';
  if (!values.email) errors.email = 'Required';
  if (!values.message) errors.message = 'Required';
  return errors;
};

const initialValues: FormValues = {
  name: '',
  email: '',
  message: '',
};

export const ContactForm = () => {
  const { error, field, handleSubmit, isSubmitting, values } = useForm(onSubmit, initialValues, validate);
  const formattedValues = () => JSON.stringify(values(), undefined, 2);

  return (
    <form class="flex h-96 flex-col items-center justify-center" onSubmit={handleSubmit}>
      <h1>Solid Final Form 🏁</h1>
      <label>
        <input type="text" name="name" placeholder="First Name" use:field />
        <span use:error="name" />
      </label>
      <label>
        <input type="email" name="email" placeholder="Last Name" use:field />
        <span use:error="email" />
      </label>
      <label>
        <textarea name="message" use:field></textarea>
        <span use:error="message" />
      </label>
      <button type="submit" disabled={isSubmitting()}>
        Submit
      </button>
      <pre>{formattedValues()}</pre>
    </form>
  );
};
