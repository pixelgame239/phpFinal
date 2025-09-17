import { createContext, useContext, useEffect, useState } from "react";
import api from "./API";

const GlobalContext = createContext();

export const GlobalProvider = ({children}) =>{
    const[currentTab, setCurrentTab] = useState("Home");
    const [fetchedFoods, setFetchedFoods] = useState([]);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    useEffect(()=>{
      const checkUserStatus = async () => {
        setIsLoading(true);
            try {
                const response = await api.get('handle_auth.php'); 
                if (response.data) {
                    setUserInfo(response.data);
                    setCartItems(response.data.cart_items);
                } else {
                    setUserInfo(null);
                    const storedCartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
                    setCartItems(storedCartItems);
                }
            } catch (err) {
                console.error("Failed to fetch user info on app load", err);
                setUserInfo(null); 
                const storedCartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
                setCartItems(storedCartItems);
            }
            setIsLoading(false);
        };

        checkUserStatus();
    }, []);
    return (
        <GlobalContext.Provider value ={{ currentTab, setCurrentTab, fetchedFoods, setFetchedFoods, error, setError, isLoading, setIsLoading, userInfo, setUserInfo, cartItems, setCartItems }}>
            {children}
        </GlobalContext.Provider>
    )
}
export const useGlobalContext = () =>useContext(GlobalContext);