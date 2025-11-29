import { Link, useLocation } from 'react-router-dom';
import './newsDetails.css'
import moment from 'moment';
import { useGetNewsByIdQuery } from '../../services/newsApi';
import { useState } from 'react';
import { Photo } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const NewsDetails = () => {
    const location = useLocation();
    const newsId = location.pathname.split("/")[2];
    const [inputs, setInputs] =  useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    const { data: news, isLoading, isFetching, error, } = useGetNewsByIdQuery(newsId);

    const handleChange = (e) => {
        setInputs((prev) => {
        return { ...prev,  [e.target.name]: e.target.value };
        });
    };

    const handleImageChange = (e) => {  
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Set the preview URL
            };
            reader.readAsDataURL(selectedFile); // Convert file to base64 URL
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();

    }
    
    if (isLoading) return <div>Loading news...</div>;
    if (error) return <div>Error Loading news...</div>;

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">News Details</h1>
        <Link to="/create-news">
          <button className="productAddButton">Create</button>
        </Link>
      </div>

      <div className="productTop">
          <div className="productTopLeft">
            <div className="roomImage">
              <img src={news?.img} alt="PR" />
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
                      <span className="productInfoKey">CreatedAt:</span>
                      <span className="productInfoValue">{moment(news.createdAt).fromNow()}</span>
                  </div>
                  <div className="productInfoItemm">
                      <p>{news.desc}</p>
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
                            <label>Title</label>
                            <input 
                                name='header'
                                type="text" 
                                placeholder={news.header}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="updateProductItem">
                            <label>Description</label>
                            <input
                                name="desc"
                                type="text"
                                onChange={handleChange}
                                placeholder="We take pride in offering a wide range of "
                            />
                        </div>
                        <div className="updateProductItem">
                            <label>Category</label>
                            <input
                                name="category"
                                type="text"
                                placeholder="Automation"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="productFormLeft-item">
                        <div className="updateProductItem">
                            <label>Price</label>
                            <input
                                name="price"
                                type="number"
                                placeholder="3493444"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="updateProductItem">
                            <label>Technicians</label>
                            <input
                                name="technicians"
                                type="number"
                                placeholder="15"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="updateProductItem">
                            <label>Duration</label>
                            <input
                                name="duration"
                                type="text"
                                placeholder="2-3 Weeks"
                                onChange={handleChange}
                            />
                        </div>                      
                    </div>
                </div>
            </div>

            <div className="productFormRight">
                <div className="productsUpload-button">
                    <label htmlFor='file'>
                    <div className="upload_Button" style={{cursor: isUploading ? "not-allowed" : "pointer"}}>
                        <Photo />
                        <p>CHOOSE IMAGE</p>
                    </div>
                    </label>
                    <input 
                        type="file" 
                        id="file" 
                        accept="image/*"
                        style={{display:"none"}}
                        onChange={handleImageChange}
                    />

                    <div className="upload_Img">
                    <img src={imagePreview || news.img} alt="Preview" />   

                    {isUploading && <div className="upload_indication">
                        <CircularProgress sx={{color: "white"}} size={70} />
                        <p>Uploading..</p>
                    </div>}                   
                    </div>
                </div>
            </div>
        </form>

        <div className="productBottom_button">
            <div className="productButton-container">
                <div onClick={handleUpdate} className='update-button' style={{cursor: isUploading ? "not-allowed" : "pointer"}}>
                    {isFetching && !error ? <CircularProgress sx={{color: "white"}} size={30} /> : <p>UPDATE</p>}
                </div>

                {error && <p style={{color: "red"}}>error occurred</p>} 
            </div>

            <div className="productButton-container">
                <div onClick={handleUpdate} className='update-button' style={{background: 'red', cursor: isUploading ? "not-allowed" : "pointer"}}>
                    {isFetching && !error ? <CircularProgress sx={{color: "white"}} size={30} /> : <p>DELETE</p>}
                </div>

                {error && <p style={{color: "red"}}>error occurred</p>} 
            </div>
        </div>
      </div>
    </div>
  )
}

export default NewsDetails