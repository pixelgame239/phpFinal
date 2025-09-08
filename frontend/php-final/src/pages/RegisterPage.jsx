import AuthForm from '../components/AuthForm';
import '../styles/auth.css'; // Import the CSS file

const RegisterPage = () => {
  return (
    <div className='page-container'>
      <div className='register-panel'>
        <p className='login-title'>Register</p>
        <AuthForm mode="Register" />
      </div>
    </div>
  );
};

export default RegisterPage;
