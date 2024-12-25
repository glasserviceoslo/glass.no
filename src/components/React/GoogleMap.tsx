import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export const GoogleMap = () => {
  const mapRef = useRef(null);
  const center = { lat: 59.920347151202975, lng: 10.734426811873956 };
  const mapId = 'bd713334a2dc72c';

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_KEY,
      version: 'weekly',
    });

    async function initializeMap() {
      try {
        await loader.importLibrary('maps');
        const { AdvancedMarkerElement } = await loader.importLibrary('marker');

        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center,
            zoom: 15,
            mapId,
          });

          new AdvancedMarkerElement({
            position: center,
            map,
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    }

    initializeMap();
  }, []);

  return <div ref={mapRef} className="relative h-[700px] rounded-lg shadow-lg" />;
};
