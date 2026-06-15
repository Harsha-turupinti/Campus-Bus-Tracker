import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Default to dark mode for the premium glassmorphism UI
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    // Update localStorage and DOM when theme changes
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const html = document.documentElement;
    // Prefer class-based toggling, but also set a data attribute and meta tag as fallbacks
    if (isDark) {
      if (html.classList) {
        html.classList.add('dark');
        html.classList.remove('light');
      } else {
        // very old browsers: append 'dark' if missing
        if (!html.className || !html.className.includes('dark')) html.className = (html.className + ' dark').trim();
      }
      html.setAttribute('data-theme', 'dark');
    } else {
      if (html.classList) {
        html.classList.remove('dark');
        if (!html.classList.contains('light')) html.classList.add('light');
      } else {
        // very old browsers: ensure 'light' class exists on className
        if (!html.className || !html.className.includes('light')) html.className = (html.className + ' light').trim();
      }
      html.setAttribute('data-theme', 'light');
    }

    // Ensure a meta color-scheme exists as an additional hint for older UAs
    try {
      let meta = document.querySelector('meta[name="color-scheme"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'color-scheme');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', isDark ? 'dark' : 'light');
    } catch (e) {
      // ignore DOM exceptions in very old environments
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
