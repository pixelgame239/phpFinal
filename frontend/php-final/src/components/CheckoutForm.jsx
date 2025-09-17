import React, { useState } from "react";
import "../styles/checkout.css"; 
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ onConfirm, onCancel, total }) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const nav = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const customerInfo = { name, address, phone, paymentMethod };
        onConfirm(customerInfo);
        nav("/thanks", {state: {customerInfo, total}});
    };

    return (
        <div className="overlay-background">
            <div className="checkout-form-container">
                <h3>Confirm Your Order</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Address:</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Phone:</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Payment Method:</label>
                        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option value="Cash on Delivery">Cash on Delivery</option>
                            <option value="Banking">Card</option>
                        </select>
                    </div>
                    <div className="form-total">
                        Total: {new Intl.NumberFormat('vi-VN').format(total)}
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onCancel}>Cancel</button>
                        <button type="submit">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutForm;