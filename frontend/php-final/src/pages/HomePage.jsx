import Carousel from "../components/Carousel";
import Header from "../components/Header";
import api from "../API";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { useGlobalContext } from "../GlobalContext";
import HomeTabContent from "../components/HomeTabContent";
import LoadingComponent from "../components/LoadingComponent";
import MenuTabContent from "../components/MenuTabContent";

const HomePage = () =>{
    const { currentTab, userInfo, setUserInfo, fetchedFoods, setFetchedFoods, error, setError, isLoading, setIsLoading } = useGlobalContext();
    // const [fetchedFoods, setFetchedFoods] = useState([]);
    // const [error, setError] = useState(false);
    useEffect(()=>{
        const getUserInfo = async()=>{
            try{
                setIsLoading(true);
                const response = await api.get("handle_auth.php");
                setUserInfo(response.data);
                console.log(userInfo);
            } catch(err){
                console.error(err);
            }
        }
        const fetchTopFoods = async()=>{
            try{
                setIsLoading(true);
                const response = await api.post("fetch_foods.php", {action:"bestSeller"});
                if (response.data && response.data.length>0){
                    console.log(response.data);
                    setFetchedFoods(response.data);
                }
                else{
                    setError(true);
                }    
            } catch(err){
                console.error(err);
                setError(true);
            }
            setIsLoading(false);
        }
        const fetchFoods = async()=>{
            try{
                setIsLoading(true);
                const response = await api.post("fetch_foods.php", {action:"fetchAll"});
                if (response.data && response.data.length>0){
                    console.log(response.data);
                    setFetchedFoods(response.data);
                }
                else{
                    setError(true);
                }      
            } catch (err){
                setError(true);
                setIsLoading(false)
            }
            setIsLoading(false)
        }
        if(currentTab==="Home"){
            fetchTopFoods();
        }
        else if(currentTab==="Menu"){
            fetchFoods();
        }
        getUserInfo();
    },[currentTab]);
    return <div>
        <Header></Header>
        <Carousel></Carousel>
        {isLoading?<LoadingComponent></LoadingComponent>: currentTab == "Home"? <HomeTabContent topFoods={fetchedFoods} error={error} ></HomeTabContent>:<MenuTabContent></MenuTabContent>}
        <Footer></Footer>
    </div>
}
export default HomePage;