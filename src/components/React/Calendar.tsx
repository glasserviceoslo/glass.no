/** @jsxImportSource react */

import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

export const Calendar = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal!('ui', { styles: { branding: { brandColor: '#000000' } }, hideEventTypeDetails: false });
    })();
  }, []);

  return (
    <button className="btn-primary" data-cal-link="glassno/befaring">
      Book
    </button>
  );
};
