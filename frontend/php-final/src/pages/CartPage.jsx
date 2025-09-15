import { useEffect, useState } from "react";
import { useGlobalContext } from "../GlobalContext";
import { getCartFood } from "../services/Food";
import LoadingComponent from "../components/LoadingComponent";
import "../styles/order.css";

const CartPage = () =>{
    const { cartItems, setCartItems } = useGlobalContext(); 
    const [cartDetail, setCartDetail] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=>{
        const loadCartDetail = async() =>{
            if (cartItems.length === 0) return;
            setIsLoading(true);
            const cartData = await getCartFood(cartItems);
            setCartDetail(cartData);
            setIsLoading(false);
        }
        loadCartDetail();
        console.log(cartItems['quantity']);
    },[])
    return <div className="cart-container">
        {cartItems.length===0?(<p>You haven't add any food to cart</p>):
        isLoading?(<LoadingComponent></LoadingComponent>):
             (cartDetail.map((item)=>{
                return(
            <div className="cart-item-container">
                <img src={`http://localhost/final/backend/${item.food_image}`} className="cart-image"></img>
                <div className="cart-name">{item.food_name}</div>
                <div className="cart-input"><input value={item.quantity}></input></div>
                <div className="cart-item-total">{parseInt(item.quantity)*parseInt(item.price)}</div>
            </div>
                )
        }))}
    </div>
}
export default CartPage;