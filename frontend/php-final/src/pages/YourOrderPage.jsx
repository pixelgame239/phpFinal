import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../GlobalContext";
import { useEffect, useState } from "react";
import LoadingComponent from "../components/LoadingComponent";
import { cancelOrders, deleteOrders, fetchOrders, updateOrders } from "../services/Order";
import BackButton from "../components/BackButton";
import "../styles/order.css";

const YourOrderPage = () =>{
    const { userInfo, isLoading, setIsLoading } = useGlobalContext();
    const [orderDetails, setOrderDetails] = useState([]);
    const [editOrder, setEditOrder] = useState(null);
    const nav = useNavigate();
    const handleQuantityChange = (orderID, itemIndex, newQuantity) => {
        if (newQuantity <= 0 || isNaN(newQuantity)){
                newQuantity = 1;
        }
        setOrderDetails(prevOrders =>
            prevOrders.map(order => {
                if (order.orderID === orderID) {
                    const updatedItems = [...order.orderItems];
                    const oldItem = updatedItems[itemIndex];
                    const oldPrice = oldItem.price;
                    const newPrice = oldItem.unitPrice * newQuantity;
                    updatedItems[itemIndex] = {
                        ...oldItem,
                        quantity: parseInt(newQuantity),
                        price: newPrice
                    }
                    const newTotal = order.total - oldPrice + newPrice;
                    return { ...order, total: newTotal, orderItems: updatedItems };
                }
                return order;
            })
        );
};

    useEffect(()=>{
        const getOrders = async() =>{
            const tempData = await fetchOrders(userInfo.userID)
            setOrderDetails(tempData.orderDetails);
            console.log(tempData.orderDetails);
            console.log(tempData.orderDetails.orderItems);
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
<table className="order-table">
    <thead>
        <tr>
            <th>Order Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Operation</th>
        </tr>
    </thead>
    <tbody>
        {orderDetails.map((order) => (
            <tr key={order.orderID}>
                <td style={{ verticalAlign: 'top', padding: '10px' }}>
                    {order.orderItems.length > 0 ? (
                        order.orderItems.map((item, index) => (
                            <p key={index} style={{ margin: '4px 0' }}>
                                {item.food_name}: {new Intl.NumberFormat('vi-VN').format(item.unitPrice)} x{" "}
                                <input value={item.quantity} disabled={editOrder!==order.orderID} style={{ width: '15px' }} onChange={(e)=>handleQuantityChange(order.orderID, index, e.target.value)} /> ={" "}
                                {new Intl.NumberFormat('vi-VN').format(item.price)}
                            </p>
                        ))
                    ) : (
                        <p>No items in this order</p>
                    )}
                </td>
                <td style={{ padding: '10px', verticalAlign: 'top', textAlign:"center"}}>
                    {new Intl.NumberFormat('vi-VN').format(order.total)}
                </td>
                <td style={{ padding: '10px', textAlign:"center" }}>{order.status}</td>
                <td style={{ padding: '10px', textAlign:"center"}}>{order.created_at}</td>
                <td>
                    {order.status==="Pending"?
                    <div className="order-op-buttons">
                        <button className="order-update-button" onClick={async()=>{
                            if(editOrder===order.orderID){
                                setEditOrder(null);
                                setIsLoading(true);
                                const updateStatus = await updateOrders(order);
                                if(updateStatus){
                                    alert("Update successfully")
                                }
                                else{
                                    alert("Cannot update order");
                                }
                                setIsLoading(false);
                            }
                            else{
                                setEditOrder(order.orderID);
                            }
                        }}>
                            {editOrder===order.orderID?"Save":"Update"}
                        </button>
                        <button className="order-cancel-button" onClick={async()=>{
                            setIsLoading(true);
                            const cancelStatus = await cancelOrders(order.orderID);
                            if(cancelStatus){
                                alert("Cancel successfully");
                            }
                            else{
                                alert("Cannot cancel the order");
                            }
                            setIsLoading(false);                            
                        }}>Cancel Order</button>
                    </div>:<p>The order cannot be modified</p>}
                </td>
            </tr>
        ))}
    </tbody>
</table>
                {/* {orderDetails.map((order)=>{
                    return <div className="order-container">
                            <div className="order-description">
                                {order.orderItems.map((item)=>{
                                    return <p>{item.food_name}: {new Intl.NumberFormat('vi-VN').format(item.unitPrice)} x <input value={item.quantity} disabled></input> = {new Intl.NumberFormat('vi-VN').format(item.price)}</p>
                                })}
                            </div>
                            <div className="order-total">
                                {new Intl.NumberFormat('vi-VN').format(order.total)}
                            </div>
                            <div className="order-status">
                                {order.status}
                            </div>
                            <div className="order-date">{order.created_at}</div>
                        </div>
                })} */}
    </div>
}
export default YourOrderPage;