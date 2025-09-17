import { useLocation, useNavigate } from "react-router-dom";

const ThankYouPage = () =>{
    const location = useLocation();
    const { customerInfo, total } = location.state || {};
    const nav = useNavigate();
    return <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
        <h1>Thank you!</h1>
        <p>Name: {customerInfo.name}</p>
        <p>Address: {customerInfo.address}</p>
        <p>Phone: {customerInfo.phone}</p>
        <p>Payment method: {customerInfo.paymentMethod}</p>
        <p style={{fontWeight: "bold", color:"red"}}>Total: {new Intl.NumberFormat('vi-VN').format(total)}</p>
        <p style={{fontStyle:"italic", margin:"20px", fontSize:"1.2rem"}}>Your order is being processed, wait at the table for some minutes</p>
        <button style={{color: "white", backgroundColor:"red", padding:"30px", border:"none", borderRadius:"16px", cursor:"pointer", fontSize:"1.5rem", fontWeight:"bold", marginTop:"50px"}} onClick={()=>nav("/")}>Back to home</button>
    </div>
}
export default ThankYouPage;