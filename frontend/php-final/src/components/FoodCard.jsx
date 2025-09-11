import "../styles/home.css";
const FoodCart = ({data}) =>{
    const formattedPrice = new Intl.NumberFormat('vi-VN').format(data.price);
    return <div className="card-container">
        <div className="card-img-container">        
            <img src={`../${data.food_image}`} alt={data.food_name} className="card-img">
            </img>
        </div>
        <p className="card-title">{data.food_name}</p>
        <p className="card-price">Price: {formattedPrice} VNĐ</p>
        <p className="card-description">{data.description}</p>
    </div>
}
export default FoodCart;