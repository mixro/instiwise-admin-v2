import { useState } from "react";
import "./requests.css"
import { useTheme } from "../../context/ThemeContext";
import { useGetAllDemoRequestsQuery, useGetDemoRequestAnalyticsQuery } from "../../services/requestsApi";
import CountUp from 'react-countup';
import moment from 'moment';
import { CalendarMonth, Feed, FileDownload, Search } from '@mui/icons-material';
import { DataGrid } from "@mui/x-data-grid";
import { Link } from 'react-router-dom';

const Requests = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { theme } = useTheme();
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const { data: requests = [], isLoading } = useGetAllDemoRequestsQuery();
    const { data: requetsAnalytics = {} } = useGetDemoRequestAnalyticsQuery();

    const grossMetrics = requetsAnalytics.grossMetrics || {}; 
    const summaryData = requetsAnalytics.summary || {};

    const filteredRequests = Array.isArray(requests) && requests.filter((item) => {
        const requestFullName = item.fullName.toLowerCase();
        const requestEmail = item.email.toLowerCase();
        const requestInstituteName = item.instituteName.toLowerCase();
        const requestDesignation = item.designation.toLowerCase();

        const query = searchQuery.toLowerCase();
        return (
            requestFullName.includes(query) || requestEmail.includes(query) || requestInstituteName.includes(query) || requestDesignation.includes(query)
        )
    })

    const sortedrequests = [...filteredRequests].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    })

    const columns = [
        {
            field: 'fullName',
            headerName: 'NAME',
            width: 120,
        },
        {
            field: 'email',
            headerName: 'EMAIL',
            width: 100,
        },
        {
            field: "instituteName",
            headerName: "INSTITUTE",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="newsHeader">
                        <p className="news_Title">{params.row.instituteName}</p>
                    </div>
                );
            },
        },
        { field: "message", headerName: "MESSAGE", width: 100 },
        { field: "phone", headerName: "PHONE", width: 100 },
        { field: "designation", headerName: "DESIGNATION", width: 100 },
        { 
            field: "studentStrength", 
            headerName: "STUDENTS", 
            width: 100,
            renderCell: (params) => {
                return (
                <div>
                    <p className='text-center'>{params.row.studentStrength}</p>
                </div>
                )
            }
        },
        { 
            field: "status", 
            headerName: "STATUS", 
            width: 120,
            renderCell: (params) => {
                return (
                <div className="status-button">
                    <button className={`${params.row.status}`}>{params.row.status}</button>
                </div>
                )
            }
        },
        {
            field: "createdAt",
            headerName: "CREATED AT",
            width: 130,
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
                        <Link to={"/news/" + params.row._id}>
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
            <div className="news-search" style={{borderColor: theme.sidebar_bg}}>
                <input 
                    type="text" 
                    placeholder='Search here..' 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{color: theme.text }}
                />
                <div className="newsearch-icon" style={{background: theme.sidebar_bg, color: theme.text_sidebar}}>
                    <Search />
                </div>
            </div>
            <div className="newsTop-details">
                <div className="news-detail" style={{borderColor: theme.sidebar_bg}}>
                    <CalendarMonth />
                    <p>{formattedDate}</p>
                </div>
                <div className="news-detail" style={{borderColor: theme.sidebar_bg, background: theme.sidebar_bg, color: "#fff"}}>
                    <FileDownload />
                    <p>Export</p>
                </div>
            </div>
        </div>

        <div className="news-metrics">
            <div className="news-metrics-left" style={{background: theme.sidebar_bg}}>
                <div className="newsTop_header">
                    <p className='totalnews-header'>TOTAL NEWS</p>
                    <Feed sx={{fontSize: 30}} />
                </div>
                <div className="newsTop-number">
                    <CountUp
                        start={0}
                        end={grossMetrics?.totalRequests || 0}
                        duration={0.4}
                        separator=', '
                    />
                </div>
                <div className="newsSummary-details">
                    <p>pending: <span>{grossMetrics.pending}</span></p>
                    <p>scheduled: <span>{grossMetrics.scheduled}</span></p>
                    <p>completed: <span>{grossMetrics.completed}</span></p>
                    <p>rejected: <span>{grossMetrics.rejected}</span></p>
                </div>
            </div>

            <div className="news-metrics-right" style={{borderColor: theme.sidebar_bg}}>
                {Object.entries(summaryData || {}).map(([period, metric]) => (
                    <div className="newsSummary-item" key={period}>
                        <h2>{period}</h2>
                        <div className="newssTotalNumber">
                            <p>{metric.total.toLocaleString()}</p>
                        </div>
                        <div className="details-summary-data">
                            <div className="newssTimely-data">
                                <div className="statsCircle pending-circle"></div>
                                <p>pending: <span>{metric.pending.toLocaleString()}</span></p>
                            </div>
                            <div className="newssTimely-data">
                                <div className="statsCircle scheduled-circle"></div>
                                <p>scheduled: <span>{metric.scheduled.toLocaleString()}</span></p>
                            </div>
                            <div className="newssTimely-data">
                                <div className="statsCircle completed-circle"></div>
                                <p>completed: <span>{metric.completed.toLocaleString()}</span></p>
                            </div>
                            <div className="newssTimely-data">
                                <div className="statsCircle rejected-circle"></div>
                                <p>rejected: <span>{metric.rejected.toLocaleString()}</span></p>
                            </div>
                            <div className="newssTimely-data timely_amount_metrics">
                                <p style={{color: "blue"}}>growth: <span>{metric.growth.toLocaleString()}%</span></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="news-table">
            <div className="datagrid_large">
                <DataGrid 
                    rows={sortedrequests}
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
                    rows={sortedrequests}
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

export default Requests