'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Switch disabled />;
  }

  return (
    <Switch
      checked={theme === 'dark'}
      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
    />
  );
}
