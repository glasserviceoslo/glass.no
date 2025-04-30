import type { ReactNode } from 'react';

interface ContactInfoCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

const ContactInfoCard = ({ icon, title, children }: ContactInfoCardProps) => (
  <div className="flex flex-col items-center rounded-lg bg-white/55 p-6 shadow-lg backdrop-blur-lg dark:bg-gray-800/80">
    <div className="mb-3 rounded-full bg-blue-50 p-3 dark:bg-blue-900/50">{icon}</div>
    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="text-center text-sm text-gray-600 dark:text-gray-200">{children}</p>
  </div>
);

export const ContactInfo = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <ContactInfoCard
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
        title="Adresse"
      >
        Pilestredet 41A, 0166 Oslo
      </ContactInfoCard>

      <ContactInfoCard
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        }
        title="Telefon"
      >
        +47 91 58 49 40
      </ContactInfoCard>

      <ContactInfoCard
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        }
        title="E-post"
      >
        post@glass.no
      </ContactInfoCard>
    </div>
  );
};
