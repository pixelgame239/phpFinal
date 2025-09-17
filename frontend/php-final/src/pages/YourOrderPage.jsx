import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../GlobalContext";
import { useEffect, useState } from "react";
import LoadingComponent from "../components/LoadingComponent";
import { fetchOrders } from "../services/Order";
import BackButton from "../components/BackButton";

const YourOrderPage = () =>{
    const { userInfo, isLoading } = useGlobalContext();
    const [orderDetail, setOrderDetail] = useState([]);
    const nav = useNavigate();
    useEffect(()=>{
        const getOrders = async() =>{
            const tempData = await fetchOrders(userInfo.userID)
            setOrderDetail(tempData);
            console.log(tempData);
        }
        if (!isLoading){
            if(!userInfo){
                nav("/");
            }
            else{
                getOrders();
            }
        }
    }, [userInfo, isLoading])
    if(isLoading){
        return <LoadingComponent></LoadingComponent>
    }
    return <div>
            <BackButton></BackButton>
            <h1 style={{textAlign:"center"}}>Your Orders</h1>
            <p></p>
    </div>
}
export default YourOrderPage;