import './users.css'
import { useState } from 'react';
import CountUp from 'react-countup';
import moment from 'moment';
import { DataGrid } from "@mui/x-data-grid";
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useGetAllUsersQuery, useGetUserTimelyAnalyticsQuery } from '../../services/usersApi';
import { CalendarMonth, FileDownload, People, PeopleAlt, Search } from '@mui/icons-material';

const Users = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { theme } = useTheme();
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const { data: users = [], isLoading } = useGetAllUsersQuery();
    const { data: usersAnalytics = {} } = useGetUserTimelyAnalyticsQuery();

    const grossMetrics = usersAnalytics.grossMetrics || {}; 
    const summaryData = usersAnalytics.summary || {};

    const filteredUsers = Array.isArray(users) && users.filter((user) => {
        const username = user.username.toLowerCase();
        const email = user.email.toLowerCase();

        const query = searchQuery.toLowerCase();
        return (
            username.includes(query) || email.includes(query)
        )
    })

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    })

    const columns = [
        {
            field: '_id',
            headerName: 'ID',
            width: 120,
        },
        {
            field: "username",
            headerName: "NAME",
            width: 240,
            renderCell: (params) => {
                return (
                    <div className="newsHeader">
                        {<img className="news_Img" style={{borderRadius: 50, width: 40, height: 40}} 
                            src={params.row.img || "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"} alt="" />
                        }
                        <p className="news_Title">{params.row.username}</p>
                    </div>
                );
            },
        },
        { field: "email", headerName: "EMAIL", width: 180 },
        { field: "isAdmin", headerName: "IsAdmin", width: 110 },
        { field: "isActive", headerName: "IsActive", width: 110 },
        { field: "isVerified", headerName: "IsVerified", width: 110 },
        {
            field: "createdAt",
            headerName: "CREATED AT",
            width: 140,
            renderCell: (params) => {
                return <span>{moment(params.row.createdAt).fromNow()}</span>;
            },
        },
        {
            field: "action",
            headerName: "ACTION",
            width: 120,
            renderCell: (params) => {
                return (
                    <div className="newsButtons">
                        <Link to={"/users/" + params.row._id}>
                            <button className='viewButton'>view</button>
                        </Link>
                    </div>
                );
            },
        },
    ];

  return (
    <div className="news-comp">
        <div className="news-top">
            <div className="news-search" style={{borderColor: theme.green_text}}>
                <input 
                    type="text" 
                    placeholder='Search here..' 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{color: theme.text }}
                />
                <div className="newsearch-icon" style={{background: theme.green_text, color: theme.text_sidebar}}>
                    <Search />
                </div>
            </div>
            <div className="newsTop-details">
                <div className="news-detail" style={{borderColor: theme.green_text}}>
                    <CalendarMonth />
                    <p>{formattedDate}</p>
                </div>
                <div className="news-detail" style={{borderColor: theme.green_text, background: theme.green_text, color: "#fff"}}>
                    <FileDownload />
                    <p>Export</p>
                </div>
            </div>
        </div>

        <div className="news-metrics">
            <div className="news-metrics-left" style={{background: theme.green_text}}>
                <div className="newsTop_header">
                    <p className='totalnews-header'>TOTAL USERS</p>
                    <PeopleAlt sx={{fontSize: 30}} />
                </div>
                <div className="newsTop-number">
                    <CountUp
                        start={0}
                        end={grossMetrics?.totalUsers || 0}
                        duration={0.4}
                        separator=', '
                    />
                </div>
                <div className="newsSummary-details">
                    <p>Verified: <span>{grossMetrics.totalVerified}</span></p>
                    <p>By google: <span>{grossMetrics?.registrationSources?.google ?? 0}</span></p>
                    <p>By password: <span>{grossMetrics?.registrationSources?.emailPassword ?? 0}</span></p>
                </div>
            </div>

            <div className="news-metrics-right" style={{borderColor: theme.green_text}}>
                {Object.entries(summaryData || {}).map(([period, metric]) => (
                    <div className="newsSummary-item" key={period}>
                        <h2>{period}</h2>
                        <div className="newssTotalNumber">
                            <p>{metric.activeUsers.toLocaleString()}</p>
                        </div>
                        <div className="details-summary-data">
                            <div className="newssTimely-data">
                                <div className="statsCircle completed-circle"></div>
                                <p>new users: <span>{metric.newUsers.toLocaleString()}</span></p>
                            </div>
                            <div className="newssTimely-data">
                                <div className="statsCircle pending-circle"></div>
                                <p>new users growth: <span>{metric.newUsersGrowth.toLocaleString()}%</span></p>
                            </div>
                            <div className="newssTimely-data">
                                <div className="amount_metrics timely_amount_metrics">
                                    <PeopleAlt sx={{fontSize: 26, color: theme.green_text}} /> 
                                    <span>Growth: {Number(metric.activeUsersGrowth || 0).toLocaleString()}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="news-table">
            <div className="datagrid_large">
                <DataGrid 
                    rows={sortedUsers}
                    disableSelectionOnClick
                    columns={columns}
                    getRowId={(row) => row._id}
                    pageSize={8}
                    checkboxSelection
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            fontWeight: 'bold'
                        },
                    }}
                />
            </div>
            <div className="datagrid_small">
                <DataGrid 
                    rows={sortedUsers}
                    disableSelectionOnClick
                    columns={columns}
                    getRowId={(row) => row._id}
                    pageSize={8}
                    checkboxSelection
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            fontWeight: 'bold'
                        },
                    }}
                />
            </div>
        </div>            
    </div>
  )
}

export default Users