import { useState, useMemo, useEffect, useRef } from 'react';
import { useGoogleMaps } from '$hooks/react/useGoogleMaps';

export const GoogleMap = () => {
  const mapRef = useRef(null);

  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();

  const center = useMemo(() => ({ lat: 59.920347151202975, lng: 10.734426811873956 }), []);

  const googleMaps = useGoogleMaps();

  useEffect(() => {
    if (googleMaps && mapRef && mapRef.current) {
      const newMap = new googleMaps.Map(mapRef.current, {
        center,
        zoom: 15,
      });
      setMap(newMap);
      const newMarker = new googleMaps.Marker({
        position: center,
        map: newMap,
      });
      setMarker(newMarker);
    }
  }, [googleMaps]);

  return <div ref={mapRef} className="relative -z-10 h-[700px] rounded-lg shadow-lg"></div>;
};
