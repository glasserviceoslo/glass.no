import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { NavMenu } from './NavMenu';
import type { CollectionEntry } from 'astro:content';

type MenuItems = CollectionEntry<'navigation'>['data']['menuItems'];

interface MobileMenuProps {
  menuItems: MenuItems;
}

export function MobileMenu({ menuItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4">
          <NavMenu menuItems={menuItems} isMobile={true} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
