import { useEffect, useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import { Loader } from '@googlemaps/js-api-loader';
import { useGoogleMaps } from '../../hooks/react/useGoogleMaps';

interface AddressFieldProps {
  name: string;
}

export function AddressInput({ name }: AddressFieldProps) {
  const inputRef = useRef(null);
  const { field } = useController({ name });
  const googleMaps = useGoogleMaps();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const options = {
      fields: ['formatted_address', 'geometry', 'name'],
      strictBounds: false,
      types: ['address'],
    };

    if (googleMaps && inputRef && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, options);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          field.onChange(place.formatted_address);
        }
      });
    }
  }, [googleMaps]);

  return (
    <input
      type="text"
      id={name}
      className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
      ref={inputRef}
      onChange={(e) => {
        field.onChange(e.target.value);
      }}
      placeholder="10B Gatenavn"
    />
  );
}
