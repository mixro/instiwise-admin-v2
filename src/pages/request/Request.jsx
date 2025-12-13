import { Link, useNavigate, useParams } from 'react-router-dom';
import './request.css'
import { useDeleteDemoRequestMutation, useGetDemoRequestByIdQuery, useUpdateDemoRequestMutation } from '../../services/requestsApi';
import { useAuth } from '../../hooks/useAuth';
import moment from 'moment';
import { Call, Download, Preview } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Alert, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const Request = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const { data: request, isLoading, error } = useGetDemoRequestByIdQuery(id);
    const [updateRequest, { isLoading: updating }] = useUpdateDemoRequestMutation();
    const [deleteRequest, { isLoading: deleting }] = useDeleteDemoRequestMutation();

    const [status, setStatus] = useState('');
    const [success, setSuccess] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    
    // Pre-fill status when request loads
    useEffect(() => {
        if (request) {
          setStatus(request.status || 'pending');
        }
    }, [request]);
    
    const handleUpdate = async () => {
        if (!status) {
          alert('Please select a status');
          return;
        }
    
        try {
          await updateRequest({
            id,
            status,
            respondedBy: user._id, // Auto-set current admin as responder
          }).unwrap();
    
          setSuccess(true);
          setTimeout(() => setSuccess(false), 4000);
        } catch (err) {
          console.error('Update failed:', err);
        }
    };
    
    const handleDelete = async () => {
        if (!deleteConfirm) {
          setDeleteConfirm(true);
          setTimeout(() => setDeleteConfirm(false), 8000);
          return;
        }
    
        try {
          await deleteRequest(id).unwrap();
          navigate('/requests');
        } catch (err) {
          console.error('Delete failed:', err);
        }
    };

    if (isLoading) return <div>Loading request...</div>;
    if (error) return <div>Error Loading request...</div>;
    
  return (
    <div className="product">
        <div className="productTitleContainer">
            <h1 className="productTitle">Request Details</h1>
            <Link to="/requests">
                <button className="productAddButton">Requests</button>
            </Link>
        </div>

        {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
                Request updated successfully!
            </Alert>
        )}

        <div className="request-body">
            <div className="request-left">
                <p className="request-title">Sender's details</p>
                <div className="request_item">
                    <p>Name:</p>
                    <p>{request.fullName}</p>
                </div>
                <div className="request_item">
                    <p>Email:</p>
                    <p>{request.email}</p>
                </div>
                <div className="request_item">
                    <p>Phone:</p>
                    <p>{request.phone}</p>
                </div>

                <p className="request-title pt-20">University details</p>
                <div className="request_item">
                    <p>Institute:</p>
                    <p>{request.instituteName}</p>
                </div>
                <div className="request_item">
                    <p>Designation:</p>
                    <p>{request.designation}</p>
                </div>
                <div className="request_item">
                    <p>Students:</p>
                    <p>{request.studentStrength}</p>
                </div>

                <p className="request-title pt-20">Request details</p>
                <div className="request_item">
                    <p>Status:</p>
                    <button className={`${request.status}`}>{request.status}</button>
                </div>
                <div className="request_item">
                    <p>Responded by:</p>
                    <p>{request?.respondedBy?.username || "null"}</p>
                </div>
                <div className="request_item">
                    <p>Created:</p>
                    <p>{moment(request.createdAt).fromNow()}</p>
                </div>
                <div className="request_item">
                    <p>Updated:</p>
                    <p>{moment(request.updatedAt).fromNow()}</p>
                </div>

                <p className="request-title pt-20">Message</p>
                <div>
                    <p>{request.message.toLowerCase()}</p>
                </div>
            </div>

            <div className="request-right">
                <div className="requestRight-top">
                    <h2>UPDATE</h2>
                    
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            label="Status"
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="scheduled">Scheduled</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <div className="request-button">
                        <div className='requestUpdate'>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleUpdate}
                                disabled={updating}
                                sx={{
                                    mb: 2,
                                    background: '#126865',
                                    '&:hover': { background: '#0d9488' },
                                }}
                            >
                                {updating ? <CircularProgress size={24} color="inherit" /> : 'UPDATE STATUS'}
                            </Button>

                            <Button
                                variant="contained"
                                fullWidth
                                color={deleteConfirm ? 'error' : 'secondary'}
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? <CircularProgress size={24} color="inherit" /> : deleteConfirm ? 'CONFIRM DELETE' : 'DELETE REQUEST'}
                            </Button>

                            {deleteConfirm && (
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    Click <strong>CONFIRM DELETE</strong> again to permanently delete.
                                </Alert>
                            )}
                        </div>
                    </div> 
                </div>

                <div className="requestRight-bottom">
                    <h2 className="request-header">Extra Info</h2>
                    <div className="requestInfos">
                        <p><Download sx={{fontSize: {xs: 24, sm: 24, md: 28}}} /> <span>Export request details</span> </p>
                        <p><Preview sx={{fontSize: {xs: 24, sm: 24, md: 28}}} /> <span>View previous requests from this sender</span> </p>
                        <p><Call sx={{fontSize: {xs: 24, sm: 24, md: 28}}} /> <span>Contact Sender</span> </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Request