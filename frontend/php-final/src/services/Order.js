import api from "../API"

export const fetchOrders = async (userID, currentPage)=>{
    const response = await api.post("order_operation.php", {action:"fetchOrders", userID: userID, currentPage: currentPage});
    if(response.data.status){
        console.error(response);
        return [];
    }
    else{
        return response.data;
    }
}
export const updateOrders = async (orders)=>{
    const response = await api.post("order_operation.php", {action:"updateOrder", orderID: orders.orderID, total:parseInt(orders.total), orderItems: orders.orderItems});
    if(response.data.status==="OK"){
        console.log(response);
        return true;
    }
    else{
        console.log(response);
        return false;
    }
}
export const deleteOrders = async (orderID)=>{
    const response = await api.post("order_operation.php", {action:"deleteOrder", orderID: orderID});
    if(response.data.status==="OK"){
        console.log(response);
        return true;
    }
    else{
        console.log(response);
        return false;
    }
}
export const cancelOrders = async(orderID)=>{
    const response = await api.post("order_operation.php", {action:"cancelOrder", orderID: orderID});
        if(response.data.status==="OK"){
        console.log(response);
        return true;
    }
    else{
        console.log(response);
        return false;
    }
}