export interface ThemePalette {
  id: string;
  name: string;
  preview: [string, string, string]; // [accent, bg, accent2] for the selector dots

  bgDeep: string;
  bgPrimary: string;
  bgSecondary: string;
  bgElevated: string;
  bgSurface: string;
  bgHover: string;

  accent: string;
  accentGlow: string;
  accentDim: string;
  accentBright: string;
  accentSecondary: string;
  gradientStart: string;
  gradientEnd: string;

  fgPrimary: string;
  fgSecondary: string;
  fgMuted: string;

  border: string;
  borderBright: string;

  select: string;
  selectStrong: string;

  danger: string;
  warning: string;
}

export const THEMES: ThemePalette[] = [
  {
    id: 'emerald',
    name: 'Emerald',
    preview: ['#00e599', '#050a0e', '#00d4ff'],
    bgDeep: '#050a0e',
    bgPrimary: '#0a1018',
    bgSecondary: '#0d1820',
    bgElevated: '#111f2a',
    bgSurface: '#152535',
    bgHover: '#1a3040',
    accent: '#00e599',
    accentGlow: '#00e59966',
    accentDim: '#00c07a',
    accentBright: '#00ffaa',
    accentSecondary: '#00d4ff',
    gradientStart: '#00e599',
    gradientEnd: '#00b4d8',
    fgPrimary: '#e8eff6',
    fgSecondary: '#8ba4bc',
    fgMuted: '#5b7a94',
    border: '#1a3040',
    borderBright: '#00e59933',
    select: '#00e59918',
    selectStrong: '#00e59930',
    danger: '#ff4466',
    warning: '#ffaa00',
  },
  {
    id: 'cyan',
    name: 'Cian',
    preview: ['#00d4ff', '#060a12', '#6366f1'],
    bgDeep: '#060a12',
    bgPrimary: '#0a1220',
    bgSecondary: '#0e1a2a',
    bgElevated: '#132438',
    bgSurface: '#182e42',
    bgHover: '#1e384c',
    accent: '#00d4ff',
    accentGlow: '#00d4ff55',
    accentDim: '#00a8cc',
    accentBright: '#44e4ff',
    accentSecondary: '#6366f1',
    gradientStart: '#00d4ff',
    gradientEnd: '#6366f1',
    fgPrimary: '#e4edf8',
    fgSecondary: '#88a4c0',
    fgMuted: '#5878a0',
    border: '#1a3050',
    borderBright: '#00d4ff33',
    select: '#00d4ff18',
    selectStrong: '#00d4ff30',
    danger: '#ff4466',
    warning: '#ffaa00',
  },
  {
    id: 'violet',
    name: 'Violeta',
    preview: ['#a78bfa', '#08061a', '#f472b6'],
    bgDeep: '#08061a',
    bgPrimary: '#0e0a24',
    bgSecondary: '#14102e',
    bgElevated: '#1c1640',
    bgSurface: '#241e50',
    bgHover: '#2c265a',
    accent: '#a78bfa',
    accentGlow: '#a78bfa55',
    accentDim: '#8b6de0',
    accentBright: '#c4b5fd',
    accentSecondary: '#f472b6',
    gradientStart: '#a78bfa',
    gradientEnd: '#f472b6',
    fgPrimary: '#ede8ff',
    fgSecondary: '#a8a0cc',
    fgMuted: '#7870a0',
    border: '#2a2050',
    borderBright: '#a78bfa33',
    select: '#a78bfa18',
    selectStrong: '#a78bfa30',
    danger: '#ff4466',
    warning: '#ffaa00',
  },
  {
    id: 'amber',
    name: 'Ambar',
    preview: ['#f59e0b', '#0e0a04', '#ef4444'],
    bgDeep: '#0e0a04',
    bgPrimary: '#161008',
    bgSecondary: '#1e1810',
    bgElevated: '#28201a',
    bgSurface: '#322a22',
    bgHover: '#3c342c',
    accent: '#f59e0b',
    accentGlow: '#f59e0b55',
    accentDim: '#d48a06',
    accentBright: '#fbbf24',
    accentSecondary: '#ef4444',
    gradientStart: '#f59e0b',
    gradientEnd: '#ef4444',
    fgPrimary: '#fef3e2',
    fgSecondary: '#c4a878',
    fgMuted: '#947858',
    border: '#3a2e20',
    borderBright: '#f59e0b33',
    select: '#f59e0b18',
    selectStrong: '#f59e0b30',
    danger: '#ef4444',
    warning: '#fbbf24',
  },
  {
    id: 'rose',
    name: 'Rosa',
    preview: ['#f472b6', '#0e0408', '#a78bfa'],
    bgDeep: '#0e0408',
    bgPrimary: '#180a12',
    bgSecondary: '#22101c',
    bgElevated: '#2e1828',
    bgSurface: '#3a2034',
    bgHover: '#44283e',
    accent: '#f472b6',
    accentGlow: '#f472b655',
    accentDim: '#d05a9a',
    accentBright: '#f9a8d4',
    accentSecondary: '#a78bfa',
    gradientStart: '#f472b6',
    gradientEnd: '#a78bfa',
    fgPrimary: '#fce8f0',
    fgSecondary: '#c898b0',
    fgMuted: '#986880',
    border: '#3a1830',
    borderBright: '#f472b633',
    select: '#f472b618',
    selectStrong: '#f472b630',
    danger: '#ef4444',
    warning: '#ffaa00',
  },
  {
    id: 'mint',
    name: 'Menta',
    preview: ['#34d399', '#040e0a', '#0ea5e9'],
    bgDeep: '#040e0a',
    bgPrimary: '#081814',
    bgSecondary: '#0c221e',
    bgElevated: '#142e28',
    bgSurface: '#1c3a34',
    bgHover: '#24443e',
    accent: '#34d399',
    accentGlow: '#34d39955',
    accentDim: '#20b880',
    accentBright: '#6ee7b7',
    accentSecondary: '#0ea5e9',
    gradientStart: '#34d399',
    gradientEnd: '#0ea5e9',
    fgPrimary: '#e6f8f0',
    fgSecondary: '#88c4a8',
    fgMuted: '#589478',
    border: '#1a3a30',
    borderBright: '#34d39933',
    select: '#34d39918',
    selectStrong: '#34d39930',
    danger: '#ff4466',
    warning: '#ffaa00',
  },
];

export function getThemeById(id: string): ThemePalette {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

export function applyTheme(theme: ThemePalette): void {
  const root = document.documentElement;
  root.style.setProperty('--bg-deep', theme.bgDeep);
  root.style.setProperty('--bg-primary', theme.bgPrimary);
  root.style.setProperty('--bg-secondary', theme.bgSecondary);
  root.style.setProperty('--bg-elevated', theme.bgElevated);
  root.style.setProperty('--bg-surface', theme.bgSurface);
  root.style.setProperty('--bg-hover', theme.bgHover);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-glow', theme.accentGlow);
  root.style.setProperty('--accent-dim', theme.accentDim);
  root.style.setProperty('--accent-bright', theme.accentBright);
  root.style.setProperty('--accent-secondary', theme.accentSecondary);
  root.style.setProperty('--gradient-start', theme.gradientStart);
  root.style.setProperty('--gradient-end', theme.gradientEnd);
  root.style.setProperty('--fg-primary', theme.fgPrimary);
  root.style.setProperty('--fg-secondary', theme.fgSecondary);
  root.style.setProperty('--fg-muted', theme.fgMuted);
  root.style.setProperty('--border', theme.border);
  root.style.setProperty('--border-bright', theme.borderBright);
  root.style.setProperty('--select', theme.select);
  root.style.setProperty('--select-strong', theme.selectStrong);
  root.style.setProperty('--danger', theme.danger);
  root.style.setProperty('--warning', theme.warning);

  // Also update body background
  document.body.style.background = theme.bgDeep;
}

export function saveThemeId(id: string): void {
  try { localStorage.setItem('theia_theme', id); } catch {}
}

export function loadThemeId(): string {
  try { return localStorage.getItem('theia_theme') || 'violet'; } catch { return 'violet'; }
}
