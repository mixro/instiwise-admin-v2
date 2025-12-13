import './login.css'
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { useGetMeQuery, useLoginMutation } from '../../services/authApi';
import { useAuth } from '../../hooks/useAuth';
import { setCredentials } from '../../store/slices/authSlice';


export default function Login() {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [login, { isLoading, error }] = useLoginMutation();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        const result = await login({ email, password }).unwrap();

        const userPayload = {
            ...result.data.user,
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
        };

        dispatch(setCredentials(userPayload));
        localStorage.setItem('instiwise-user', JSON.stringify(userPayload));

        navigate('/dashboard');
        } catch (err) {
          console.error('Login failed:', err);
        }
    };


  return (
    <>
      <div className="login-container">

        <div className="login-card">
          {/* Left: Login Form */}
          <div className="login-form-section">
            {/* Logo */}
            <div className="logo">
              <div className="logo-icon">
                <img src='/src/assets/images/white-icon.png' />
              </div>
              <span className="logo-text">INSTiWISE</span>
            </div>

            <h1 className="title">Welcome Back!</h1>
            <p className="subtitle">
              Sign in to access your admin dashboard and continue managing your institute's academic ecosystem.
            </p>

            <form onSubmit={handleLogin} className="login-form">
                {/* Email Field */}
                <div className="input-group">
                    <label>Email</label>
                    <div className="input-wrapper">
                    <MailOutlineIcon className="input-icon" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    </div>
                </div>

                {/* Password Field */}
                <div className="input-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                    <LockOutlinedIcon className="input-icon" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="toggle-password"
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </button>
                    </div>
                    <a href="#" className="forgot-link">Forgot Password?</a>
                </div>

                {/* Submit Button */}
                <button type="submit" className="signin-btn" disabled={isLoading}>
                    {isLoading 
                        ? <CircularProgress sx={{color: "white"}} size={28} />
                        : <p>Sign In</p>
                    }
                </button>

                {error && (
                    <div className="text-red-500 text-sm mt-2 text-center">
                    {error?.data?.message || 'Invalid email or password'}
                    </div>
                )}
            </form>            
          </div>

          {/* Right: Hero Section (Hidden on Mobile) */}
          <div className="hero-section">
            <div className="hero-content">
              <h2>
                Seamless Scheduling
              </h2>
              <blockquote>
                “InstiWise has transformed how we manage schedules, share projects, and connect students across departments. It's reliable, intuitive, and keeps our campus running smoothly.”
              </blockquote>
              <div className="testimonial">
                <div className="avatar">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEKiE8hn2Gxnb95zXObh5GjfVS25rhKUlqGQ&s" alt="SJ" />
                </div>
                <div>
                  <p className="name">Prof. Sarah Johnson</p>
                  <p className="role">Dean of Academic Affairs, DIT</p>
                </div>
              </div>
            </div>

            <div className="trusted-by">
              <p>TRUSTED BY LEADING INSTITUTIONS</p>
              <div className="logos">
                <span>DIT</span>
                <span>Stanford</span>
                <span>MIT</span>
                <span>Oxford</span>
                <span>NUS</span>
                <span>IIT</span>
                <span>ETH</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pure CSS Styles (device-friendly, no build dependency issues) */}
      <style jsx="true">{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ddddddff;
          color: ${theme.text};
          font-family: 'Inter', 'Segoe UI', sans-serif;
          padding: 1rem;
          position: relative;
          overflow: hidden;
        }

        @media (min-width: 1024px) {
          .gradient-overlay {
            display: block;
          }
        }

        .login-card {
          display: flex;
          flex-direction: column;
          background: ${theme.background};
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
          max-width: 1200px;
          width: 100%;
          z-index: 10;
        }

        @media (min-width: 1024px) {
          .login-card {
            flex-direction: row;
          }
        }

        .login-form-section {
          padding: 3rem 2.5rem;
          flex: 1;
          background: ${theme.background};
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 2.5rem;
          font-size: 1.8rem;
          font-weight: 700;
        }
          
        .logo-icon {
            width: 48px;
            height: 48px;
            color: white;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            background: #126865;
            padding: 5px;
        }

        .title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: ${theme.gray_text};
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 1px solid ${theme.border};
          border-radius: 12px;
          background: ${theme.inputs_bg || theme.secondary_background};
          color: ${theme.text};
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .input-wrapper input:focus {
          outline: none;
          ring: 2px solid #10b981;
          border-color: #10b981;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: ${theme.gray_text};
          font-size: 1.3rem !important;
        }

        .toggle-password {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: ${theme.gray_text};
        }

        .forgot-link {
          display: block;
          text-align: right;
          margin-top: 0.5rem;
          color: ${theme.blue_text};
          font-size: 0.9rem;
          text-decoration: none;
        }

        .signin-btn {
          width: 100%;
          padding: 1rem;
          background: ${theme.green_button};
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .signin-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(18, 104, 101, 0.3);
        }

        .divider {
          text-align: center;
          margin: 2rem 0;
          position: relative;
          color: ${theme.gray_text};
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: ${theme.border};
        }

        .divider span {
          background: ${theme.background};
          padding: 0 1rem;
          font-size: 0.9rem;
        }

        .social-login {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.9rem;
          border: 1px solid ${theme.border};
          background: ${theme.background};
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .social-btn:hover {
          background: ${theme.secondary_background};
          transform: translateY(-1px);
        }

        .signup-text {
          text-align: center;
          margin-top: 2rem;
          color: ${theme.gray_text};
        }

        .signup-link {
          color: ${theme.green_text};
          font-weight: 600;
          text-decoration: none;
        }

        /* Hero Section */
        .hero-section {
          display: none;
          padding: 4rem;
          color: white;
          position: relative;
        }

        @media (min-width: 1024px) {
          .hero-section {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            background: linear-gradient(135deg, #126865, #0d9488, #10b981);
          }
        }

        .hero-content h2 {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 2rem;
        }

        .hero-content blockquote {
          font-size: 1.4rem;
          font-style: italic;
          opacity: 0.9;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .testimonial {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: white;
          border: 4px solid rgba(255,255,255,0.3);
          overflow: hidden;
          }
          
        .avatar img {
            border-radius: 50%;
            object-fit: cover;
        }

        .trusted-by {
          margin-top: 4rem;
          opacity: 0.7;
        }

        .trusted-by p {
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .logos {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          font-weight: 600;
        }

        .logos span:hover {
          opacity: 1;
        }

        @media (max-width: 770px) {
          .login-container {
            align-items: flex-start;
            background: #c7c7c7;
            padding: 30px 1rem;
          }

          .login-form-section {
            padding: 30px 3%;
            flex: 1;
          }

          .logo {
            font-weight: 600;
            font-size: 1.6rem;
          }

          .title {
            font-size: 2.1rem;
            text-align: center;
            font-weight: 600;
            margin-bottom: 20px;
          }
          
          .subtitle {
            text-align: center
          }
        }
      `}</style>
    </>
  );
}