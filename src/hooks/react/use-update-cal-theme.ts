import { useState, useEffect, useRef } from 'react';
import { getCalApi } from '@calcom/embed-react';
import type { Theme } from '@/types';

type CalApi = Awaited<ReturnType<typeof getCalApi>>;

export function useCalTheme(namespace?: string) {
  const [theme, setTheme] = useState<Theme>('dark');
  const calApiRef = useRef<CalApi | null>(null);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace });
      calApiRef.current = cal;
    })();
  }, []);

  useEffect(() => {
    const saved = localStorage?.getItem('color-theme');
    setTheme((saved as Theme) || 'dark');
  }, []);

  useEffect(() => {
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === 'color-theme') {
        const newTheme = (e.newValue as Theme) || 'dark';
        setTheme(newTheme);
        calApiRef.current?.('ui', { theme: newTheme });
      }
    };

    const handleThemeChange = async (e: CustomEvent<Theme>) => {
      setTheme(e.detail);
      calApiRef.current?.('ui', { theme: e.detail });
    };

    const themeChangeListener = (e: Event) => handleThemeChange(e as CustomEvent<Theme>);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('themeChange', themeChangeListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', themeChangeListener);
    };
  }, []);

  return {
    theme,
    calApi: calApiRef.current,
    updateTheme: (newTheme: Theme) => {
      setTheme(newTheme);
      calApiRef.current?.('ui', { theme: newTheme });
    },
  };
}
