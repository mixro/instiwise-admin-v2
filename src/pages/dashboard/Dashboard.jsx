import React from 'react'
import { useTheme } from '../../context/ThemeContext';
import { themes } from '../../constant/themes';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();


  return (
    <header style={{ background: theme.background, color: theme.text }}>
      <button onClick={toggleTheme}>
        Switch to {theme === themes.light ? 'Dark' : 'Light'} Mode
      </button>
    </header>
  )
}

export default Dashboard