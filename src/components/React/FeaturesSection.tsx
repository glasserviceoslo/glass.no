import { cn } from '@/lib/utils';
import { Heart, Users, Truck, Banknote, MessageCircle, HelpCircle } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      title: 'Fornøyde Kunder',
      description:
        'Vi har levert glasstjenester til tusenvis fornøyde kunder - siden 1889. Du trenger ikke å stole blindt på oss når vi sier at vi leverer høy kvalitet og utrolig service - hør på kundene våre!',
      icon: <Heart className="h-6 w-6" />,
    },
    {
      title: 'Kvalifiserte Montører',
      description:
        'Våre medarbeidere er dyktige, faglærte og har både utdanning samt lang erfaring i glassfaget. Du vil føle deg ivaretatt i hele prosessen, fra befaring til ferdig utført arbeid.',
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: 'Raske leveranser',
      description:
        'Raske leveranser er en viktig funksjon for mange av våre kunder. Vi forstår at det kan være frustrerende å vente lenge på at glasset skal bli levert og montert, så vi gjør alt vi kan for å sørge for at det skjer så fort som mulig.',
      icon: <Truck className="h-6 w-6" />,
    },
    {
      title: 'Rimelige priser',
      description:
        'Vi tilbyr kostnadseffektive tjenester. Vårt mål er å gjøre det enklere for alle å ha råd til å få de tjenestene de trenger, uten å måtte ofre kvaliteten. Vi tror på at god kvalitet ikke trenger å koste en formue.',
      icon: <Banknote className="h-6 w-6" />,
    },
    {
      title: 'Kundestøtte',
      description:
        'Vi forstår at det kan være mange spørsmål og bekymringer knyttet til å bestille og få levert og montert glass, så vi gjør alt vi kan for å hjelpe kundene våre. Vi hjelper kundene med å føle seg trygge og forstå hva som skjer underveis i prosessen.',
      icon: <MessageCircle className="h-6 w-6" />,
    },
    {
      title: 'Profesjonelle råd',
      description:
        'Mange kan ha spørsmål eller være usikre på hvilket glass som passer best for deres behov. Vi prøver å hjelpe våre kunder med å velge det riktige glasset, samt gi dem tips om vedlikehold og bruk.',
      icon: <HelpCircle className="h-6 w-6" />,
    },
  ];

  return (
    <section
      id="hvorfor-oss"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  relative z-10 py-10 max-w-7xl mx-auto"
    >
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </section>
    // <section className="bg-white px-6 pt-20 dark:bg-gray-900" id="hvorfor-oss">
    //   <div className="mx-auto max-w-screen-xl px-4 pb-10 lg:px-6">
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    //       {features.map((feature, index) => (
    //         <Feature key={feature.title} {...feature} index={index} />
    //       ))}
    //     </div>
    //   </div>
    // </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        'flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800',
        (index === 0 || index === 3) && 'lg:border-l dark:border-neutral-800',
        index < 3 && 'lg:border-b dark:border-neutral-800',
      )}
    >
      {index < 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">{description}</p>
    </div>
  );
};
