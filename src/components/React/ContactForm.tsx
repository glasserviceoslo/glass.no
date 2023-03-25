/** @jsxImportSource react */

import { useLoadScript } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DropzoneInput } from './DropzoneInput';
import { GoogleMap } from './GoogleMap';

export const ContactForm = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBueuA7a3QmqA56-iLuLGF1GNwi4zAP8iw',
  });

  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const onSubmit = async (data: unknown) =>
    await fetch(import.meta.env.PUBLIC_EMAIL_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
    });

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputPhoneNumber = event.target.value;
    // Remove all non-numeric characters from the input phone number
    const numericPhoneNumber = inputPhoneNumber.replace(/\D/g, '');
    let formattedPhoneNumber = '';
    // Add spaces to the input phone number after every two digits
    for (let i = 0; i < numericPhoneNumber.length; i++) {
      if (i === 3 || i === 5) {
        formattedPhoneNumber += ' ';
      }
      formattedPhoneNumber += numericPhoneNumber.charAt(i);
    }
    setValue('phone', formattedPhoneNumber);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  return (
    <div className="container my-24 mx-auto px-6">
      <section className="mb-32 text-center text-gray-800">
        <div className="px-6 py-12 md:px-12">
          <div className="container mx-auto xl:px-32">
            <div className="grid items-center lg:grid-cols-2">
              <div className="mb-12 md:mt-12 lg:mt-0 lg:mb-0">
                <div
                  className="block rounded-lg px-6 py-12 shadow-lg md:px-12 lg:-mr-14"
                  style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)' }}
                >
                  <h2 className="mb-12 text-3xl font-bold">Kontakt Oss</h2>
                  <form onSubmit={handleSubmit(onSubmit)} action="/target" className="dropzone">
                    <div className="mb-6">
                      <input
                        type="text"
                        className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                        placeholder="John Doe"
                        {...register('name', { required: true })}
                      />
                    </div>
                    <div className="mb-6">
                      <input
                        type="email"
                        className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                        placeholder="john@example.com"
                        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                      />
                    </div>
                    <div className="mb-6">
                      <input
                        className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                        type="tel"
                        placeholder="999 99 999"
                        maxLength={10}
                        {...register('phone', {
                          required: true,
                          onChange: handlePhoneNumberChange,
                          maxLength: 10,
                          minLength: 10,
                        })}
                      />
                    </div>
                    <div className="mb-6">
                      <textarea
                        className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                        id="exampleFormControlTextarea13"
                        rows={3}
                        placeholder="Hva kan vi hjelpe deg med?"
                        {...register('message', { required: true })}
                      ></textarea>
                    </div>
                    {/* <div className="form-check mb-6 text-center">
                      <input
                        type="checkbox"
                        className="form-check-input mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none"
                        id="exampleCheck87"
                        // checked
                      />
                      <label className="form-check-label inline-block text-gray-800" htmlFor="exampleCheck87">
                        Send me a copy of this message
                      </label>
                    </div> */}

                    <div className="mb-6">
                      <DropzoneInput />
                    </div>

                    <button type="submit" className="btn-primary w-full">
                      Send
                    </button>
                  </form>
                </div>
              </div>
              <div className="md:mb-12 lg:mb-0">{isLoaded && <GoogleMap />}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
