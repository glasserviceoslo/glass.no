/** @jsxImportSource react */

import { useMemo } from 'react';
import { GoogleMap as Map, MarkerF } from '@react-google-maps/api';

export const GoogleMap = () => {
  const center = useMemo(() => ({ lat: 59.920347151202975, lng: 10.734426811873956 }), []);

  return (
    <Map zoom={15} center={center} mapContainerClassName="relative rounded-lg shadow-lg h-[700px] -z-10">
      <MarkerF position={center} />
    </Map>
  );
};
