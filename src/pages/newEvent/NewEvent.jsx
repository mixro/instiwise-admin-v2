import { useState } from 'react';
import { useCreateEventMutation } from '../../services/eventsApi';
import './newEvent.css'
import { Photo } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const NewEvent = () => {
    const [inputs, setInputs] =  useState({});
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [addButtonClicked, setAddButtonClicked] = useState(false);
    const [cat, setCat] = useState([]);

    const [createEvent, { isLoading: submitting }] = useCreateEventMutation();
    

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
  
    const handleChange = (e) => {
      setInputs((prev) => {
        return { ...prev,  [e.target.name]: e.target.value };
      });
    };
  
    const handleCat = (e) => {
      setCat(e.target.value.split(","));
    };
  
    const handleClick = (e) => {
      e.preventDefault();
      setAddButtonClicked(true);
    } 

  return (
    <div className="newProduct">
        <h1 className="addProductTitle">NEW EVENT</h1>
        <form className="addProductForm">
          <div className="addProduct_container">
            <div className="addProduct_left">
              <div className="addProductItem">
                <label>Title</label>
                <input 
                  name='title'
                  type="text" 
                  placeholder="Eg; Circuit Breaker" 
                  onChange={handleChange}
                />
              </div>
              <div className="addProductItem">
                <label>Price</label>
                <input
                  name="price"
                  type="number"
                  placeholder="Eg; 349045"
                  onChange={handleChange}
                />
              </div>
              <div className="addProductItem">
                <label>Brand</label>
                <input
                  name="brand"
                  type="text"
                  placeholder="Eg; Siemens"
                  onChange={handleChange}
                />
              </div>
              <div className="addProductItem">
                <label>Category</label>
                <input
                  name="type"
                  type="text"
                  placeholder="Eg; Power protection"
                  onChange={handleChange}
                />
              </div>
            </div>
  
            <div className="addProduct_left">
                <div className="addProductItem">
                    <label>Field</label>
                    <input
                      name="categories"
                      type="text"
                      placeholder="Eg; Electrical "
                      onChange={handleCat}
                    />
                </div>
                <div className="addProductItem">
                    <label>Status</label>
                    <select name="status" id="active" onChange={handleChange}>
                      <option value="true">On stock</option>
                      <option value="false">Off stock</option>
                    </select>
                </div>
                <div className="addProductItem">
                    <label>Description</label>
                    <textarea 
                      defaultValue="Add Product description" 
                      name='desc'
                      onChange={handleChange} 
                    >
                    </textarea>
                </div>
            </div>

            <div className="addProduct_Image">
                <div className="addProduct_upload">
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

                  <div className="addProduct_ImgUpload">
                    <img src={imagePreview} alt="Preview" />   

                    {isUploading && <div className="upload_indication">
                      <CircularProgress sx={{color: "white"}} size={70} />
                      <p>Uploading..</p>
                    </div>}                   
                  </div>
                </div>
            </div>
          </div>
  
          <div className="createProductButton">
            <div className="productButton-container">
              <div onClick={handleClick} className='update-button' style={{cursor: isUploading ? "not-allowed" : "pointer"}}>
                {addButtonClicked && isFetching && !error ? <CircularProgress sx={{color: "white"}} size={30} /> : <p>CREATE</p>}
              </div>

              {addButtonClicked && error && <p style={{color: "red"}}>error occurred</p>} 
            </div>
          </div>      
        </form>
    </div>
  )
}

export default NewEvent