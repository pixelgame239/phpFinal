import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/auth.css'; 
import api from "../API";
import { getUserInfo } from "../services/User";
import { useGlobalContext } from "../GlobalContext";

const AuthForm=({mode})=>{
    const { userInfo, setUserInfo, setCartItems } = useGlobalContext();
    const navigate = useNavigate()
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPass, setConfirmPass] = useState("");
      const [error, setError] = useState("");
        const handleRegister = async (e) => {
            e.preventDefault();
            if(username.trim() == "" || password.trim()=="" || confirmPass.trim()==""){
                setError("All fields are required");
            }
            else if (password.length < 6){ 
                setError("Password must be at least 6 characters");
            }
            else if(password!==confirmPass){
                setError("Password do not match");
            }
            else{
                try{
                    setError(null);
                    const response = await api.post("handle_auth.php", {action:"register", username:username, password:password});
                    if (response.data.status === "OK"){
                        const userData = await getUserInfo();
                        setUserInfo(userData);
                        setCartItems(userData.cart_items);
                        sessionStorage.removeItem("cartItems");
                        navigate("/");
                    }
                    else{
                        setError(response.data.message);
                    }
                }
                catch (error){
                    setError(error);
                }
            }
        };
    
      const handleLogin = async (e) => {
        e.preventDefault();
        if(username.trim()=="" || password.trim()==""){
            setError("All fields are required");
        }
        else{
            try{
                setError(null);
                const response = await api.post("handle_auth.php", {action:"login", username: username, password:password});
                if (response.data.status === "OK"){
                        const userData = await getUserInfo();
                        setUserInfo(userData);
                        setCartItems(userData.cart_items);
                        sessionStorage.removeItem("cartItems");
                        navigate("/");
                }
                else{
                    setError(response.data.message);
                }
            }
            catch (error){
                setError(error);
            }
        }
      };
    
    return (
        <div className="login-wrapper">
            <form className="login-form" onSubmit= {mode==="Login"?handleLogin:handleRegister}>
            {error?<p className="auth-error">{error}</p>:null}
            <input  
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="login-input" 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="login-input" 
            />
            {mode==="Login"?null:            
            <input 
                type="password" 
                placeholder="Confirm password" 
                value={confirmPass} 
                onChange={(e) => setConfirmPass(e.target.value)} 
                className="login-input" 
            />}
            <button type="submit" className={mode==="Login"?"login-btn":"register-btn"}>{mode==="Login"?"Login":"Register"}</button>
            <p>
                {mode==="Login"?"Don't have an account?":"Already have an account?"}
                {mode==="Login"?
                <Link to="/register">Register</Link>
                :<Link to="/login">Login</Link>
                }
            </p>
            </form>
        </div>
    )
}
export default AuthForm;