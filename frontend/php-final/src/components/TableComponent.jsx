import { useEffect, useState } from "react";
import { useGlobalContext } from "../GlobalContext";
import { getCategories, updateOrderStatus } from "../services/Admin";
import "../styles/manage.css";
import AdminOverlay from "./AdminOverlay";

const TableComponent = ( {tableContent, currentTable} ) =>{
    if (!tableContent || tableContent.length === 0) return <p>No data available</p>;
    const columns = Object.keys(tableContent[0]);
    const { setIsLoading } = useGlobalContext();
    const statusOptions = ["Pending", "Preparing", "Delivered", "Cancelled"];
    const [isOverlay, setIsOverlay] = useState(false);
    const [overlayType, setOverlayType] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [categories, setCategories] = useState([]);
    useEffect(()=>{
        const fetchCategories = async () =>{
            const tempData = await getCategories();
            console.log(tempData[0].category_name);
            setCategories(tempData);
        }
        if(currentTable==="foods"){
            fetchCategories();
        }
    },[currentTable])
    const handleStatusChange = async(orderID, newStatus)=>{
        setIsLoading(true);
        await updateOrderStatus(orderID, newStatus);
        setIsLoading(false);
    }
    const handleAdd = async()=>{
        setIsOverlay(true);
        setOverlayType("add");
    }
    const handleDelete = async(rowData) =>{
        setIsOverlay(true);
        setOverlayType("delete");
        setSelectedRow(rowData);
    }
    const handleEdit = (rowData) =>{
        setIsOverlay(true);
        setOverlayType("edit");
        setSelectedRow(rowData);
    }
    return (<div style={{ overflowX:"auto", width:"100%"}}>
        {currentTable==="category" || currentTable==="foods"?<button className="manage-add-button" onClick={handleAdd}>Add</button>: null}
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
                <tr>
                    {columns.map((col, index) => (
                        <th key={index}>{col}</th>
                    ))}
                    {currentTable==="category" || currentTable==="foods"?<th>Operation</th>:null}
                </tr>
            </thead>
            <tbody>
                {tableContent.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                    {columns.map((col, colIndex) => (
                        <td key={colIndex}>
                            {col === "status" ? (
                                <select
                                    value={row[col]}
                                    onChange={(e) => handleStatusChange(row.order_id, e.target.value)}
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : col === "food_image" ? (
                                <img
                                    src={`http://localhost/final/backend/${row[col]}`}
                                    alt="food"
                                    style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover" }}
                                />
                            ) : (
                                row[col]
                            )}
                        </td>
                    ))}
                    {currentTable==="category" || currentTable==="foods"?
                    <td>
                        <div style={{justifyContent:"center", alignItems:"center", display:"flex"}}>
                            <button className="manage-edit-button" onClick={()=>handleEdit(row)}>Edit</button>
                            <button className="manage-delete-button" onClick={()=>handleDelete(row)}>Delete</button>
                        </div>
                    </td>:null}
                </tr>
                ))}
            </tbody>
        </table>
        {isOverlay && (
                <AdminOverlay
                    overlayType={overlayType}
                    rowData={selectedRow}
                    currentTable={currentTable}
                    setIsOverlay={setIsOverlay}
                    categories={categories}
                />
            )}
        </div>
    );
};

export default TableComponent;