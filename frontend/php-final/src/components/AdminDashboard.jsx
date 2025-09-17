import { useEffect, useState } from "react";
import "../styles/home.css";
import { getDashBoard } from "../services/User";
import { data } from "react-router-dom";
import LoadingComponent from "./LoadingComponent";

const AdminDashboard = () =>{
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState();
    const [isError, setIsError] = useState(false);
    useEffect(()=>{
        const fetchDashboard = async () => {
            setIsLoading(true);
            const data = await getDashBoard();
            if (data.length===0){
                setIsLoading(false);
                setIsError(true);
            }
            else{
                setIsLoading(false)
                setDashboardData(data);
            }
        }
        fetchDashboard();
    },[])
    return <div>
        <h1 className="dashboard-header" style={{margin: "20px"}}>Dashboard</h1>
        {isLoading?<LoadingComponent></LoadingComponent>: isError? <p>Unexpected Error</p>:
        <div className="dashboard-container">
            <div className="dashboard-customer">Total customers: {dashboardData.customerCount}</div>
            <div className="dashboard-order">Total orders: {dashboardData.orderCount}</div>
            <div className="dashboard-revenue">Revenue: {new Intl.NumberFormat('vi-VN').format(dashboardData.revenueData)} VNĐ</div>
        </div>}
    </div>
}
export default AdminDashboard;