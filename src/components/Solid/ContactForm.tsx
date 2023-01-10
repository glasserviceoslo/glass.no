import { useForm } from '$hooks/solid/useForm';

interface FormValues {
  firstName: string;
  lastName: string;
  favoriteColor?: string;
}

const onSubmit = async (data: any) =>
  (
    await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  ).json();

const validate = (values: FormValues) => {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  if (!values.firstName) errors.firstName = 'Required';
  if (!values.lastName) errors.lastName = 'Required';
  return errors;
};

const initialValues: FormValues = {
  firstName: '',
  lastName: '',
  favoriteColor: '',
};

export const ContactForm = () => {
  const { error, field, handleSubmit, isSubmitting, values } = useForm(onSubmit, initialValues, validate);
  const formattedValues = () => JSON.stringify(values(), undefined, 2);

  // const form = createForm({
  //   onSubmit: (values, form) => {
  //     // sendMail(values);
  //     console.log(values, form);
  //   },
  //   // validate: (values: any) => {
  //   //   const errors = {} as any;
  //   //   if (!values.name) {
  //   //     errors.name = 'Required';
  //   //   }
  //   //   if (!values.email) {
  //   //     errors.email = 'Required';
  //   //   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
  //   //     errors.email = 'Invalid email address';
  //   //   }
  //   //   if (!values.message) {
  //   //     errors.message = 'Required';
  //   //   }
  //   //   return errors;
  //   // },
  // });

  return (
    <form class="flex h-96 flex-col items-center justify-center" onSubmit={handleSubmit}>
      <h1>Solid Final Form 🏁</h1>
      <label>
        <input name="firstName" placeholder="First Name" use:field />
        <span use:error="firstName" />
      </label>
      <label>
        <input name="lastName" placeholder="Last Name" use:field />
        <span use:error="lastName" />
      </label>
      <label>
        <select name="favoriteColor" use:field>
          <option value="">Choose a color</option>
          <option value="#FF0000">Red</option>
          <option value="#00FF00">Green</option>
          <option value="#0000FF">Blue</option>
        </select>
        <span use:error="favoriteColor" />
      </label>
      <button type="submit" disabled={isSubmitting()}>
        Submit
      </button>
      <pre>{formattedValues()}</pre>
    </form>
  );
};
