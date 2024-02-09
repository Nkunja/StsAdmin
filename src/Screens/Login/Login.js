import React from 'react'
import "./Login.css"
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();


    const handleButtonClick = () => {
        // Navigate to the '/about' route
        navigate('/landingpage');
      };
  return (
    <div className='loginScreen'>
        <div className='loginCard'>
            <h1>Admin Login</h1>
            <div className='inputs'>
                <label>Email:</label>
                <input placeholder='e.g. username@mail.com' type='email' />
            </div>
            <div className='inputs'>
                <label>Password:</label>
                <input placeholder='Enter your password' type='password' />
            </div>
            <button onClick={handleButtonClick}>Sign In</button>
        </div>
    </div>
  )
}
