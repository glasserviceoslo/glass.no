import { useForm } from '$hooks/solid/useForm';

interface FormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const onSubmit = async (data: FormValues) => {
  const response = await fetch('/.netlify/functions/sendEmail', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response;
};

const validate = (values: FormValues) => {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  if (!values.name) errors.name = 'Må fylles';
  if (!values.email) errors.email = 'Må fylles';
  if (!values.message) errors.message = 'Må fylles';
  return errors;
};

const initialValues: FormValues = {
  name: '',
  email: '',
  phone: '',
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
            required
            class="rounded border bg-gray-100 p-1 focus:bg-white"
            type="text"
            name="name"
            placeholder="Navn"
            use:field
          />
          <span class="italic text-red-500" use:error="name" />
        </label>
        <label class="flex flex-col">
          <input
            required
            class="rounded border bg-gray-100 p-1 focus:bg-white"
            type="email"
            name="email"
            placeholder="E-post"
            use:field
          />
          <span class="italic text-red-500" use:error="email" />
        </label>
        <label class="flex flex-col">
          <input
            class="rounded border bg-gray-100 p-1 focus:bg-white"
            type="phone"
            name="phone"
            placeholder="Tel"
            use:field
          />
          <span class="italic text-red-500" />
        </label>
        <label class="flex flex-col">
          <textarea
            class="rounded border bg-gray-100 p-1 focus:bg-white"
            name="message"
            placeholder="Hva kan vi hjelpe deg med?"
            use:field
          ></textarea>
          <span class="italic text-red-500" use:error="message" />
        </label>
        <button class="btn-primary" type="submit" disabled={isSubmitting()}>
          Send
        </button>
      </form>
    </section>
  );
};
