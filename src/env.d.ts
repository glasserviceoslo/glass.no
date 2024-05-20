/// <reference types="astro/client" />

// biome-ignore lint/suspicious/noExplicitAny: Needed for using any in typescript
type ANY = any;

declare namespace App {
  interface Locals {
    session: import('@auth/core/types').Session | null;
  }
}
