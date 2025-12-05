import { useState } from 'react';
import { useCreateEventMutation } from '../../services/eventsApi';
import './newEvent.css'
import { TextField, Button, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Photo } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';


const NewEvent = () => {
    const { user } = useAuth();
    const [showSuccess, setShowSuccess] = useState(false);
    const [createEvent, { isLoading: submitting, error }] = useCreateEventMutation();
    
    const [formData, setFormData] = useState({
        header: '',
        location: '',
        category: '',
        description: '',
        date: null,        // dayjs object
        startTime: null,   // dayjs object
        endTime: null,     // dayjs object
    });
    
    // Format date to "DD/MM/YYYY"
    const formatDate = (date) => {
      if (!date) return '';
      return date.format('DD/MM/YYYY');
    };

    // Format time to "09:00 AM"
    const formatTime = (time) => {
      if (!time) return '';
      return time.format('hh:mm A');
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.date || !formData.startTime || !formData.endTime) {
        alert('Please select date and time');
        return;
      }

      const payload = {
        userId: user._id,
        header: formData.header,
        location: formData.location,
        category: formData.category,
        desc: formData.description,
        date: formatDate(formData.date),
        start: formatTime(formData.startTime),
        end: formatTime(formData.endTime),
      };

      try {
        await createEvent(payload).unwrap();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        // Reset form
        setFormData({
          header: '', location: '', category: '', description: '',
          date: null, startTime: null, endTime: null,
        });
      } catch (err) {
        console.error('Failed to create event:', err);
      }
    };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="newProduct">
          <h1 className="addProductTitle">NEW EVENT</h1>

          {showSuccess && (
            <div style={{ padding: '1rem', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '1rem' }}>
              Event created successfully!
            </div>
          )}

          <form className="addProductForm" onSubmit={handleSubmit}>
          <div className="addProduct_container">
            {/* Left Column */}
            <div className="addProduct_left">
              <TextField
                className='event_input'
                label="Event Title"
                name="header"
                fullWidth
                variant="outlined"
                value={formData.header}
                onChange={(e) => setFormData({ ...formData, header: e.target.value })}
                sx={{ mb: 3 }}
                required
              />

              <TextField
                className='event_input'
                label="Location"
                name="location"
                fullWidth
                variant="outlined"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                sx={{ mb: 3 }}
                required
              />

              <TextField
                className='event_input'
                label="Category"
                name="category"
                fullWidth
                variant="outlined"
                placeholder="e.g. Workshop, Seminar, Hackathon"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                sx={{ mb: 3 }}
                required
              />

              <DatePicker
                className='event_input'
                label="Event Date"
                value={formData.date}
                onChange={(newDate) => setFormData({ ...formData, date: newDate })}
                slotProps={{ textField: { fullWidth: true, sx: { mb: 3 } } }}
                format="DD/MM/YYYY"
              />
            </div>

            {/* Right Column */}
            <div className="addProduct_left">
              <TimePicker
                className='event_input'
                label="Start Time"
                value={formData.startTime}
                onChange={(newTime) => setFormData({ ...formData, startTime: newTime })}
                slotProps={{ textField: { fullWidth: true, sx: { mb: 3 } } }}
                ampm
              />

              <TimePicker
                className='event_input'
                label="End Time"
                value={formData.endTime}
                onChange={(newTime) => setFormData({ ...formData, endTime: newTime })}
                slotProps={{ textField: { fullWidth: true, sx: { mb: 3 } } }}
                ampm
              />

              <TextField
                className='event_input'
                label="Description"
                name="desc"
                multiline
                rows={5}
                fullWidth
                variant="outlined"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{ mb: 3 }}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="addProduct_Image">
                <div className="addProduct_upload">
                  <label htmlFor='file'>
                    <div className="upload_Button" style={{cursor: submitting ? "not-allowed" : "pointer"}}>
                      <Photo />
                      <p>EVENT IMAGE</p>
                    </div>
                  </label>

                  <div className="addProduct_ImgUpload">
                    <img src="https://i.pinimg.com/originals/4c/98/5f/4c985ff32df376a36599eaa38a1f0597.jpg" alt="Preview" />                  
                  </div>
                </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="createProductButton">
            <div onClick={handleSubmit} className='update-button' style={{cursor: submitting ? "not-allowed" : "pointer"}}>
              {submitting ? <CircularProgress sx={{color: "white"}} size={30} /> : <p>CREATE</p>}
            </div>

            {error && (
              <p style={{ color: 'red', marginTop: '1rem' }}>
                Error: {error?.data?.message || 'Failed to create event'}
              </p>
            )}
          </div>
        </form>
      </div>
    </LocalizationProvider>
  )
}

export default NewEvent