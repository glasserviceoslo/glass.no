import { createForm } from 'final-form';

const sendMail = async (data: any) =>
  (
    await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  ).json();

export const ContactForm = () => {
  const form = createForm({
    onSubmit: (values, form) => {
      // sendMail(values);
      console.log(values, form);
    },
    // validate: (values: any) => {
    //   const errors = {} as any;
    //   if (!values.name) {
    //     errors.name = 'Required';
    //   }
    //   if (!values.email) {
    //     errors.email = 'Required';
    //   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    //     errors.email = 'Invalid email address';
    //   }
    //   if (!values.message) {
    //     errors.message = 'Required';
    //   }
    //   return errors;
    // },
  });

  return (
    <section class="flex h-96 items-center justify-center">
      <form onSubmit={form.submit}>
        <label for="name">
          Name:
          <input id="name" type="text" name="name" class="rounded border p-2" />
        </label>
        <button type="submit">Submit</button>
      </form>
    </section>
  );
};
