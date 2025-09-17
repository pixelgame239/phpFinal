import api from "../API"

export const fetchOrders = async (userID)=>{
    const response = await api.post("order_operation.php", {action:"fetchOrders", userID: userID});
    if(response.data.status){
        console.error(response);
        return [];
    }
    else{
        return response.data;
    }
}