import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { CalendarMonth, EnergySavingsLeaf, Feed, Home, HomeOutlined, Lightbulb, People, Verified, Work, TrendingUp } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Slider } from "@mui/material"
import moment from "moment";
import './dashboard.css'
import { useGetDashboardQuery } from '../../services/dashboardApi';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setDashboard } from '../../store/slices/dashboardSlice';


const Dashboard = () => {
    const dispatch = useDispatch();
    const year = new Date().getFullYear();    

    const { data: dashboard = {}, isLoading } = useGetDashboardQuery();
    
    const totalsData = dashboard.totals || {}; 
    const recentData = dashboard.recent || {};

    const dealsData = [
      { month: 'Jan', projects: 800 },
      { month: 'Feb', projects: 1100 },
      { month: 'Mar', projects: 500 },
      { month: 'Apr', projects: 700 },
      { month: 'May', projects: 800 },
      { month: 'Jun', projects: 600 },
      { month: 'July', projects: 900 },
      { month: 'Aug', projects: 800 },
      { month: 'Sept', projects: 1000 },
      { month: 'Oct', projects: 1100 },
      { month: 'Nov', projects: 500 },
      { month: 'Dec', deals: 400 },
    ];

    useEffect(() => {
      dispatch(setDashboard(totalsData));
    }, [totalsData]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-rapper">
        <div className="dashboard-nav">
          <div className="navigation-nav-left">
            <div className="dashboard-nav-icon">
              <Home sx={{fontSize: 30}} />
            </div>
            <div className="dashboard-nav-info">
              <h2>Dashboard</h2>
              <p>It highlights all important informartion of the business</p>
              <p>It highlights all important informartion</p>
            </div>
          </div>

          <div className="navigation-nav-right">
            <HomeOutlined />
            <p>/ Dashboard</p>
          </div>
        </div>

        <div className="dashboard-top">
          <div className="dashboard-top-item">
            <Link to='/news' className='link-main'>
              <div className="dashboard-top-header">
                <div className="dashboard-top-header-names">
                  <p><span>Total</span> News</p>
                  <h2>{totalsData.news?.total || 0}</h2>
                </div>
                <div className="dashboard-top-icon">
                  <Feed />
                </div>
              </div>
              <div className="dashboard-top-bottom">
                <p><span>{totalsData.news?.growth > 0 && '+'}{totalsData.news?.growth}%</span>From previous Month</p>
              </div>
            </Link>
          </div>
          <div className="dashboard-top-item">
            <Link to="/events" className="link-main">
              <div className="dashboard-top-header">
                <div className="dashboard-top-header-names">
                  <p><span>Total</span> Events</p>
                  <h2>{totalsData.events?.total || 0}</h2>
                </div>
                <div className="dashboard-top-icon">
                  <CalendarMonth />
                </div>
              </div>
              <div className="dashboard-top-bottom"> 
                <p><span>{totalsData.events?.growth > 0 && '+'}{totalsData.events?.growth}%</span>From previous Month</p>
              </div>
            </Link>
          </div>
          <div className="dashboard-top-item">
            <Link to='/projects' className="link-main">
              <div className="dashboard-top-header">
                <div className="dashboard-top-header-names">
                  <p><span>Total</span> Projects</p>
                  <h2>{totalsData.projects?.total || 0}</h2>
                </div>
                <div className="dashboard-top-icon">
                  <Work />
                </div>
              </div>
              <div className="dashboard-top-bottom">
                <p><span>{totalsData.projects?.growth > 0 && '+'}{totalsData.projects?.growth}%</span>From previous Month</p>
              </div>
            </Link>
          </div>
          <div className="dashboard-top-item">
            <Link to="/messages" className="link-main">
              <div className="dashboard-top-header">
                <div className="dashboard-top-header-names">
                  <p><span>Total</span> Users</p>
                  <h2>{totalsData.users?.total || 0}</h2>
                </div>
                <div className="dashboard-top-icon">
                  <People />
                </div>
              </div>
              <div className="dashboard-top-bottom">
                <p><span>{totalsData.users?.growth > 0 && '+'}{totalsData.users?.growth}%</span>From previous Month</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="dashboard-sales">
          <div className="dashboard-sales-left">
            <h2>Projects Analytics</h2>
            <div className="dashboard-sales-chart">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dealsData} margin={{ top: 20, right: 3, left: 2, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="projects" fill="#084442" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="dashboard-sales-right">
            <div className="dashboard-sales-item">
                <div className="dashboard-sales-item-left">
                    <p>Innovation</p>
                    <h2 className="royalblue-font">95%</h2>
                    <p>Jan 20 - Mar 01 ({year})</p>
                </div>
                <div className="dashboard-sales-item-right">
                    <div className="dashboard-sales-icon sales-icon-1">
                        <Lightbulb />
                    </div>
                </div>
            </div>
            <div className="dashboard-sales-item">
                <div className="dashboard-sales-item-left">
                    <p>Reliability</p>
                    <h2 className="royalgold-font">99.9% <span>Uptime</span></h2>
                    <p>Jan 20 - Mar 01 ({year})</p>
                </div>
                <div className="dashboard-sales-item-right">
                    <div className="dashboard-sales-icon sales-icon-3">
                        <Verified />
                    </div>
                </div>
            </div>
            <div className="dashboard-sales-item">
                <div className="dashboard-sales-item-left">
                    <p>Sustainability</p>
                    <h2 className="royalgreen-font">80% <span>Efficiency</span></h2>
                    <p>Jan 20 - Mar 01 ({year})</p>
                </div>
                <div className="dashboard-sales-item-right">
                    <div className="dashboard-sales-icon sales-icon-2">
                        <EnergySavingsLeaf />
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="dashboard-progress-container">
          <h1>Progress</h1>
          <div className="dashboard-progress">
            <div className="dashboard-progress-item">
              <p>Published project</p>
              <h2>532 <span>+1.69%</span></h2>
              <Slider value={20} sx={{ color: '#126865ff' }} aria-label="Default" valueLabelDisplay="auto" />
            </div>
            <div className="dashboard-progress-item royalred-font">
              <p>Complete Task</p>
              <h2>4, 569 <span>-0.5%</span></h2>
              <Slider value={50} sx={{ color: '#126865ff' }} aria-label="Default" valueLabelDisplay="auto" />
            </div>
            <div className="dashboard-progress-item">
              <p>Successfully Task</p>
              <h2>84% <span>+0.99%</span></h2>
              <Slider value={80} sx={{ color: '#126865ff' }} aria-label="Default" valueLabelDisplay="auto" />
            </div>
            <div className="dashboard-progress-item">
              <p>Ongoing project</p>
              <h2>365 <span>+0.35%</span></h2>
              <Slider value={40} sx={{ color: '#126865ff' }} aria-label="Default" valueLabelDisplay="auto" />
            </div>
          </div>
        </div>

        <div className="dashboard-updates">
          <div className="dashboard-updates-item">
            <div className="dashboard-updates-top">
              <h2>Recent News</h2>
              <Feed sx={{color: "#126865ff"}} />
            </div>
            <div className="dashboard-updates-body">
              {Array.isArray(recentData.news) && recentData.news
                .slice(0, 5)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
                .map((item, id) => (
                <div key={id} className="dashboard-updates-profile">
                  <div className="dashboard-updates-img">
                    <img src={item.img || 'https://groundwater.org/wp-content/uploads/2022/07/news-placeholder.png'} alt="US" />
                  </div>
                  <div className="dashboard-updates-desc">
                    <p>{item.header}</p>
                    <p>Created {moment(item.createdAt).fromNow()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-updates-item">
            <div className="dashboard-updates-top">
              <h2>Upcoming Events</h2>
              <CalendarMonth sx={{color: "#126865ff"}} />
            </div>
            <div className="dashboard-updates-body">
              {Array.isArray(recentData.upcomingEvents) && recentData.upcomingEvents
                .slice(0, 5)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
                .map((item, id) => (
                <div key={id} className="dashboard-updates-profile">
                  <div className="dashboard-updates-img">
                    <img src="https://i.pinimg.com/originals/4c/98/5f/4c985ff32df376a36599eaa38a1f0597.jpg" alt="US" />
                  </div>
                  <div className="dashboard-updates-desc">
                    <p>{item.header}</p>
                    <p>Date: {item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-updates-item">
            <div className="dashboard-updates-top">
              <h2>New Users</h2>
              <People sx={{color: "#126865ff"}} />
            </div>
            <div className="dashboard-updates-body">
              {Array.isArray(recentData.newUsers) && recentData.newUsers
                .slice(0, 5)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
                .map((user, id) => (
                <div key={id} className="dashboard-updates-profile">
                  <div className="dashboard-updates-img">
                    <img src={user.img || "https://www.kindpng.com/picc/m/235-2351000_login-icon-png-transparent-png.png"} alt="US" />
                  </div>
                  <div className="dashboard-updates-desc">
                    <p>{user.username}</p>
                    <p>Joined {moment(user.createdAt).fromNow()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard