import Cal from '@calcom/embed-react';
import { useCalTheme } from '@/hooks/react/use-update-cal-theme';

export function BookingPage() {
  const { theme } = useCalTheme();

  return (
    <div className="w-full h-full min-h-[calc(100vh-298px)] overflow-auto pt-10">
      <Cal calLink="glassno/befaring" config={{ layout: 'column_view', theme }} />
    </div>
  );
}
