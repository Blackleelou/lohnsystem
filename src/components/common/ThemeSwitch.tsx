// components/ThemeSwitch.tsx
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // LocalStorage zuerst checken, sonst immer light
    const saved = typeof window !== 'undefined' && localStorage.getItem('theme');
    if (saved === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setLight = () => {
    setTheme('light');
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  };

  const setDark = () => {
    setTheme('dark');
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={setLight}
        className={`w-7 h-7 rounded-full flex items-center justify-center transition 
          ${theme === 'light' ? 'bg-blue-100 shadow text-yellow-500 scale-110' : 'hover:bg-gray-100 text-gray-400'}`}
        aria-label="Heller Modus"
        type="button"
      >
        <Sun className="w-4 h-4" />
      </button>
      <span className="text-gray-300 select-none px-1 text-xs">|</span>
      <button
        onClick={setDark}
        className={`w-7 h-7 rounded-full flex items-center justify-center transition 
          ${theme === 'dark' ? 'bg-blue-900 shadow text-yellow-300 scale-110' : 'hover:bg-gray-200 text-gray-400'}`}
        aria-label="Dunkler Modus"
        type="button"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
