/** @jsxImportSource react */

import { useEffect, useRef, useState } from 'react';
import { Controller, Field, useController, type Control, type FieldValues } from 'react-hook-form';
import { Loader } from '@googlemaps/js-api-loader';

interface AddressFieldProps {
  name: string;
  control: Control<FieldValues>;
}

export function AddressInput({ control, name }: AddressFieldProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef(null);
  const { field } = useController({ name });

  function handleSelect(address: string) {
    field.onChange(address);
  }

  useEffect(() => {
    const options = {
      // Define your Google Maps API key here
      // (replace YOUR_API_KEY with your actual API key)
      apiKey: 'YOUR_API_KEY',
      // Restrict results to a specific country (optional)
      // componentRestrictions: { country: "us" },
      // Include only places of type 'address' (optional)
      // types: ['address'],
    };
    const loader = new Loader(options);
    loader.load().then(() => {
      if (inputRef && inputRef.current) {
        const newAutocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
        setAutocomplete(newAutocomplete);
      }
    });
  }, []);

  return (
    <div>
      <label htmlFor={name}>Address:</label>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        render={({ field }) => (
          <div>
            <input
              {...field}
              type="text"
              id={name}
              ref={inputRef}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder="Enter your address"
            />
          </div>
        )}
      />
      {autocomplete && (
        <div>
          <ul>
            {autocomplete.getPlace() && autocomplete.getPlace().formatted_address && (
              <li onClick={() => handleSelect(autocomplete.getPlace().formatted_address)}>
                {autocomplete.getPlace().formatted_address}
              </li>
            )}
            {autocomplete.getPlacePredictions().map((prediction) => (
              <li key={prediction.place_id} onClick={() => handleSelect(prediction.description)}>
                {prediction.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
