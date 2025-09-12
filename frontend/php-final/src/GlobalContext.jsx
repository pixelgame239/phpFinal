import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({children}) =>{
    const[currentTab, setCurrentTab] = useState("Home");
    const [fetchedFoods, setFetchedFoods] = useState([]);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState();
    return (
        <GlobalContext.Provider value ={{ currentTab, setCurrentTab, fetchedFoods, setFetchedFoods, error, setError, isLoading, setIsLoading, userInfo, setUserInfo }}>
            {children}
        </GlobalContext.Provider>
    )
}
export const useGlobalContext = () =>useContext(GlobalContext);