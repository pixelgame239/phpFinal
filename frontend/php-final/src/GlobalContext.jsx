import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({children}) =>{
    const[currentTab, setCurrentTab] = useState("Home");
    return (
        <GlobalContext.Provider value ={{ currentTab, setCurrentTab }}>
            {children}
        </GlobalContext.Provider>
    )
}
export const useGlobalContext = () =>useContext(GlobalContext);