import { useEffect, useState } from "react";
import { useGlobalContext } from "../GlobalContext";
import { getCartFood } from "../services/Food";
import LoadingComponent from "../components/LoadingComponent";
import "../styles/order.css";
import BackButton from "../components/BackButton";
import api from "../API";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm";

const CartPage = () =>{
    const { cartItems, setCartItems, userInfo, setUserInfo } = useGlobalContext(); 
    const [cartDetail, setCartDetail] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);
    const [showCheckout, setShowCheckout] = useState(false);
    const nav = useNavigate();
    const handleQuantityChange = async(itemID, newQuantity) => {
        setIsLoading(true);
        if (newQuantity <= 0 || isNaN(newQuantity)){
                newQuantity = 1;
        }
        const updatedCart = cartDetail.map((item) => {
            if (item.id === itemID) {
                item.quantity = newQuantity;
                item.itemPrice = newQuantity * parseInt(item.price);
            }
            return item;
        });
        const updateCartItems = cartItems.map((item)=>{
            if(item.foodID===itemID){
                item.quantity = newQuantity;
            }
            return item;
        });
        if(userInfo){
            const updateUserInfo = {
                ...userInfo,
                cart_items: updateCartItems
            }
            try{
                const response = await api.post("order_operation.php", {action:"updateCart", cartItems: JSON.stringify(updateCartItems), userID: userInfo.userID});
                if(response.data.status==="OK"){
                    setUserInfo(updateUserInfo);
                    setCartItems(updateCartItems);
                    setCartDetail(updatedCart);
                }
            }catch(error){
                console.error(error);
            }
        }
        else{
                setCartItems(updateCartItems);
                setCartDetail(updatedCart);
                sessionStorage.setItem("cartItems", updateCartItems);
        }
        setIsLoading(false);
    };
    const handleRemove= async(itemID) =>{
        setIsLoading(true);
            const updatedCartDetail = cartDetail.filter(item => item.id !== itemID);
            const updatedCartItems = cartItems.filter(item => item.foodID !== itemID);
            if (userInfo) {
                const updateUserInfo = {
                    ...userInfo,
                    cart_items: updatedCartItems,
                };
                try {
                    const response = await api.post("order_operation.php", {
                        action: "updateCart",
                        cartItems: JSON.stringify(updatedCartItems),
                        userID: userInfo.userID,
                    });
                    if (response.data.status === "OK") {
                        setUserInfo(updateUserInfo);
                        setCartItems(updatedCartItems);
                        setCartDetail(updatedCartDetail);
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                setCartItems(updatedCartItems);
                setCartDetail(updatedCartDetail);
                sessionStorage.setItem("cartItems", updatedCartItems);
            }

            setIsLoading(false);
        };
    const handleConfirmOrder = async (formData) =>{
        setIsLoading(true);
        try{
            let UID = 3
            if(userInfo){
                UID = userInfo.userID;
                await api.post("order_operation.php",{action:"updateCart", cartItems:"[]", userID: UID})
            }
            else{
                sessionStorage.setItem("cartItems", "[]");
            }
            const response = await api.post("order_operation.php", {
                action: "confirmOrder",
                cartItems: cartDetail,
                userID: UID,
                total:cartTotal
            });
            if(response.data.status==="OK"){
                setCartDetail([]);
                setCartItems([]);
            }
            else{
                console.error(response);
            }
        } catch(err){
            console.error(err);
        }
        setIsLoading(false);
    }
    const handleShowCheckout = () =>{
        setShowCheckout(true);
    }
    
    useEffect(()=>{
        const loadCartDetail = async() =>{
            if (cartItems.length === 0) return;
            setIsLoading(true);
            const cartData = await getCartFood(cartItems);
            setCartDetail(cartData);
            setIsLoading(false);
        }
        loadCartDetail();
        console.log(cartDetail);
    },[cartItems])
    useEffect(()=>{
        let tempTotal = 0;
            cartDetail.forEach(cart => {
                tempTotal += (parseInt(cart.quantity) * parseInt(cart.price));
        });
        setCartTotal(tempTotal);
    },[cartDetail])
    return <>
            <BackButton></BackButton>
    <div className="cart-container">
        {cartItems.length===0?(<p>You haven't add any food to cart</p>):
        isLoading?(<LoadingComponent></LoadingComponent>):
             (cartDetail.map((item)=>{
                return(
            <div className="cart-item-container">
                <img src={`http://localhost/final/backend/${item.food_image}`} className="cart-image"></img>
                <div className="cart-name">
                    <p>{item.food_name}</p>
                    <p style={{color:"red", fontWeight:'bold'}}>{new Intl.NumberFormat('vi-VN').format(item.price)}</p>
                </div>
                <div><input  className="cart-input" type="number" value={item.quantity} onChange={(e)=>handleQuantityChange(item.id, parseInt(e.target.value))} min="1"></input></div>
                <div className="cart-item-total">
                    <p>Total</p>
                    {new Intl.NumberFormat('vi-VN').format(parseInt(item.itemPrice))}</div>
                    <button style={{position:"absolute", top:"-11px", right:"-9px", border:"none", background:"transparent", cursor:"pointer", fontSize:"1.2rem"}} onClick={()=>handleRemove(item.id)}>
                        ❌
                    </button>
            </div>
                )
        }))}
    </div>
    {cartItems.length===0?null:<><p className="all-cart-total">Cart total: {new Intl.NumberFormat('vi-VN').format(parseInt(cartTotal))}</p>
    <button className="confirm-order-btn" onClick={handleShowCheckout}>Confirm Order</button></>}
        {showCheckout && (
                    <CheckoutForm 
                        onConfirm={handleConfirmOrder} 
                        onCancel={() => setShowCheckout(false)} 
                        total={cartTotal}
                    />
        )}
    </> 
}
export default CartPage;