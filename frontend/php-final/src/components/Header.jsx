import { useState } from "react";
import "../styles/header.css";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../GlobalContext";

const Header = () =>{
    const {currentTab,setCurrentTab, userInfo} = useGlobalContext();
    const nav = useNavigate()
    return<div className="header-container">
        <div className="header-title">Online Restaurant Ordering</div>
        <div className="header-buttons">
            <button className={currentTab==="Home"?"active":null} onClick={()=>setCurrentTab("Home")}>Home</button> 
            <button className={currentTab==="Menu"?"active":null} onClick={()=>setCurrentTab("Menu")}>Menu</button> 
            <div className="cart-button">🛒
                <div className="cart-noti">1</div>
            </div>
            {userInfo?<div>{userInfo['role']==="Customer"?"🧑‍🍳":"🧑‍💼"}</div>:<button onClick={()=>nav("/login")}>Login</button>}
        </div>
    </div>
}
export default Header;