import api from "../API"

export const getFoodByID= async(foodID) =>{
    try{
        const response = await api.get("fetch_foods.php", {params:{ productID: foodID }});
        console.log(response.data);
        return response.data;
    } catch(error){
        console.error(error);
        return null;
    }
}
export const getCartFood = async(cartItems)=>{
    let cartItemData = []
    for (const item of cartItems){
        const temp =await getFoodByID(item.foodID);
        temp['quantity'] = item.quantity;
        temp['itemPrice']= parseInt(item.quantity) * parseInt(temp.price);
        cartItemData.push(temp);
    }
    return cartItemData;
}