import { useMemo, useEffect, useRef } from 'react';
import { useGoogleMaps } from '$hooks/react/useGoogleMaps';

export const GoogleMap = () => {
  const mapRef = useRef(null);
  const center = useMemo(() => ({ lat: 59.920347151202975, lng: 10.734426811873956 }), []);

  const googleMaps = useGoogleMaps();

  useEffect(() => {
    if (googleMaps && mapRef && mapRef.current) {
      const newMap = new googleMaps.Map(mapRef.current, {
        center,
        zoom: 15,
      });
      new googleMaps.Marker({
        position: center,
        map: newMap,
      });
    }
  }, [googleMaps]);

  return <div ref={mapRef} className="relative h-[700px] rounded-lg shadow-lg"></div>;
};
