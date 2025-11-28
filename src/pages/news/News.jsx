import { useState } from 'react';
import './news.css'
import CountUp from 'react-countup';
import moment from 'moment';
import { CalendarMonth, Feed, FileDownload, Search } from '@mui/icons-material';
import { useGetNewsAnalyticsQuery, useGetNewsQuery } from '../../services/newsApi';
import { useTheme } from '../../context/ThemeContext';
import { DataGrid } from "@mui/x-data-grid";
import { Link } from 'react-router-dom';

const News = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { theme } = useTheme();
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const { data: news = [], isLoading } = useGetNewsQuery();
    const { data: newsAnalytics = {} } = useGetNewsAnalyticsQuery();

    const grossMetrics = newsAnalytics.grossMetrics || {}; 
    const summaryData = newsAnalytics.summary || {};

    const filteredNews = Array.isArray(news) && news.filter((item) => {
        const newsHeader = item.header.toLowerCase();

        const query = searchQuery.toLowerCase();
        return (
            newsHeader.includes(query)
        )
    })

    const sortedNews = [...filteredNews].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    })

    const columns = [
        {
            field: '_id',
            headerName: 'ID',
            width: 80,
        },
        {
            field: "header",
            headerName: "TITLE",
            width: 250,
            renderCell: (params) => {
                return (
                    <div className="newsHeader">
                        {params.row.img && <img className="news_Img" src={params.row.img} alt="" />}
                        <p className="news_Title">{params.row.header}</p>
                    </div>
                );
            },
        },
        { field: "desc", headerName: "DESC", width: 140 },
        { 
            field: "views", 
            headerName: "VIEWS", 
            width: 100,
            renderCell: (params) => {
                return (
                <div>
                    <p className='text-center'>{params.row.views.length || 0}</p>
                </div>
                )
            }
        },
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
            field: "dislikes", 
            headerName: "DISLIKES", 
            width: 100,
            renderCell: (params) => {
                return (
                <div>
                    <p className='text-center'>{params.row.dislikes.length || 0}</p>
                </div>
                )
            }
        },
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
                    <p className='totalnews-header'>TOTAL NEWS</p>
                    <Feed sx={{fontSize: 30}} />
                </div>
                <div className="newsTop-number">
                    <CountUp
                        start={0}
                        end={grossMetrics?.totalNews || 0}
                        duration={0.4}
                        separator=', '
                    />
                </div>
                <div className="newsSummary-details">
                    <p>Views: <span>{grossMetrics.totalViews}</span></p>
                    <p>Likes: <span>{grossMetrics.totalLikes}</span></p>
                    <p>Avg Likes / news: <span>{grossMetrics.averageViewsPerNews}</span></p>
                </div>
            </div>

            <div className="news-metrics-right" style={{borderColor: theme.green_text}}>
                {Object.entries(summaryData || {}).map(([period, metric]) => (
                    <div className="newsSummary-item" key={period}>
                        <h2>{period}</h2>
                        <div className="newssTotalNumber">
                            <p>{metric.newsCount.toLocaleString()}</p>
                        </div>
                        <div className="details-summary-data">
                            <div className="newssTimely-data">
                                <div className="statsCircle completed-circle"></div>
                                <p>views: <span>{metric.views.toLocaleString()}</span></p>
                            </div>
                            <div className="newssTimely-data">
                                <div className="statsCircle pending-circle"></div>
                                <p>views growth: <span>{metric.viewsGrowth.toLocaleString()}%</span></p>
                            </div>
                            <div className="newssTimely-data">
                                <div className="amount_metrics timely_amount_metrics">
                                    <Feed sx={{fontSize: 26, color: theme.green_text}} /> 
                                    <span>Growth: {Number(metric.newsGrowth || 0).toLocaleString()}%</span>
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
                    rows={sortedNews}
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
                    rows={sortedNews}
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

export default News