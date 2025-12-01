import { useState } from 'react';
import './newUser.css'
import { CircularProgress } from '@mui/material';
import { useRegisterMutation } from '../../services/authApi';

const NewUser = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");

    const [register, { isLoading, isFetching, error }] = useRegisterMutation();

    const handleClick = async (e) => {
      e.preventDefault();
      try {
        const result = await register({ username, password, phoneNumber, location, email, gender }).unwrap();
        alert("User: ", result.data.username, "created" )
      } catch(error) {
        console.error('Register failed', error);
      }
    }

  return (
    <div className="newUser">
        <h1 className="newUserTitle">NEW USER</h1>
        <form className="newUserForm">
          <div className="newUserItem">
            <label>Username</label>
            <input type="text" required placeholder="john" onChange={(e) => setUsername(e.target.value)} />
          </div>  
          <div className="newUserItem">
            <label>Address</label>
            <input type="text" placeholder="Tanzania" onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="newUserItem">
            <label>Email</label>
            <input type="email" required placeholder="john@gmail.com" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="newUserItem">
            <label>Phone</label>
            <input type="text" placeholder="+255 622 739 995" onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <div className="newUserItem">
            <label>Password</label>
            <input type="password" required placeholder="password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="newUserItem">
              <label>Gender</label>
              <select className="newUserSelect" onChange={(e) => setGender(e.target.value)}>
                  <option value="other">Others</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
              </select>
          </div>
        </form>
        
        <div className="createUserButton">
          <div className="productButton-container">
            <div onClick={handleClick} className='register-button general-button'>
              {isFetching && !error ? <CircularProgress sx={{color: "white"}} size={30} /> : <p>CREATE</p>}
            </div>

            {error && <p style={{color: "red"}}>error occurred</p>} 
          </div>
        </div>   
    </div>
  )
}

export default NewUser