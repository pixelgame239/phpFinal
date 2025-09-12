import FoodCart from "./FoodCard";
import "../styles/home.css";
import { useGlobalContext } from "../GlobalContext";
import { useEffect, useState } from "react";
import api from "../API";
import LoadingComponent from "./LoadingComponent";

const MenuTabContent = () =>{
    const { fetchedFoods, setFetchedFoods, error, setError } = useGlobalContext();
    const categoryList = Array.isArray(fetchedFoods)
    ? [...new Set(fetchedFoods.map(food => food.category_name))]
    : [];
    const [inputValue, setInputValue] =useState("");
    const [priceFilter, setPriceFilter] = useState("all")
    const [categoryFilter,setCategoryFilter] = useState("all");
    const [displayFoods, setDisplayFoods] = useState(fetchedFoods);
    const [menuLoading, setMenuLoading] =useState(false);
    useEffect(()=>{
        let tempFoods = fetchedFoods;
        if(priceFilter==="lt50000"){
            tempFoods = tempFoods.filter(food=>Number(food.price)<50000);
        }
        else if(priceFilter==="gte50000"){
            tempFoods = tempFoods.filter(food=> Number(food.price)>=50000);
        }
        if (categoryFilter!=="all"){
            tempFoods = tempFoods.filter(food=>food.category_name === categoryFilter);
        }
        setDisplayFoods(tempFoods);
    }, [priceFilter, categoryFilter])
    const searchFoods = async(searchParams) =>{
            try{
                setMenuLoading(true);
            const response = await api.get("fetch_foods.php", {params:{
                parameter: searchParams
            }})
            if (response.data){
                    console.log(response.data);
                    setFetchedFoods(response.data);
                    setDisplayFoods(response.data);
                }
            else{
                console.log(response.data);
                setError(true);
            }    
            }catch (err){
                setError(true);
                console.error(err);
            }
            setMenuLoading(false);
        }
    return <div className="menu-food-container">
            {error?<p>Unexpected Error</p>:(
                <div>
                <div className="search-container">
                    <input className="search-input" placeholder="Search for food..." value={inputValue} onChange={(e)=>setInputValue(e.target.value)}></input>
                    <button type="button" className="search-button" onClick={ async ()=>{
                        await searchFoods(inputValue);
                        }}>Search</button>
                </div>
                <div className="filter-container">
                        <div className="filter-row">
                        <div className="filter">
                            <label className="filter-label">Price</label>
                            <select
                            className="filter-select"
                            value={priceFilter}
                            onChange={e => setPriceFilter(e.target.value)}
                            >
                            <option value="all">All</option>
                            <option value="lt50000">Below 50000</option>
                            <option value="gte50000">50000 and above</option>
                            </select>
                        </div>

                        <div className="filter">
                            <label className="filter-label">Category</label>
                            <select
                            className="filter-select"
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            >
                            <option key="all" value="all">All</option>
                            {categoryList.map(cat => (
                                <option key={cat} value={cat}>
                                {cat}
                                </option>
                            ))}
                            </select>
                        </div>
                        </div>
                    </div>
                {menuLoading?<LoadingComponent></LoadingComponent>:displayFoods.length===0?<p style={{textAlign:"center"}}>No food found</p>:(
                <>
                {categoryFilter!=="all"?<h1 style={{"textAlign":"center", color:"red"}}>{categoryFilter}</h1>:null}
                {categoryList.map((category, index)=>(
                    <div key={index}>
                        {categoryFilter==="all"?<h1 style={{"textAlign":"center", color:"red"}}>{category}</h1>:null}
                    <div className="food-grid">
                    {displayFoods.map((food)=>(
                        food.category_name === category?(
                            <FoodCart key={food.id} data={food}></FoodCart>
                        ):null
                    ))}
                    </div>
                    </div>
                )
                )}
                </>)}
                </div>
            )}
        </div>
}
export default MenuTabContent;