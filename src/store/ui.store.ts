import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface UIState {
  loading: boolean;
  theme: Theme;
  showLoader: () => void;
  hideLoader: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

// Get initial theme from localStorage or system preference
const getInitialTheme = (): Theme => {
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  // Fallback to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

// Apply theme to document
const applyTheme = (theme: Theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
};

export const useUIStore = create<UIState>((set, get) => ({
  loading: false,
  theme: getInitialTheme(),

  showLoader: () => set({ loading: true }),
  hideLoader: () => set({ loading: false }),

  setTheme: (theme: Theme) => {
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    set({ theme: newTheme });
  },

  initializeTheme: () => {
    const theme = getInitialTheme();
    applyTheme(theme);
    set({ theme });
  },
}));
