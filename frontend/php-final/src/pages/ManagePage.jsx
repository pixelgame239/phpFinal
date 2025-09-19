import { useEffect, useState } from "react";
import { fetchTable, getTables } from "../services/Admin";
import { useGlobalContext } from "../GlobalContext";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../styles/manage.css";
import LoadingComponent from "../components/LoadingComponent";
import PaginationSection from "../components/PaginationSection";
import TableComponent from "../components/TableComponent";

const ManagePage = () => {
    const { userInfo, isLoading, setIsLoading } = useGlobalContext();
    const [tableData, setTableData] = useState([]);
    const [currentTable, setCurrentTable] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
    const [showDrawer, setShowDrawer] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tableContents, setTableContents] = useState([]);
    const nav = useNavigate();
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 800);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(()=>{
        const getTableName = async() =>{
            const tempData = await getTables();
            console.log(tempData);
            setTableData(tempData[0]);
            if(!currentTable){
                setCurrentTable(tempData[0][0]);
            }
        }
        if(!isLoading){
            if(!userInfo){
                nav("/");
            }
            else{
                if(userInfo.role!=="Admin"){
                    nav("/");
                }
                else{
                    getTableName();
                }
            }
        }
    },[isLoading, userInfo]);
    useEffect(()=>{
        const getTableContent = async ()=>{
            const tempData = await fetchTable(currentTable, currentPage);
            console.log(tempData);
            setTotalPages(tempData.totalPages);
            setTableContents(tempData.tableContents);
        }
        if(currentTable){
            getTableContent();
        }
    },[currentPage, currentTable, isLoading])
    if(isLoading){
        return <LoadingComponent></LoadingComponent>
    }
     return (
        <div>
            <BackButton />
            <h1 style={{ textAlign: "center" }}>Admin Manage Page</h1>
            <div className="manage-container">
                {isMobile && (
                    <button
                        className="toggle-drawer-button"
                        onClick={() => setShowDrawer(!showDrawer)}
                    >
                        {showDrawer ? "Hide Tables" : "Show Tables"}
                    </button>
                )}
                {(showDrawer || !isMobile) && (
                    <div className="manage-drawer">
                        {tableData.map((tableName, index) => (
                            <div
                                key={index}
                                className={`drawer-item ${
                                    currentTable === tableName
                                        ? "active-drawer"
                                        : ""
                                }`}
                                onClick={() => {
                                    setCurrentTable(tableName);
                                    setCurrentPage(1);
                                    if (isMobile) setShowDrawer(false);
                                }}
                            >
                                {tableName}
                            </div>
                        ))}
                    </div>
                )}
                <div className="manage-content">
                   <TableComponent tableContent={tableContents} currentTable={currentTable}></TableComponent>
                </div>
            </div>
            <PaginationSection currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}></PaginationSection>
        </div>
    );
};

export default ManagePage;