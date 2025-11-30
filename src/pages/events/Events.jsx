import { useState } from 'react';
import './events.css'
import { useTheme } from '../../context/ThemeContext';
import { useGetEventsAnalyticsQuery, useGetEventsQuery } from '../../services/eventsApi';
import { CalendarMonth, FileDownload, Search } from '@mui/icons-material';
import CountUp from 'react-countup';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const Events = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { theme } = useTheme();
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const { data: events = [], isLoading } = useGetEventsQuery();
    const { data: eventsAnalytics = {} } = useGetEventsAnalyticsQuery();

    const grossMetrics = eventsAnalytics.grossMetrics || {}; 
    const summaryData = eventsAnalytics.summary || {};

    const filteredEvents = Array.isArray(events) && events.filter((event) => {
        const eventHeader = event.header.toLowerCase();
        const eventLocation = event.location.toLowerCase();
        const eventCategory = event.category.toLowerCase();

        const query = searchQuery.toLowerCase();
        return (
            eventHeader.includes(query) || eventLocation.includes(query) || eventCategory.includes(query)
        )
    })

    const sortedEvents = [...filteredEvents].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    })

    const columns = [
        { field: '_id', headerName: 'ID', width: 80, },
        {
            field: "header",
            headerName: "TITLE",
            width: 250,
            renderCell: (params) => {
                return (
                    <div className="newsHeader">
                        <p className="news_Title">{params.row.header}</p>
                    </div>
                );
            },
        },
        { field: "desc", headerName: "DESC", width: 140 },
        { field: "location", headerName: "LOCATION", width: 140 },
        { field: "category", headerName: "CATEGORY", width: 140 },
        { field: "date", headerName: "DATE", width: 140 },
        { field: "start", headerName: "START", width: 140 },
        { field: "end", headerName: "END", width: 140 },
        { 
            field: "favorites", 
            headerName: "FAVORITES", 
            width: 100,
            renderCell: (params) => {
                return (
                <div>
                    <p className='text-center'>{params.row.favorites.length || 0}</p>
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
                        <Link to={"/events/" + params.row._id}>
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
                    <p className='totalnews-header'>TOTAL EVENTS</p>
                    <CalendarMonth sx={{fontSize: 30}} />
                </div>
                <div className="newsTop-number">
                    <CountUp
                        start={0}
                        end={grossMetrics?.totalEvents || 0}
                        duration={0.4}
                        separator=', '
                    />
                </div>
                <div className="newsSummary-details">
                    <p>Favorites: <span>{grossMetrics.totalFavorites}</span></p>
                    <p>Avg Fav / event: <span>{grossMetrics.averageFavoritesPerEvent}</span></p>
                </div>
            </div>

            <div className="news-metrics-right" style={{borderColor: theme.green_text}}>
                {Object.entries(summaryData || {}).map(([period, metric]) => (
                    <div className="newsSummary-item" key={period}>
                        <h2>{period}</h2>
                        <div className="newssTotalNumber">
                            <p>{metric.eventsCount.toLocaleString()}</p>
                        </div>
                        <div className="details-summary-data">
                            <div className="newssTimely-data">
                                <div className="statsCircle completed-circle"></div>
                                <p>favorites: <span>{metric.favorites.toLocaleString()}</span></p>
                            </div>
                            <div className="newssTimely-data">
                                <div className="statsCircle pending-circle"></div>
                                <p>fav growth: <span>{metric.favoritesGrowth.toLocaleString()}%</span></p>
                            </div>
                            <div className="newssTimely-data">
                                <div className="amount_metrics timely_amount_metrics">
                                    <CalendarMonth sx={{fontSize: 26, color: theme.green_text}} /> 
                                    <span>Growth: {Number(metric.eventsGrowth || 0).toLocaleString()}%</span>
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
                    rows={sortedEvents}
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
                    rows={sortedEvents}
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

export default Events