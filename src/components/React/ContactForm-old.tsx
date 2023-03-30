import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export const ContactForm = () => {
  const [formData, setFormData] = useState();
  const {
    register,
    reset,
    handleSubmit,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm();
  const onSubmit = async (data: unknown) =>
    await fetch(import.meta.env.PUBLIC_EMAIL_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
    });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  return (
    <form className="flex h-96 flex-col items-stretch justify-center gap-2" onSubmit={handleSubmit(onSubmit)}>
      <input
        className="rounded border bg-gray-100 p-2 placeholder:italic placeholder:opacity-50 focus:bg-white"
        type="text"
        placeholder="John Doe"
        {...register('name', { required: true })}
      />
      <input
        className="rounded border bg-gray-100 p-2 placeholder:italic placeholder:opacity-50 focus:bg-white"
        type="text"
        placeholder="john@example.com"
        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
      />
      <input
        className="rounded border bg-gray-100 p-2 placeholder:italic placeholder:opacity-50 focus:bg-white"
        type="tel"
        placeholder="999 99 999"
        {...register('phone', { required: true, minLength: 8, maxLength: 8 })}
      />
      <textarea
        className="rounded border bg-gray-100 p-2 placeholder:italic placeholder:opacity-50 focus:bg-white"
        placeholder="Hva kan vi hjelpe deg med?"
        {...register('message', { required: true })}
      ></textarea>
      <button className="btn-primary" type="submit">
        Send
      </button>
    </form>
  );
};
