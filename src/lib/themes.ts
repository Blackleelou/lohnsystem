export type Theme = {
  name: string;
  displayName: string;
  style: string;
  primaryColor: string;
  accentColor: string;
  bgLight: string;
  bgDark: string;
  textColor: string;
};

export const THEMES: Theme[] = [
  {
    name: 'aurora',
    displayName: 'Aurora',
    style: 'Nordisch, beruhigend',
    primaryColor: '#5E81AC',
    accentColor: '#88C0D0',
    bgLight: '#ECEFF4',
    bgDark: '#2E3440',
    textColor: '#111827',
  },
  {
    name: 'sunset-pulse',
    displayName: 'Sunset Pulse',
    style: 'Warm, energiegeladen',
    primaryColor: '#EF4444',
    accentColor: '#F97316',
    bgLight: '#FFF7ED',
    bgDark: '#1F2937',
    textColor: '#1F2937',
  },
  {
    name: 'oceanic',
    displayName: 'Oceanic',
    style: 'Tech, klar, strukturiert',
    primaryColor: '#0EA5E9',
    accentColor: '#22D3EE',
    bgLight: '#F0F9FF',
    bgDark: '#0F172A',
    textColor: '#0F172A',
  },
  {
    name: 'lime-pop',
    displayName: 'Lime Pop',
    style: 'Modern, Startup-Vibe',
    primaryColor: '#84CC16',
    accentColor: '#A3E635',
    bgLight: '#F7FEE7',
    bgDark: '#1A2E05',
    textColor: '#1A2E05',
  },
  {
    name: 'midnight-metro',
    displayName: 'Midnight Metro',
    style: 'Elegant, Darkmode-optimiert',
    primaryColor: '#4F46E5',
    accentColor: '#8B5CF6',
    bgLight: '#E0E7FF',
    bgDark: '#111827',
    textColor: '#E0E7FF',
  },
  {
    name: 'classic-duo',
    displayName: 'Classic Duo',
    style: 'Klassisch Hell & Dunkel',
    primaryColor: '#2563EB',
    accentColor: '#1E40AF',
    bgLight: '#FFFFFF',
    bgDark: '#1F2937',
    textColor: '#111827',
  },
];
