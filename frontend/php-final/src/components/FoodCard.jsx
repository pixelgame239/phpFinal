import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { useGlobalContext } from "../GlobalContext";
import api from "../API";
const FoodCart = ({data}) =>{
    const formattedPrice = new Intl.NumberFormat('vi-VN').format(data.price);
    const { userInfo, setUserInfo, cartItems, setCartItems } = useGlobalContext();
    const nav = useNavigate();
    const handleClick = () =>{
        nav(`/food${data.id}`)
    }
   const handleOrder = async (e, isBuy=false) =>{
         e.stopPropagation(); 
        const orderDetail = {
            foodID: data.id, quantity: 1
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
                sessionStorage.setItem("cartItems", JSON.stringify(newCartItems));
            }
            else{
                setCartItems([...cartItems, orderDetail]);
                sessionStorage.setItem("cartItems", JSON.stringify([...cartItems,orderDetail]));
            }
        }
        if(isBuy){
            nav("/cart");
        }
        // console.log(sessionStorage.getItem("cart_items"));
    }
    return <div className="card-container" onClick={handleClick}>
        <div className="card-img-container">        
            <img src={`http://localhost/final/backend/${data.food_image}`} alt={data.food_name} className="card-img">
            </img>
        </div>
        <p className="card-title">{data.food_name}</p>
        <p className="card-price">Price: {formattedPrice} VNĐ</p>
        <p className="card-description">{data.description}</p>
        <div className="card-buttons">
            <button className="card-order-button" onClick={handleOrder}>Order</button>
            <button className="card-buy-button" onClick={(e)=>handleOrder(e, true)}>Buy</button>
        </div>
    </div>
}
export default FoodCart;