const storageKey = 'aldhalea-theme';
const darkThemeColor = '#051836';
const lightThemeColor = '#f6f8fb';

export type ThemePreference = 'light' | 'dark';

function preferredTheme(): ThemePreference {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(storageKey);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setThemeColor(isDark: boolean) {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = isDark ? darkThemeColor : lightThemeColor;
}

export function applyTheme(theme: ThemePreference = preferredTheme()): ThemePreference {
  if (typeof document === 'undefined') return theme;
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.dataset.theme = theme;
  setThemeColor(isDark);
  return theme;
}

export function initTheme(): ThemePreference {
  const theme = applyTheme();
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (!window.localStorage.getItem(storageKey)) applyTheme();
    });
  }
  return theme;
}

export function getThemePreference(): ThemePreference {
  return preferredTheme();
}

export function setThemePreference(theme: ThemePreference): ThemePreference {
  window.localStorage.setItem(storageKey, theme);
  return applyTheme(theme);
}

export function toggleThemePreference(): ThemePreference {
  return setThemePreference(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
}
