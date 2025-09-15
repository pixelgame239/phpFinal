import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFoodByID } from "../services/Food";
import LoadingComponent from "../components/LoadingComponent";
import "../styles/detail.css";
import { useGlobalContext } from "../GlobalContext";
import api from "../API";

const FoodPage = () =>{
    const { productid } = useParams();
    const { userInfo, setUserInfo, cartItems, setCartItems } = useGlobalContext();
    const id = parseInt(productid.replace("food", ""));
    const [foodData, setFoodData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const handleBack=()=>{
        window.history.back();
    }
    useEffect(()=>{
        const initFoodPage = async () =>{
            setIsLoading(true);
            const responseData =await getFoodByID(id);
            if(responseData){
                setFoodData(responseData);
                setIsLoading(false);
            }
            else{
                setIsError(true);
                setIsLoading(false);
            }
        }
        initFoodPage();
    },[]);
    const handleOrder = async (e) =>{
         e.stopPropagation(); 
        const orderDetail = {
            foodID: id, quantity: 1
        }
        if(userInfo){
            let updatedCartItems = [...userInfo.cart_items];
            const existingItem = updatedCartItems.findIndex(item=>item.foodID===orderDetail.foodID);
            if(existingItem!==-1){
                updatedCartItems[existingItem] ={
                    ...updatedCartItems[existingItem],
                    quantity: updatedCartItems[existingItem].quantity + 1
                };
            }
            else{
                updatedCartItems=[...updatedCartItems, orderDetail];
            }
            const updateUserInfo = {
                ...userInfo,
                cart_items: updatedCartItems
            }
            try{
                console.log(userInfo);
                  const response = await api.post("order_operation.php", {action:"updateCart", cartItems: JSON.stringify(updatedCartItems), userID: userInfo.userID})
                    if(response.data.status==="OK"){
                        setCartItems(updatedCartItems);
                        setUserInfo(updateUserInfo);
                    }
                    else{
                        console.log(response);
                    }
            } catch(error){
                console.error(error);
            }
        }
        else{
             const existingItem = cartItems.findIndex(item=>item.foodID===orderDetail.foodID);
            if(existingItem!==-1){
                const newCartItems = [...cartItems];
                newCartItems[existingItem] ={
                    ...newCartItems[existingItem],
                    quantity: newCartItems[existingItem].quantity + 1
                };
                setCartItems(newCartItems);
            }
            else{
                setCartItems([...cartItems, orderDetail]);
            }
        }
        // console.log(sessionStorage.getItem("cart_items"));
    }
    return<div>
        <button className="back-button" onClick={handleBack}>&#60; Back</button>
        {isLoading?<LoadingComponent></LoadingComponent>:isError?<p>Unexpected Error: Food not found</p>:
        <><div className="detail-container">
            <div><img src={`http://localhost/final/backend/${foodData.food_image}`} alt={foodData.food_name} className="detail-img"></img></div>
            <div className="detail-information">
                <h1 className="detail-title">{foodData.food_name}</h1>
                <p className="detail-description">{foodData.description}</p>
                <p style={{fontStyle:"italic", color:"rgb(103, 103, 103)"}}>Has sold: {foodData.order_count}</p>
            </div>
            <p className="detail-price">Price: {new Intl.NumberFormat('vi-VN').format(foodData.price)}</p>
        </div>
            <div className="detail-buttons">
                <button className="detail-order-button" onClick={handleOrder}>Order</button>
                <button className="detail-buy-button">Buy</button>
            </div>
            </>
        }
    </div>
}
export default FoodPage;