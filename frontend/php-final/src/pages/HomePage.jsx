import Carousel from "../components/Carousel";
import Header from "../components/Header";
import api from "../API";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { useGlobalContext } from "../GlobalContext";
import HomeTabContent from "../components/HomeTabContent";
import FoodReviews from "../components/FoodReviews";

const HomePage = () =>{
    const { currentTab, setCurrentTab} = useGlobalContext();
    const [fetchedFoods, setFetchedFoods] = useState([]);
    const [error, setError] = useState(false);
    useEffect(()=>{
        const fetchTopFoods = async()=>{
            try{
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
        }
        if(currentTab==="Home"){
            fetchTopFoods();
        }
    },[]);
    return <div>
        <Header></Header>
        <Carousel></Carousel>
        <HomeTabContent topFoods={fetchedFoods} error={error} ></HomeTabContent>
        <FoodReviews></FoodReviews>
        <Footer></Footer>
    </div>
}
export default HomePage;