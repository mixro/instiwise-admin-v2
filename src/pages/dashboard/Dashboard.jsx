import React from 'react'
import { useTheme } from '../../context/ThemeContext';
import { themes } from '../../constant/themes';

const Dashboard = () => {
    const { theme, toggleTheme } = useTheme();

  return (
    <header style={{ background: theme.background, color: theme.text }}>
      <h1>InstiWise Admin Panel</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === themes.light ? 'Dark' : 'Light'} Mode
      </button>
    </header>
  )
}

export default Dashboard