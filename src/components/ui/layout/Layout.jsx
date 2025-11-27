import React, { useState } from 'react'
import Sidebar from '../../navigation/sidebar/Sidebar'
import Topbar from '../../navigation/topbar/Topbar'
import Paper from '@mui/material/Paper'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import { CalendarMonth, Feed, PeopleAlt, RequestPage, SpaceDashboard, SyncAlt, Work } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import './layout.css'
import { useTheme } from '../../../context/ThemeContext'


const Layout = ({children}) => {
  const { theme } = useTheme();
  const [value, setValue] = useState("/");
  const currentYear = new Date().getFullYear();

  const handleChange = (event, newValue) => {
      setValue(newValue);
  };

  return (
    <div className="layout-component">
        <div className="layout-container">
            <div className="layout-sidebar" 
              style={{background: theme.sidebar_bg, color: theme.text_reverse}}
            >
                <Sidebar />
            </div>

            <div className="layout-body">
                <div className="layout-topbar">
                    <Topbar />
                </div>

                <div className="layout-main">
                    <main>
                        {children}
                    </main>

                    
                    <div className="layout-footer">
                        <p>© {currentYear}. SVC Float Management</p>
                    </div>
                </div>

                <div className="nav-bottom-button">
                    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                        <BottomNavigation
                            showLabels
                            value={value}
                            onChange={handleChange}
                        >
                            <BottomNavigationAction component={Link} to="/" label="Dashboard" value="" icon={<SpaceDashboard />}
                                sx={{
                                    '&.Mui-selected': {
                                    color: '#018559', 
                                    },
                                }}
                            />
                            <BottomNavigationAction component={Link} to="/news" label="News" value="news" icon={<Feed />}
                                sx={{
                                    '&.Mui-selected': {
                                    color: '#018559',
                                    },
                                }}
                            />
                            <BottomNavigationAction component={Link} to="/events" label="Events" value="events" icon={<CalendarMonth />}
                                sx={{
                                    '&.Mui-selected': {
                                    color: '#018559',
                                    },
                                }}
                            />
                            <BottomNavigationAction component={Link} to="/projects" label="Projects" value="projects" icon={<Work />}
                                sx={{
                                    '&.Mui-selected': {
                                    color: '#018559',
                                    },
                                }}
                            />
                            <BottomNavigationAction component={Link} to="/users" label="Users" value="users" icon={<PeopleAlt />}
                                sx={{
                                    '&.Mui-selected': {
                                    color: '#018559',
                                    },
                                }}
                            />
                        </BottomNavigation>
                    </Paper>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Layout