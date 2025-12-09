import { CalendarMonth, Feed, PeopleAlt, SpaceDashboard, Work } from '@mui/icons-material';
import './sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Switch from '@mui/material/Switch';
import { useTheme } from '../../../context/ThemeContext';
import { themes } from '../../../constant/themes';

const Sidebar = () => {
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const isDarkTheme = theme === themes.dark;

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await signOut();
            navigate('/login');
        } catch(error) {
            console.log('Logout error:', error);
        }
    }

  return (
    <div className="sidebar-container">
      <div className="sidebar-wrapper" style={{color: theme.text_sidebar}}>
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <img className='w-14' src='/src/assets/images/white-icon.png' alt='SVC' />
            <p>INSTiWISE</p>
          </div>

          <div className="sidebar-links">
            <Link to='/' className='link-main'>
              <div className="sidebar-link">
                <SpaceDashboard sx={{fontSize: 28}} />
                <p>Dashboard</p>
              </div>
            </Link>
            <Link to='/news' className='link-main'>
              <div className="sidebar-link">
                <Feed sx={{fontSize: 28}} />
                <p>News</p>
              </div>
            </Link>
            <Link to='/events' className='link-main'>
              <div className="sidebar-link">
                <CalendarMonth sx={{fontSize: 28}} />
                <p>Events</p>
              </div>
            </Link>
            <Link to='/projects' className='link-main'>
              <div className="sidebar-link">
                <Work sx={{fontSize: 28}} />
                <p>Projects</p>
              </div>
            </Link>
            <Link to='/users' className='link-main'>
              <div className="sidebar-link">
                <PeopleAlt sx={{fontSize: 28}} />
                <p>Users</p>
              </div>
            </Link>
          </div>

          <div className="sidebar-links">
            <Link to='/create-news' className='link-main'>
              <div className="sidebar-link">
                <Feed sx={{fontSize: 28}} />
                <p>Create News</p>
              </div>
            </Link>
            <Link to='/create-event' className='link-main'>
              <div className="sidebar-link">
                <CalendarMonth sx={{fontSize: 28}} />
                <p>New Event</p>
              </div>
            </Link>
            <Link to='/create-user' className='link-main'>
              <div className="sidebar-link">
                <PeopleAlt sx={{fontSize: 28}} />
                <p>New User</p>
              </div>
            </Link>
          </div>

          {/* <div className="toggle-theme">
            <p>Change theme</p>
            
            <Switch
                checked={isDarkTheme}
                onChange={toggleTheme}
                sx={{
                    '& .MuiSwitch-track': {
                    backgroundColor: isDarkTheme ? '#2E7D32' : '#767577',
                    opacity: 1,
                    },
                    '& .MuiSwitch-thumb': {
                    backgroundColor: isDarkTheme ? '#FFFFFF' : '#F4F3F4',
                    },
                }}
            />
          </div> */}
        </div>

        <div className="sidebar-logout">
          <button onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar