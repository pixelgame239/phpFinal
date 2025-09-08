import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css'; 
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  return (
    <div className='page-container'>
      <div className='login-panel'>
        <p className='login-title'>Login</p>
        <AuthForm mode="Login" />
      </div>
    </div>
  );
};

export default LoginPage;
