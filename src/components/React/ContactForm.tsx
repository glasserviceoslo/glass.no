/** @jsxImportSource react */

import { useForm } from 'react-hook-form';

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);
  console.log(errors);

  return (
    <form className="flex h-96 flex-col items-stretch justify-center gap-2" onSubmit={handleSubmit(onSubmit)}>
      <input
        className="rounded border bg-gray-100 p-2 focus:bg-white"
        type="text"
        placeholder="Navn"
        {...register('name', { required: true })}
      />
      <input
        className="rounded border bg-gray-100 p-2 focus:bg-white"
        type="text"
        placeholder="E-post"
        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
      />
      <input
        className="rounded border bg-gray-100 p-2 focus:bg-white"
        type="tel"
        placeholder="Tel"
        {...register('phone', { required: true, minLength: 6, maxLength: 12 })}
      />
      <textarea
        className="rounded border bg-gray-100 p-2 focus:bg-white"
        name="message"
        placeholder="Hva kan vi hjelpe deg med?"
      ></textarea>
      <button className="btn-primary" type="submit">
        Send
      </button>
    </form>
  );
};
