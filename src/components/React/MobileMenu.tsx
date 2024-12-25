import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { cn, getItemHref } from '@/lib/utils';
import type { MenuItem, MenuItems } from '@/types';

interface MobileMenuProps {
  menuItems: MenuItems;
}

export function MobileMenu({ menuItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const hasGrandchildren = item.grandchildren && item.grandchildren.length > 0;

    const linkProps = {
      href: getItemHref(item.item),
      onClick: () => setIsOpen(false),
    };

    if (level === 0) {
      return (
        <Collapsible
          key={crypto.randomUUID()}
          open={openItems[item.navigationTitle]}
          onOpenChange={() => toggleItem(item.navigationTitle)}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between text-lg font-medium">
            {hasChildren ? (
              <span>{item.navigationTitle}</span>
            ) : (
              <a {...linkProps} className="w-full text-left">
                {item.navigationTitle}
              </a>
            )}
            {hasChildren && (
              <ChevronDown
                className={cn('h-4 w-4 transition-transform', openItems[item.navigationTitle] && 'rotate-180')}
              />
            )}
          </CollapsibleTrigger>
          {hasChildren && (
            <CollapsibleContent className="mt-2 space-y-2">
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </CollapsibleContent>
          )}
        </Collapsible>
      );
    } else if (level === 1) {
      if (hasGrandchildren) {
        return (
          <Collapsible
            key={crypto.randomUUID()}
            open={openItems[item.navigationTitle]}
            onOpenChange={() => toggleItem(item.navigationTitle)}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between text-base font-medium pl-4 pr-2">
              <a {...linkProps} className="w-full text-left">
                {item.navigationTitle}
              </a>
              <ChevronDown
                className={cn('h-4 w-4 transition-transform', openItems[item.navigationTitle] && 'rotate-180')}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2 pl-8">
              {item.grandchildren?.map((grandchild) => (
                <a
                  key={crypto.randomUUID()}
                  href={getItemHref(grandchild.item)}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm"
                >
                  {grandchild.navigationTitle}
                </a>
              ))}
            </CollapsibleContent>
          </Collapsible>
        );
      } else {
        return (
          <a {...linkProps} key={crypto.randomUUID()} className="block text-base font-medium pl-4">
            {item.navigationTitle}
          </a>
        );
      }
    }
  };

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
          {menuItems.map((item) => renderMenuItem(item))}
          <a
            href="/befaring"
            className={cn(
              'relative text-center cursor-pointer flex justify-center items-center rounded-lg text-white dark:text-black bg-blue-500 dark:bg-blue-500 px-4 py-2',
            )}
            style={
              {
                '--pulse-color': '#0096ff',
                '--duration': '1.5s',
              } as React.CSSProperties
            }
          >
            <div className="relative z-10 dark:text-white">Book Befaring</div>
            <div className="absolute top-1/2 left-1/2 size-full rounded-lg bg-inherit animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
