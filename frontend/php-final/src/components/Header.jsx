import { useEffect, useState } from "react";
import "../styles/header.css";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../GlobalContext";
import api from "../API";

const Header = () =>{
    const {currentTab,setCurrentTab, userInfo, setUserInfo, cartItems, setCartItems } = useGlobalContext();
    const nav = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const toggleDropdown = () => setDropdownVisible(!dropdownVisible);
    const handleLogout = async() => {
        const response = await api.post("handle_auth.php", {action: "logout"});
        console.log(response.data);
        if (response.data.status==="OK"){
            setUserInfo(null);
            toggleDropdown();
            setCartItems([]);
            nav("/");
        }
        else{
            console.log(response.data.message);
        }
    };
    // useEffect(()=>{
    //     setCartItems(userInfo?userInfo.cart_items:sessionStorage.getItem("cart_items")?JSON.parse(sessionStorage.getItem("cart_items")):[]);
    // },[])
    return<div className="header-container">
        <div className="header-title">Online Restaurant Ordering</div>
        <div className="header-buttons">
            <button className={currentTab==="Home"?"active":null} onClick={()=>setCurrentTab("Home")}>Home</button> 
            <button className={currentTab==="Menu"?"active":null} onClick={()=>setCurrentTab("Menu")}>Menu</button> 
            <div className="cart-button" onClick={()=>nav("/cart")}>🛒
                <div className="cart-noti">{cartItems.length}</div>
            </div>
            {userInfo?<div className="header-avatar" onClick={toggleDropdown}>{userInfo['role']==="Customer"?<p>🧑‍🍳</p>:<p>🧑‍💼</p>}</div>
            :<button onClick={()=>nav("/login")}>Login</button>}
            {dropdownVisible && (
              <div className="avatar-menu">
                {userInfo && userInfo.role ==="Admin"?<button>Manage</button>:null}
                <button>Your Orders</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
        </div>
    </div>
}
export default Header;