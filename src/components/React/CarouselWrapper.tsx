import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export function CarouselWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Carousel className="w-full h-[calc(100vh-64px)]">
      <CarouselContent>
        {React.Children.map(children, (child, index) => (
          <CarouselItem key={index} className="relative">
            <div className="h-full w-full">{child}</div>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-4">Kvalitetstjeneste siden 1889</h2>
                <p className="text-xl">Glassløsninger for enhver situasjon</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
