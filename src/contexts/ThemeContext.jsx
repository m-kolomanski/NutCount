import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'auto';
  });

  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const getActiveTheme = () => {
    if (theme === 'auto') {
      return getSystemTheme();
    }
    return theme;
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const activeTheme = getActiveTheme();
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', activeTheme);
    
    // Also set the Bootstrap data-bs-theme attribute for better Bootstrap 5.3+ support
    document.documentElement.setAttribute('data-bs-theme', activeTheme);
  }, [theme]);

  useEffect(() => {
    // Listen for system theme changes when in auto mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'auto') {
        const activeTheme = getActiveTheme();
        document.documentElement.setAttribute('data-theme', activeTheme);
        document.documentElement.setAttribute('data-bs-theme', activeTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  const value = {
    theme,
    activeTheme: getActiveTheme(),
    changeTheme,
    themes: ['light', 'dark', 'auto']
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
