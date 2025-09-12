import '../styles/auth.css'; 
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const nav = useNavigate()
  return (
    <div className='page-container'>
      <button className='back-to-home' onClick={()=>{nav("/")}}>Back to home⬅️</button>
      <div className='login-panel'>
        <p className='login-title'>Login</p>
        <AuthForm mode="Login" />
      </div>
    </div>
  );
};

export default LoginPage;
