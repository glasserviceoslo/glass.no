import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
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
          key={item.navigationTitle}
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
            key={item.navigationTitle}
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
                  key={grandchild.navigationTitle}
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
          <a {...linkProps} key={item.navigationTitle} className="block text-base font-medium pl-4">
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
        <nav className="flex flex-col space-y-4">{menuItems.map((item) => renderMenuItem(item))}</nav>
      </SheetContent>
    </Sheet>
  );
}
