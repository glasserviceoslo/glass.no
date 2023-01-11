import { useForm } from '$hooks/solid/useForm';

interface FormValues {
  name: string;
  email: string;
  message: string;
}

const onSubmit = async (data: FormValues) => {
  const response = await fetch('/.netlify/functions/sendEmail', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  console.log(response);
  return response;
};

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

  return (
    <section class="flex h-[calc(100vh-298px)] items-center justify-center">
      <form class="flex h-96 flex-col items-stretch justify-center gap-2" onSubmit={handleSubmit}>
        <h1>Kontaktskjema</h1>
        <label class="flex flex-col">
          <input
            class="rounded border bg-gray-100 p-1 focus:bg-white"
            type="text"
            name="name"
            placeholder="First Name"
            use:field
          />
          <span class="text-red-500" use:error="name" />
        </label>
        <label class="flex flex-col">
          <input
            class="rounded border bg-gray-100 p-1 focus:bg-white"
            type="email"
            name="email"
            placeholder="Last Name"
            use:field
          />
          <span class="text-red-500" use:error="email" />
        </label>
        <label class="flex flex-col">
          <textarea class="rounded border bg-gray-100 p-1 focus:bg-white" name="message" use:field></textarea>
          <span class="text-red-500" use:error="message" />
        </label>
        <button class="btn-primary" type="submit" disabled={isSubmitting()}>
          Submit
        </button>
      </form>
    </section>
  );
};
