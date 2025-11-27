// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes } from '../constant/themes';


// Create Context
const ThemeContext = createContext({
  theme: themes.light,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// Theme Provider Component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(themes.light);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('instiwise-admin-theme');
    if (savedTheme === 'dark') {
      setTheme(themes.dark);
    } else {
      setTheme(themes.light);
    }
  }, []);

  // Toggle between light and dark + persist
  const toggleTheme = () => {
    const newTheme = theme === themes.light ? themes.dark : themes.light;
    setTheme(newTheme);
    localStorage.setItem('instiwise-admin-theme', newTheme === themes.dark ? 'dark' : 'light');

    // Optional: Update root HTML class for CSS-based theming
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    document.documentElement.classList.add(newTheme === themes.dark ? 'dark-theme' : 'light-theme');
  };

  // Apply theme class on first load and changes
  useEffect(() => {
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    document.documentElement.classList.add(theme === themes.dark ? 'dark-theme' : 'light-theme');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Export themes separately if needed elsewhere
export default ThemeContext;