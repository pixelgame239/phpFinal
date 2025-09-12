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
        <div className="card-buttons">
            <button className="card-order-button">Order</button>
            <button className="card-buy-button">Buy</button>
        </div>
    </div>
}
export default FoodCart;