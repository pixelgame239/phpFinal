import FoodCart from "../components/FoodCard";
import "../styles/home.css";

const HomeTabContent = ({topFoods, error}) =>{
    return <div>
    <h1 style={{"textAlign":"center", color:"red"}}>👑Best Seller Foods👑</h1>
        <div className="best-seller-container">
            {error?<p>Unexpected Error</p>:(
                topFoods.map((food)=>(
                    <FoodCart key={food.id} data={food}></FoodCart>
                ))
            )}
        </div>
    </div>
}
export default HomeTabContent;