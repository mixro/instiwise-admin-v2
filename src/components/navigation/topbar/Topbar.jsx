import React, { useState } from "react";
import './topbar.css'
import { Box, Drawer } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from "../sidebar/Sidebar";
import { CalendarMonth, DensityMedium, Feed, PeopleAlt, Work } from "@mui/icons-material";
import { useAuth } from "../../../hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";

const Topbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [state, setState] = useState({ left: false });

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await signOut();
            navigate('/login');
        } catch(error) {
            console.log('Logout error:', error);
        }
    }


  const getPageTitle = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const baseRoute = pathSegments[0] || 'Dashboard'; 
    return baseRoute.charAt(0).toUpperCase() + baseRoute.slice(1); 
  };

  const currentTitle = getPageTitle();

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 260}}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="Small_Sidebar_container">
        <Sidebar />
      </div>
    </Box>
  );

  return (
    <div className="topbar-container" style={{background: theme.background}}>
      <div className="topbar-menu-icon">
        {['left'].map((anchor) => (
          <React.Fragment key={anchor} >
              <DensityMedium sx={{fontSize: 30, cursor: "pointer"}} onClick={toggleDrawer(anchor, true)} />   
              <Drawer
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
              >
                  {list(anchor)}
              </Drawer>
          </React.Fragment>
        ))}
      </div>
      
      <div className="topbar-location">
        <p>{currentTitle}</p>
      </div>

      <div className="topbar-right">
        <div className="topbar-links">
          <Link to='/news' className='link-main'>
            <div className="topbar-icon">
              <Feed sx={{fontSize: {xs: 28, sm: 28, md: 30}}} />
              <div className="topbar-icon-number" style={{background: theme.sidebar_bg}}>
                <p>12</p>
              </div>
            </div>
          </Link>
          <Link to='/events' className='link-main'>
            <div className="topbar-icon">
              <CalendarMonth sx={{fontSize: 30}} />
              <div className="topbar-icon-number" style={{background: theme.sidebar_bg}}>
                <p>10</p>
              </div>
            </div>
          </Link>
          <Link to='/projects' className='link-main'>
            <div className="topbar-icon">
              <Work sx={{fontSize: {xs: 28, sm: 28, md: 30}}} />
              <div className="topbar-icon-number" style={{background: theme.sidebar_bg}}>
                <p>34</p>
              </div>
            </div>
          </Link>
          <Link to='/users' className='link-main'>
            <div className="topbar-icon">
              <PeopleAlt sx={{fontSize: {xs: 28, sm: 28, md: 30}}} />
              <div className="topbar-icon-number" style={{background: theme.sidebar_bg}}>
                <p>11</p>
              </div>
            </div>
          </Link>
        </div>

        <Link to="/" className='link-main'>
          <div className="topbar-profile">
              <img src='/src/assets/images/icon.png' alt='PR' />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Topbar