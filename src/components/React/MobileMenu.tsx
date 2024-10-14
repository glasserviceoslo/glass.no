import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavMenu } from "./NavMenu";
import type {CollectionEntry } from "astro:content";

interface MobileMenuProps {
  navElements: CollectionEntry<"pages">[];
  products: CollectionEntry<"pages">[];
  glasstypes: CollectionEntry<'glasstypes'>[];
}

export function MobileMenu({ navElements, products, glasstypes }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open main menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <NavMenu 
          navElements={navElements} 
          products={products} 
          glasstypes={glasstypes} 
          isMobile={true}
        />
      </SheetContent>
    </Sheet>
  );
}
