import { Link, useLocation } from 'react-router-dom';
import './event.css'
import { useEffect, useState } from 'react';
import { useDeleteEventMutation, useGetEventByIdQuery, useUpdateEventMutation } from '../../services/eventsApi';
import moment from 'moment';
import { Photo } from '@mui/icons-material';
import { CircularProgress, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { Alert, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


const Event = () => {
    const location = useLocation();
    const eventId = location.pathname.split("/")[2];
    
    const { data: event, isLoading, error } = useGetEventByIdQuery(eventId);
    const [updateEvent, { isLoading: updating }] = useUpdateEventMutation();
    const [deleteEvent, { isLoading: deleting }] = useDeleteEventMutation();

    const [formData, setFormData] = useState({
        header: '',
        location: '',
        category: '',
        desc: '',
        date: null,
        startTime: null,
        endTime: null,
    });
    
    const [success, setSuccess] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    // Populate form when event loads
    useEffect(() => {
        if (event) {
            setFormData({
            header: event.header || '',
            location: event.location || '',
            category: event.category || '',
            desc: event.desc || '',
            date: event.date ? dayjs(event.date, 'DD/MM/YYYY') : null,
            startTime: event.start ? dayjs(event.start, 'hh:mm A') : null,
            endTime: event.end ? dayjs(event.end, 'hh:mm A') : null,
            });
        }
    }, [event]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!formData.date || !formData.startTime || !formData.endTime) {
            alert('Please fill in date and time');
        return;
        }

        const payload = {
            header: formData.header.trim(),
            location: formData.location.trim(),
            category: formData.category.trim(),
            desc: formData.desc.trim(),
            date: formData.date.format('DD/MM/YYYY'),
            start: formData.startTime.format('hh:mm A'),
            end: formData.endTime.format('hh:mm A'),
        };

        try {
            await updateEvent({ id: eventId, ...payload }).unwrap();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) {
            setDeleteConfirm(true);
            setTimeout(() => setDeleteConfirm(false), 5000); // Auto-hide after 5s
           return;
        }

        try {
            await deleteEvent(eventId).unwrap();
            navigate('/events'); // Redirect after delete
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };
    
    if (isLoading) return <div>Loading events...</div>;
    if (error) return <div>Error Loading events...</div>;
    
    
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="product">
            <div className="productTitleContainer">
                <h1 className="productTitle">Events Details</h1>
                <Link to="/create-events">
                    <button className="productAddButton">Create</button>
                </Link>
            </div>

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>Event updated successfully!</Alert>
            )}

            <div className="productTop">
                <div className="productTopLeft">
                    <div className="roomImage">
                    <img src="https://i.pinimg.com/originals/4c/98/5f/4c985ff32df376a36599eaa38a1f0597.jpg" alt="PR" />
                    </div>
                </div>
                <div className="productTopRight">
                    <div className="productInfoTop">
                        <span className="productName">{event.header}</span>
                    </div>
                    <div className="productInfoBottom">
                        <div className="productInfoItem">
                            <span className="productInfoKey">Id:</span>
                            <span className="productInfoValue">{event._id}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Location:</span>
                            <span className="productInfoValue">{event.location}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Category:</span>
                            <span className="productInfoValue">{event.category}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Date:</span>
                            <span className="productInfoValue">{event.date}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Starts:</span>
                            <span className="productInfoValue">{event.start}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Ends:</span>
                            <span className="productInfoValue">{event.end}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Favorites:</span>
                            <span className="productInfoValue">{event.favorites.length}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Created:</span>
                            <span className="productInfoValue">{moment(event.createdAt).fromNow()}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Updated:</span>
                            <span className="productInfoValue">{moment(event.updatedAt).fromNow()}</span>
                        </div>
                        <div className="productInfoItemm">
                            <p>{event.desc}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="productBottom">
                <form className="productForm">
                    <div className="productFormLeft">
                        <div className="productFormLeft-title">
                            <p>UPDATE</p>
                        </div>

                        <div className="productFormLeft-container">
                            <div className="productFormLeft-item">
                                <div className="updateProductItem">
                                    <TextField
                                        label="Title"
                                        fullWidth
                                        value={formData.header}
                                        onChange={(e) => setFormData({ ...formData, header: e.target.value })}
                                        sx={{ mb: 3 }}
                                    />
                                </div>
                                <div className="updateProductItem">
                                    <TextField
                                        label="Location"
                                        fullWidth
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        sx={{ mb: 3 }}
                                    />
                                </div>
                                <div className="updateProductItem">
                                    <TextField
                                        label="Category"
                                        fullWidth
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        sx={{ mb: 3 }}
                                    />
                                </div>
                                <div className="updateProductItem">
                                    <DatePicker
                                        label="Date"
                                        value={formData.date}
                                        onChange={(d) => setFormData({ ...formData, date: d })}
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { fullWidth: true } }}
                                        sx={{ mb: 3 }}
                                    />
                                </div>
                            </div>

                            <div className="productFormLeft-item">
                                <div className="updateProductItem">
                                    <TimePicker
                                        label="Start Time"
                                        value={formData.startTime}
                                        onChange={(t) => setFormData({ ...formData, startTime: t })}
                                        ampm
                                        slotProps={{ textField: { fullWidth: true } }}
                                        sx={{ mb: 3 }}
                                    />
                                </div>
                                <div className="updateProductItem">
                                    <TimePicker
                                        label="End Time"
                                        value={formData.endTime}
                                        onChange={(t) => setFormData({ ...formData, endTime: t })}
                                        ampm
                                        slotProps={{ textField: { fullWidth: true } }}
                                        sx={{ mb: 3 }}
                                    />
                                </div>                      
                                <div className="updateProductItem">
                                    <TextField
                                        label="Description"
                                        multiline
                                        rows={5}
                                        fullWidth
                                        value={formData.desc}
                                        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                    />
                                </div>                      
                            </div>
                        </div>
                    </div>

                    <div className="productFormRight">
                        <div className="productsUpload-button">
                            <div className="upload_Button">
                                <Photo />
                                <p>CHOOSE IMAGE</p>
                            </div>

                            <div className="upload_Img">
                                <img src="https://i.pinimg.com/originals/4c/98/5f/4c985ff32df376a36599eaa38a1f0597.jpg" alt="Preview" />                     
                            </div>
                        </div>
                    </div>
                </form>

                <div className="productBottom_button">
                    <div className="productButton-container">
                        <div onClick={handleUpdate} className='update-button' style={{cursor: updating ? "not-allowed" : "pointer"}}>
                            {updating
                                ? <CircularProgress sx={{color: "white"}} size={30} /> 
                                : <p>UPDATE</p>
                            }
                        </div>

                        {error && <p style={{color: "red"}}>error occurred</p>} 
                    </div>

                    <div className="productButton-container">
                        <div onClick={handleDelete} className='update-button' style={{background: 'red', cursor: deleting ? "not-allowed" : "pointer"}}>
                            {deleting
                                ? (<CircularProgress sx={{color: "white"}} size={30} />)
                                : deleteConfirm ? (
                                    'CONFIRM DELETE'
                                ) : (
                                    'DELETE EVENT'
                                )
                            }
                        </div>

                        {error && <p style={{color: "red"}}>error occurred</p>} 
                    </div>
                </div>

                {deleteConfirm && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        Click <strong>CONFIRM DELETE</strong> again to permanently delete this event.
                    </Alert>
                )}
            </div>
        </div>        
    </LocalizationProvider>
  )
}

export default Event