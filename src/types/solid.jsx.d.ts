import type { Component } from 'solid-js';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      field: (ref: HTMLElement) => void;
      error: string;
    }
  }
}
