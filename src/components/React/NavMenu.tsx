import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import type { CollectionEntry } from 'astro:content';

type MenuItems = CollectionEntry<'navigation'>['data']['menuItems'];

interface NavMenuProps {
  menuItems: MenuItems;
  isMobile?: boolean;
}

export function NavMenu({ menuItems, isMobile = false }: NavMenuProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const renderMenuItem = (item: MenuItems[number]) => {
    const hasChildren = item.children && item.children.length > 0;

    if (isMobile) {
      if (hasChildren) {
        return (
          <Collapsible
            key={item.navigationTitle}
            open={openItems[item.navigationTitle]}
            onOpenChange={() => toggleItem(item.navigationTitle)}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between text-lg font-medium">
              {item.navigationTitle}
              <ChevronDown
                className={cn('h-4 w-4 transition-transform', openItems[item.navigationTitle] && 'rotate-180')}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {item.children!.map((child) => (
                <a key={child.navigationTitle} href={getItemHref(child.item)} className="block pl-4 text-sm">
                  {child.navigationTitle}
                </a>
              ))}
            </CollapsibleContent>
          </Collapsible>
        );
      } else {
        return (
          <a key={item.navigationTitle} href={getItemHref(item.item)} className="text-lg font-medium">
            {item.navigationTitle}
          </a>
        );
      }
    } else {
      return (
        <NavigationMenuItem key={item.navigationTitle}>
          {hasChildren ? (
            <>
              <NavigationMenuTrigger>{item.navigationTitle}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {item.children!.map((child) => (
                    <ListItem key={child.navigationTitle} title={child.navigationTitle} href={getItemHref(child.item)}>
                      {/* Add description if available */}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </>
          ) : (
            <NavigationMenuLink className={navigationMenuTriggerStyle()} href={getItemHref(item.item)}>
              {item.navigationTitle}
            </NavigationMenuLink>
          )}
        </NavigationMenuItem>
      );
    }
  };

  const getItemHref = (item: MenuItems[number]['item']) => {
    switch (item.discriminant) {
      case 'page':
        return `/${item.value}`;
      case 'post':
        return `/posts/${item.value}`;
      case 'glasstype':
        return `/glasstyper/${item.value}`;
      case 'custom':
        return `/${item.value.toLowerCase().replace(/\s+/g, '-')}`;
    }
  };

  if (isMobile) {
    return <nav className="flex flex-col space-y-4">{menuItems.map(renderMenuItem)}</nav>;
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>{menuItems.map(renderMenuItem)}</NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';
