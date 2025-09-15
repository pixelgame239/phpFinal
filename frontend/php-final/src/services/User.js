import api from "../API"

export const getDashBoard = async ()=>{
    try{
        const response = await api.post("handle_dashboard.php");
        if (response.data.error){
            console.log("Error")
            return []
        }
        else{
            console.log(response.data);
            return response.data;
        }
    } catch (error){
        console.error(error);
        return [];
    }
}
export const getUserInfo = async () =>{
    try{
        const response = await api.get("handle_auth.php");
        return response.data;
    } catch(err){
        console.error(err);
        return null;
    }
}