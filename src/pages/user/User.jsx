import { Link, useLocation } from 'react-router-dom';
import './user.css'
import { useState } from 'react';
import { AdminPanelSettings, Book, LocationSearching, Mail, Person, PhoneAndroid, Publish, Wc,} from "@mui/icons-material";
import { useGetUserByIdQuery } from '../../services/usersApi';
import { CircularProgress } from '@mui/material';
import moment from 'moment';
import { DataGrid } from '@mui/x-data-grid';

const User = () => {
    const [inputs, setInputs] =  useState({});
    const location = useLocation();
    const userId = location.pathname.split("/")[2];

    const { data: user, isLoading, isFetching, error, } = useGetUserByIdQuery(userId);
    const { data: projects, isLoading: projectsIsLoading, error: projectsError, } = useGetUserByIdQuery(userId);

    const handleChange = (e) => {
        setInputs((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
    };
    
    const handleUpdate = (e) => {
        e.preventDefault();
        const id = userId;
        const user = { ...inputs };
    }

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

    if (isLoading) return <div>Loading user...</div>;
    if (error) return <div>Error Loading user...</div>;

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">USER</h1>
        <Link to="/create-user">
          <button className="userAddButton">Create</button>
        </Link>
      </div>

      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src={user.img || "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"}
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{user.username}</span>
              <span className="userShowUserTitle">user</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Users Details</span>

            <div className="userShowInfo">
              <Person className="userShowIcon" />
              <span className="userShowInfoTitle Capitalize">{user.username}</span>
            </div>
            <div className="userShowInfo">
              <Mail className="userShowIcon" />
              <span className="userShowInfoTitle">{user.email}</span>
            </div>
            <div className="userShowInfo">
              <Book className="userShowIcon" />
              <span className="userShowInfoTitle Capitalize">{user.gender || "Undefined"}</span>
            </div>

            <span className="userShowTitle">Account Details</span>

            <div className="userShowInfo">
              <AdminPanelSettings className="userShowIcon" />
              <span className="userShowInfoTitle Capitalize">{user.isAdmin ? "Admin": "Not admin"}</span>
            </div>
            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon" />
              <span className="userShowInfoTitle Capitalize">{user.isActive ? "Active": "In active"}</span>
            </div>
            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon" />
              <span className="userShowInfoTitle Capitalize">{user.isVerified ? "Verified": "Not verified"}</span>
            </div>

            <span className="userShowTitle">Bio</span>

            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon" />
              <span className="userShowInfoTitle Capitalize">{user.bio || "No bio"}</span>
            </div>
          </div>
        </div>

        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>

          <form className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder={user.username}
                  className="userUpdateInput"
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  placeholder={user.email}
                  className="userUpdateInput"
                  name="email"
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Phone</label>
                <input
                  type="text"
                  placeholder={user.phoneNumber}
                  name="phoneNumber"
                  className="userUpdateInput"
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Gender</label>
                <select className="newUserSelect" name="gender" id="active" onChange={handleChange}>
                    <option value="male">male</option>
                    <option value="female">female</option>
                </select>
              </div>
              <div className="userUpdateItem">
                <label>isAdmin</label>
                <select className="newUserSelect" name="isAdmin" id="active" onChange={handleChange}>
                    <option value="no">no</option>
                    <option value="yes">yes</option>
                </select>
              </div>
            </div>
          </form>

          <div className="productBottom_button">
            <div className="productButton-container userUpdate-button">
                <div onClick={handleUpdate} className='update-button'>
                    {isFetching && !error ? <CircularProgress sx={{color: "white"}} size={30} /> : <p>UPDATE</p>}
                </div>

                {error && <p style={{color: "red"}}>error occurred</p>} 
            </div>

            <div className="productButton-container userUpdate-button">
                <div onClick={handleUpdate} className='update-button' style={{background: 'red'}}>
                    {isFetching && !error ? <CircularProgress sx={{color: "white"}} size={30} /> : <p>DELETE</p>}
                </div>

                {error && <p style={{color: "red"}}>error occurred</p>} 
            </div>
          </div>
        </div>
      </div>

      <div className="userProjects">
        <h2>USER PROJECTS</h2>
        <div className="news-table">
            <div className="datagrid_large">
                <DataGrid 
                    rows={projects}
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
                    rows={projects}
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
    </div>
  )
}

export default User