import { useState } from 'react';
import './projects.css'
import { useTheme } from '../../context/ThemeContext';
import { useGetAllProjectsQuery, useGetProjectTimelyAnalyticsQuery } from '../../services/projectsApi';
import { DataGrid } from '@mui/x-data-grid';
import { CalendarMonth, FileDownload, Search, Work } from '@mui/icons-material';
import CountUp from 'react-countup';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Projects = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { theme } = useTheme();
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const { data: projects = [], isLoading } = useGetAllProjectsQuery();
    const { data: projectsAnalytics = {} } = useGetProjectTimelyAnalyticsQuery();

    const grossMetrics = projectsAnalytics.grossMetrics || {}; 
    const summaryData = projectsAnalytics.summary || {};

    const filteredProjects = Array.isArray(projects) && projects.filter((project) => {
        const projectsTitle = project.title.toLowerCase();
        const projectsCat = project.category.toLowerCase();
        const projectsOwner = project.userId.username.toLowerCase();

        const query = searchQuery.toLowerCase();
        return (
            projectsTitle.includes(query) || projectsCat.includes(query) || projectsOwner.includes(query)
        )
    })

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    })

    const columns = [
        {
            field: "title",
            headerName: "TITLE",
            width: 250,
            renderCell: (params) => {
                return (
                    <div className="newsHeader">
                        {params.row.img && <img className="news_Img" src={params.row.img} alt="" />}
                        <p className="news_Title">{params.row.title}</p>
                    </div>
                );
            },
        },
        { field: "description", headerName: "DESC", width: 140 },
        { 
            field: "userId", 
            headerName: "OWNER", 
            width: 100,
            renderCell: (params) => {
                return (
                <div>
                    <p>{params.row.userId.username }</p>
                </div>
                )
            }
        },
        { field: "category", headerName: "CATEGORY", width: 140 },
        { field: "problem", headerName: "PROBLEM", width: 140 },
        { 
            field: "likes", 
            headerName: "LIKES", 
            width: 100,
            renderCell: (params) => {
                return (
                    <div>
                        <p className='text-center'>{params.row.likes.length || 0}</p>
                    </div>
                )
            }
        },
        { 
            field: "collaborators", 
            headerName: "COLLABORATORS", 
            width: 100,
            renderCell: (params) => {
                return (
                    <div>
                        <p className='text-center'>{params.row.collaborators.length || 0}</p>
                    </div>
                )
            }
        },
        { field: "status", headerName: "STATUS", width: 140 },
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
                        <Link to={"/projects/" + params.row._id}>
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
                    <p className='totalnews-header'>TOTAL PROJECTS</p>
                    <Work sx={{fontSize: 30}} />
                </div>
                <div className="newsTop-number">
                    <CountUp
                        start={0}
                        end={grossMetrics?.totalProjects || 0}
                        duration={0.4}
                        separator=', '
                    />
                </div>
                <div className="newsSummary-details">
                    <p>Likes: <span>{grossMetrics.totalLikes}</span></p>
                    <p>Avg Likes / projects: <span>{grossMetrics.averageLikesPerProject}</span></p>
                </div>
            </div>

            <div className="news-metrics-right" style={{borderColor: theme.green_text}}>
                {Object.entries(summaryData || {}).map(([period, metric]) => (
                    <div className="newsSummary-item" key={period}>
                        <h2>{period}</h2>
                        <div className="newssTotalNumber">
                            <p>{metric.projectsCount.toLocaleString()}</p>
                        </div>
                        <div className="details-summary-data">
                            <div className="newssTimely-data">
                                <div className="statsCircle completed-circle"></div>
                                <p>likes: <span>{metric.likes.toLocaleString()}</span></p>
                            </div>
                            <div className="newssTimely-data">
                                <div className="statsCircle pending-circle"></div>
                                <p>likes growth: <span>{metric.likesGrowth.toLocaleString()}%</span></p>
                            </div>
                            <div className="newssTimely-data">
                                <div className="amount_metrics timely_amount_metrics">
                                    <Work sx={{fontSize: 26, color: theme.green_text}} /> 
                                    <span>Growth: {Number(metric.projectsGrowth || 0).toLocaleString()}%</span>
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
                    rows={sortedProjects}
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
                    rows={sortedProjects}
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

export default Projects