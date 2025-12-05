// src/pages/CreateNews.jsx
import { useState } from 'react';
import { CircularProgress, Alert, TextField, Button } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import './CreateNews.css';
import { useCreateNewsMutation } from '../../services/newsApi';
import { useImageUpload } from '../../hooks/useImageUpload';

const CreateNews = () => {
  const [createNews, { isLoading: submitting, error: serverError }] = useCreateNewsMutation();
  const { pickImage, uploadImage, uploading: isUploading, progress } = useImageUpload();

  const [formData, setFormData] = useState({
    header: '',
    category: '',
    desc: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePickImage = async () => {
    const file = await pickImage();
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.header || !formData.category || !formData.desc) {
      alert('Please fill in Title, Category, and Description');
      return;
    }

    let imageUrl = null;

    // Only upload image if one was selected
    if (selectedFile) {
      const uploadResult = await uploadImage(selectedFile);
      if (!uploadResult?.url) {
        alert('Image upload failed. You can still publish without an image.');
        // Continue without image
      } else {
        imageUrl = uploadResult.url;
      }
    }

    // Final payload — img is optional
    const payload = {
      header: formData.header.trim(),
      category: formData.category.trim(),
      desc: formData.desc.trim(),
      ...(imageUrl && { img: imageUrl }), // Only include img if exists
    };

    try {
      await createNews(payload).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);

      // Reset form completely
      setFormData({ header: '', category: '', desc: '' });
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error('Failed to publish news:', err);
    }
  };

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">CREATE NEWS</h1>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          News published successfully!
        </Alert>
      )}

      {serverError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to publish: {serverError?.data?.message || 'Try again'}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="addProductForm">
        <div className="addProduct_container createNew_container">
          {/* Form Fields */}
          <div className="addProduct_left createNews_inputs">
            <TextField
              className='event_input'
              label="News Title"
              fullWidth
              required
              value={formData.header}
              onChange={(e) => setFormData({ ...formData, header: e.target.value })}
              sx={{ mb: 3 }}
            />

            <TextField
              className='event_input'
              label="Category"
              fullWidth
              required
              placeholder="e.g. Academics, Sports, Research, Campus Life"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              sx={{ mb: 3 }}
            />

            <TextField
              className='event_input'
              label="Full Description"
              multiline
              rows={8}
              fullWidth
              required
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              placeholder="Write a detailed and engaging news article..."
            />
          </div>

          {/* Optional Image Upload */}
          <div className="addProduct_Image createEvent_Image">
            {!previewUrl ? (
              <div
                onClick={handlePickImage}
                style={{
                  border: '3px dashed #126865',
                  borderRadius: '16px',
                  padding: '3rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f0fdfa',
                  transition: 'all 0.3s',
                  height: '100%'
                }}
              >
                <PhotoCamera sx={{ fontSize: 80, color: '#126865' }} />
                <p style={{ fontSize: '1.4rem', fontWeight: 'bold', marginTop: '1rem' }}>
                  (Optional) Click to Add Image
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    maxHeight: '400px',
                    width: '100%',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  }}
                />
                {isUploading && (
                  <div style={{ marginTop: '1rem' }}>
                    <CircularProgress />
                    <p>Uploading image... {progress}%</p>
                  </div>
                )}
                <Button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2, background: 'white' }}
                >
                  Remove Image
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Publish Button */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting || isUploading}
            sx={{
              minWidth: '280px',
              py: 2,
              fontSize: '1.3rem',
              background: '#126865',
              '&:hover': { background: '#0d9488' },
            }}
          >
            {submitting || isUploading ? (
              <CircularProgress size={32} color="inherit" />
            ) : (
              'PUBLISH NEWS'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateNews;