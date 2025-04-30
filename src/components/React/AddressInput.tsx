import { useEffect, useRef } from 'react';
import { useController } from 'react-hook-form';
import { Loader } from '@googlemaps/js-api-loader';

interface AddressFieldProps {
  name: string;
}

export function AddressInput({ name }: AddressFieldProps) {
  const inputRef = useRef(null);
  const { field } = useController({ name });

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_KEY,
      version: 'weekly',
    });

    async function initializeAutocomplete() {
      try {
        await loader.importLibrary('places');

        if (inputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            fields: ['formatted_address', 'geometry', 'name'],
            strictBounds: false,
            types: ['address'],
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place?.formatted_address) {
              field.onChange(place.formatted_address);
            }
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps Autocomplete:', error);
      }
    }

    initializeAutocomplete();
  }, [field]);

  return (
    <input
      type="text"
      id={name}
      className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      ref={inputRef}
      onChange={(e) => {
        field.onChange(e.target.value);
      }}
      placeholder="10B Gatenavn"
    />
  );
}
