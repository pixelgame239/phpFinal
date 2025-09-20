import api from "../API"

export const getTables = async() =>{
    const response = await api.post("manage_admin.php", {action: "getTables"});
    if(response.data.status){
        console.error(response);
        return [];
    }
    else{
        return response.data;
    }
}
export const fetchTable = async(tableName, currentPage)=>{
    const response = await api.post("manage_admin.php", {action:"fetchTable", tableName: tableName, currentPage: currentPage});
    if(response.data.status){
        console.error(response);
        return [];
    }
    else{
        return response.data;
    }
}
export const updateOrderStatus = async(orderID, newStatus) =>{
    const response = await api.post("manage_admin.php", {action: "updateOrderStatus", orderID:orderID, newStatus: newStatus});
    if(response.data.status==="Error"){
        console.error(response);
    }
    else{
        console.log("Updated")
    }
}
export const editCategory = async(categoryID, categoryName)=>{
    const response = await api.post("manage_admin.php", {action: "editCategory", categoryID: categoryID, categoryName: categoryName});
    if(response.data.status==="Error"){
        console.error(response);
        return false;
    }
    else{
        console.log("Updated")
        return true;
    }
}
export const insertCategory = async(categoryName)=>{
    const response = await api.post("manage_admin.php", {action:"insertCategory", categoryName:categoryName});
    if(response.data.status==="Error"){
        console.error(response);
        return false;
    }
    else{
        console.log("Updated")
        return true;
    }
}
export const deleteCategory = async(categoryID)=>{
    const response = await api.post("manage_admin.php", {action:"deleteCategory", categoryID: categoryID});
    if(response.data.status==="Error"){
        console.error(response);
        return false;
    }
    else{
        console.log("Deleted")
        return true;
    }
}
export const updateFood = async(foodData) =>{
    try{
        const response = await api.post("manage_admin.php?action=updateFood", foodData, {headers:{
            'Content-Type': 'multipart/form-data',
        },});
        return response.data.status === 'OK';
    } catch(err){
        console.error(err);
        return false;
    }
}
export const addFood = async(foodData)=>{
    try{
        const response = await api.post("manage_admin.php?action=addFood", foodData, {headers:{
            'Content-Type': 'multipart/form-data',
        },});
        return response.data.status === 'OK';
    } catch(err){
        console.error(err);
        return false;
    }
}
export const deleteFood = async(foodID)=>{
    const response = await api.post("manage_admin.php", {action:"deleteFood", foodID: foodID});
    if(response.data.status==="Error"){
        console.error(response);
        return false;
    }
    else{
        console.log("Updated")
        return true;
    }
}
export const getCategories = async()=>{
    const response = await api.post("manage_admin.php", {action:"getCategories"});
    if(response.data.status==="Error"){
        console.error(response);
        return [];
    }
    else{
        return response.data;
    }
}