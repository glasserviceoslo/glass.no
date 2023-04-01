import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export function useGoogleMaps(region = 'NO') {
  const [googleMaps, setGoogleMaps] = useState<typeof google.maps | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_KEY,
      version: 'weekly',
      libraries: ['places'],
      region,
    });

    loader.load().then(() => {
      setGoogleMaps(google.maps);
    });
  }, []);

  return googleMaps;
}
