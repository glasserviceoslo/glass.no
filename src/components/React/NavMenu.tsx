import React, { useState } from "react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import type {CollectionEntry } from "astro:content";

interface NavMenuProps {
  navElements: CollectionEntry<"pages">[];
  products: CollectionEntry<"pages">[];
  glasstypes: CollectionEntry<'glasstypes'>[];
  isMobile?: boolean;
}

export function NavMenu({ navElements, products, glasstypes, isMobile = false }: NavMenuProps) {
  const [openProduct, setOpenProduct] = useState(false);
  const [openGlasstype, setOpenGlasstype] = useState(false);

  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-4">
        {navElements.map((element) => (
          <a key={element.slug} href={`/${element.slug}`} className="text-lg font-medium">
            {element.data.navigation.value?.title}
          </a>
        ))}

        <Collapsible open={openProduct} onOpenChange={setOpenProduct}>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-lg font-medium">
            Produkter
            <ChevronDown className={cn("h-4 w-4 transition-transform", openProduct && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {products.map((product) => (
              <a key={product.slug} href={`/produkter/${product.slug}`} className="block pl-4 text-sm">
                {product.data.title}
              </a>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openGlasstype} onOpenChange={setOpenGlasstype}>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-lg font-medium">
            Glasstyper
            <ChevronDown className={cn("h-4 w-4 transition-transform", openGlasstype && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {glasstypes.map((glasstype) => (
              <a key={glasstype.slug} href={`/glasstyper/${glasstype.slug}`} className="block pl-4 text-sm">
                {glasstype.data.title}
              </a>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <a href="/kontakt" className="text-lg font-medium">
          Kontakt Oss
        </a>
      </nav>
    )
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navElements.map((element) => (
          <NavigationMenuItem key={element.slug}>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} href={`/${element.slug}`}>
              {element.data.navigation.value?.title}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}

        <NavigationMenuItem>
          <NavigationMenuTrigger>Produkter</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {products.map((product) => (
                <ListItem
                  key={product.slug}
                  title={product.data.title}
                  href={`/produkter/${product.slug}`}
                >
                  {product.data.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Glasstyper</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {glasstypes.map((glasstype) => (
                <ListItem
                  key={glasstype.slug}
                  title={glasstype.data.title}
                  href={`/glasstyper/${glasstype.slug}`}
                >
                  {glasstype.data.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/kontakt">
            Kontakt Oss
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
