import { Link, useLocation } from 'react-router-dom';
import './event.css'
import { useState } from 'react';
import { useGetEventByIdQuery } from '../../services/eventsApi';
import moment from 'moment';
import { Photo } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const Event = () => {
    const location = useLocation();
    const eventId = location.pathname.split("/")[2];
    const [inputs, setInputs] =  useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const { data: event, isLoading, isFetching, error, } = useGetEventByIdQuery(eventId);

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
    
    if (isLoading) return <div>Loading events...</div>;
    if (error) return <div>Error Loading events...</div>;
    
    
  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Events Details</h1>
        <Link to="/create-events">
          <button className="productAddButton">Create</button>
        </Link>
      </div>

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
                            <label>Title</label>
                            <input 
                                name='header'
                                type="text" 
                                placeholder={event.header}
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
                                placeholder={event.category}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="productFormLeft-item">
                        <div className="updateProductItem">
                            <label>Date</label>
                            <input
                                name="price"
                                type="number"
                                placeholder={event.date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="updateProductItem">
                            <label>Starts</label>
                            <input
                                name="technicians"
                                type="number"
                                placeholder={event.start}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="updateProductItem">
                            <label>Ends</label>
                            <input
                                name="duration"
                                type="text"
                                placeholder={event.end}
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
                    <img src={imagePreview || "https://i.pinimg.com/originals/4c/98/5f/4c985ff32df376a36599eaa38a1f0597.jpg"} alt="Preview" />   

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

export default Event