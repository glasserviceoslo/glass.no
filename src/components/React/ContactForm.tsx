import { waveform } from 'ldrs';
import { useEffect, useState } from 'react';
import { useForm, FormProvider, type FieldValues } from 'react-hook-form';
import { DropzoneField } from './DropzoneField';
import { GoogleMap } from './GoogleMap';
import { AddressInput } from './AddressInput';

waveform.register('l-waveform');
export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm();
  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = form;

  const onSubmit = async (fData: FieldValues) => {
    setIsSubmitting(true);
    const data = new FormData();

    for (const key in fData) {
      if (key === 'field') {
        data.append(key, fData[key][1]);
      } else if (key === 'upload' && Array.isArray(fData[key])) {
        // Handle files correctly - append each file individually with the same key
        fData[key].forEach((file: File, index: number) => {
          data.append(`upload_${index}`, file);
        });

        // Also send the number of files for easier processing
        data.append('upload_count', fData[key].length.toString());
      } else {
        data.append(key, fData[key]);
      }
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        console.error('Form submission failed:', await response.text());
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputPhoneNumber = event.target.value;
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
    <div className="container mx-auto my-24 px-6">
      <section className="mb-32 text-center text-gray-800">
        <div className="px-6 py-12 md:px-12">
          <div className="container mx-auto xl:px-32">
            <div className="grid items-center lg:grid-cols-2">
              <div className="z-10 mb-12 md:mt-12 lg:mb-0 lg:mt-0">
                <div
                  className="block rounded-lg px-6 py-12 shadow-lg md:px-12 lg:-mr-14 "
                  style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)' }}
                >
                  <h2 className="mb-12 text-3xl font-bold">Kontakt Oss</h2>
                  <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                        <AddressInput name="address" />
                      </div>

                      <div className="mb-6">
                        <textarea
                          className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                          id="exampleFormControlTextarea13"
                          rows={3}
                          placeholder="Hva kan vi hjelpe deg med?"
                          {...register('message', { required: true })}
                        />
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
                        <DropzoneField control={control} multiple name="upload" />
                      </div>

                      <button
                        type="submit"
                        className="btn-primary flex w-full items-center justify-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <l-waveform /> : <span>Send</span>}
                      </button>
                    </form>
                  </FormProvider>
                </div>
              </div>
              <div className="md:mb-12 lg:mb-0">
                <GoogleMap />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
