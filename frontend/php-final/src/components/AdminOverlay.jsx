import { useState, useEffect } from "react";
import "../styles/manage.css";
import { addFood, deleteCategory, deleteFood, editCategory, insertCategory, updateFood } from "../services/Admin";
import { useGlobalContext } from "../GlobalContext";

const AdminOverlay = ({ overlayType, rowData = {}, currentTable, setIsOverlay, categories }) => {
    const { setIsLoading } = useGlobalContext();
    const [formData, setFormData] = useState({});
    const [previewImage, setPreviewImage]= useState(null);

    useEffect(() => {
        if (overlayType === "add") {
            setFormData(currentTable === "category"
                ? { category_name: "" }
                : currentTable === "foods"
                ? {
                    food_name: "",
                    cat_id: "",
                    description: "",
                    price: "",
                    food_image: "",
                    order_count: ""
                } : {});
                setPreviewImage(null);
        } else if (overlayType === "edit") {
            setFormData(currentTable === "category"
                ? { category_name: rowData.category_name }
                : currentTable === "foods"
                ? {
                    food_name: rowData.food_name,
                    cat_id: rowData.cat_id,
                    description: rowData.description,
                    price: rowData.price,
                    food_image: rowData.food_image,
                    order_count: rowData.order_count
                } : {});
                setPreviewImage(rowData.food_image ? `http://online-restaurant.great-site.net/final/backend/${rowData.food_image}?t=${Date.now()}` : null);
        }
    }, [overlayType, rowData, currentTable, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, food_image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);
        let resStatus;
        if(currentTable==="category"){
            if(overlayType==="add"){
                resStatus = await insertCategory(formData.category_name);
            }
            else if(overlayType==="edit"){
                resStatus =await editCategory(rowData.id, formData.category_name);
            }
        }
        else if(currentTable==="foods"){
            const sendData = new FormData();
                for(const key in formData){
                    sendData.append(key, formData[key])
            }
            if(overlayType==="add"){
                resStatus = await addFood(sendData);
            }
            else if(overlayType==="edit"){
                sendData.append('id', rowData.id);
                resStatus = await updateFood(sendData);
            }
        }
        if(resStatus){
            alert("Successfully");
        }
        else{
            alert("Unexpected error");
        }
        setIsLoading(false);
        setIsOverlay(false);
    };
    const handleDelete = async()=>{
        setIsLoading(true);
        let resStatus;
        if(currentTable==="category"){
            resStatus = await deleteCategory(rowData.id);
        }
        if(currentTable==="foods"){
            resStatus= await deleteFood(rowData.id);
        }
        if(resStatus){
            alert("Successfully");
        }
        else{
            alert("Unexpected error");
        }
        setIsLoading(false);
        setIsOverlay(false);
    }

    return (
        <div className="admin-overlay">
            <div className="admin-overlay-box">
                {overlayType === "delete" ? (
                    <>
                        <p>Are you sure you want to delete this item?</p>
                        <div className="admin-overlay-buttons">
                            <button onClick={handleDelete} className="admin-positive-button">Yes</button>
                            <button onClick={() => setIsOverlay(false)} className="admin-negative-button">No</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>{overlayType === "add" ? "Add New" : "Edit Item"}</h2>
                        <form onSubmit={handleSubmit}>
                            {Object.keys(formData).map((key) => (
                                <div key={key} className="admin-form-group">
                                    <label>{key}</label>
                                    {key==="cat_id"?(
                                        <select name={key} value={formData[key]} onChange={handleChange}>
                                            <option value="">Select a Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    ): key==="food_image"?(
                                        <>{previewImage && (
                                                <img 
                                                    src={previewImage} 
                                                    alt="Food Preview" 
                                                    style={{ maxHeight: "100px", maxWidth: "100px" }}
                                                />
                                            )}<input type="file" name={key} onChange={handleFileChange} />
                                            </>
                                    ):(
                                         <input
                                        type="text"
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        disabled={key==="order_count"}
                                        />
                                    )
                                }
                                </div>
                            ))}
                            <div className="admin-overlay-buttons">
                                <button type="submit" className="admin-positive-button">Save</button>
                                <button type="button" className="admin-negative-button" onClick={() => setIsOverlay(false)}>Cancel</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminOverlay;
