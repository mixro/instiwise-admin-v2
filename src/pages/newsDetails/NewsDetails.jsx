import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import './newsDetails.css'
import moment from 'moment';
import { useDeleteNewsMutation, useGetNewsByIdQuery, useUpdateNewsMutation } from '../../services/newsApi';
import { useEffect, useState } from 'react';
import { Photo, PhotoCamera } from '@mui/icons-material';
import { Alert, Button, CircularProgress, TextField } from '@mui/material';
import { useImageUpload } from '../../hooks/useImageUpload';

const NewsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { data: news, isLoading, error } = useGetNewsByIdQuery(id);
    const [updateNews, { isLoading: updating }] = useUpdateNewsMutation();
    const [deleteNews, { isLoading: deleting }] = useDeleteNewsMutation();
    const { pickImage, uploadImage, uploading: isUploading, progress } = useImageUpload();

    const [formData, setFormData] = useState({
        header: '',
        category: '',
        desc: '',
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [success, setSuccess] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    // Populate form when news loads
    useEffect(() => {
        if (news) {
        setFormData({
            header: news.header || '',
            category: news.category || '',
            desc: news.desc || '',
        });
        setPreviewUrl(news.img || '');
        }
    }, [news]);

    const handlePickImage = async () => {
        const file = await pickImage();
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        let imageUrl = news.img; // Keep old image by default

        if (selectedFile) {
            const result = await uploadImage(selectedFile);
            if (!result?.url) {
                alert('Image upload failed. Update will proceed without new image.');
            } else {
                imageUrl = result.url;
            }
        }

        const payload = {
        header: formData.header.trim(),
        category: formData.category.trim(),
        desc: formData.desc.trim(),
        ...(imageUrl !== news.img && { img: imageUrl }), // Only send if changed
        };

        try {
            await updateNews({ id, ...payload }).unwrap();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 4000);
            setSelectedFile(null);
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
            await deleteNews(id).unwrap();
            navigate('/news');
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    if (isLoading) return <div className="loading">Loading news...</div>;
    if (error || !news) return <div className="error">News not found</div>;

  return (
    <div className="product">
        <div className="productTitleContainer">
            <h1 className="productTitle">News Details</h1>
            <Link to="/create-news">
                <button className="productAddButton">Create</button>
            </Link>
        </div>

        {success && (
            <Alert severity="success" sx={{ mb: 3 }}>News updated successfully!</Alert>
        )}

        <div className="productTop">
          <div className="productTopLeft">
            <div className="roomImage">
              <img src={news?.img || 'https://groundwater.org/wp-content/uploads/2022/07/news-placeholder.png'} alt="PR" />
            </div>
          </div>
          <div className="productTopRight">
              <div className="productInfoTop">
                  <span className="productName">{news.header}</span>
              </div>
              <div className="productInfoBottom">
                  <div className="productInfoItem">
                      <span className="productInfoKey">Id:</span>
                      <span className="productInfoValue">{news._id}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">Category:</span>
                      <span className="productInfoValue">{news.category}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">Views:</span>
                      <span className="productInfoValue">{news.likes.length}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">Likes:</span>
                      <span className="productInfoValue">{news.likes.length}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">Dislikes:</span>
                      <span className="productInfoValue">{news.dislikes.length}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">Created:</span>
                      <span className="productInfoValue">{moment(news.createdAt).fromNow()}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">Updated:</span>
                      <span className="productInfoValue">{moment(news.updatedAt).fromNow()}</span>
                  </div>
                  <div className="productInfoItemm">
                      <p>{news.desc}</p>
                  </div>
              </div>
          </div>
        </div>

        <div className="productBottom">
            <div className="productFormLeft-title">
                <p>UPDATE</p>
            </div>

            <form onSubmit={handleUpdate}>
                <div className="formGrid">
                    {/* Left: Form */}
                    <div className='formGrid_left'>
                        <TextField
                            label="Title"
                            fullWidth
                            required
                            value={formData.header}
                            onChange={(e) => setFormData({ ...formData, header: e.target.value })}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            label="Category"
                            fullWidth
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            label="Description"
                            multiline
                            rows={7}
                            fullWidth
                            required
                            value={formData.desc}
                            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                        />
                    </div>

                    {/* Right: Image */}
                    <div className="newDetails_Image">
                        <div
                            onClick={handlePickImage}
                            style={{
                                border: '3px dashed #126865',
                                borderRadius: '16px',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: '#f0fdfa',
                                width: '100%'
                            }}
                        >
                            <PhotoCamera sx={{ fontSize: 60, color: '#126865' }} />
                            <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>
                                Click to Change Image (Optional)
                            </p>
                        </div>

                        {previewUrl && (
                            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{
                                        maxHeight: '320px',
                                        width: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                    }}
                                />
                                {isUploading && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <CircularProgress />
                                        <p>Uploading... {progress}%</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            {/* Action Buttons */}
            <div className="actionButtons" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={updating || isUploading}
                    sx={{ minWidth: '180px', background: '#126865', '&:hover': { background: '#0d9488' } }}
                >
                    {updating ? <CircularProgress size={24} /> : 'UPDATE NEWS'}
                </Button>

                <Button
                    variant="contained"
                    size="large"
                    color={deleteConfirm ? 'error' : 'secondary'}
                    onClick={handleDelete}
                    disabled={deleting}
                    sx={{ minWidth: '180px' }}
                >
                    {deleting ? <CircularProgress size={24} /> : deleteConfirm ? 'CONFIRM DELETE' : 'DELETE NEWS'}
                </Button>
            </div>

            {deleteConfirm && (
                <Alert severity="warning" sx={{ mt: 2, textAlign: 'center' }}>
                    Click <strong>CONFIRM DELETE</strong> again to permanently remove this news.
                </Alert>
            )}
            </form>
        </div>
    </div>
  )
}

export default NewsDetails