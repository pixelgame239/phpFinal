import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import { GlobalProvider } from './GlobalContext';
import FoodPage from './pages/FoodPage';
import CartPage from './pages/CartPage';
import ThankYouPage from './pages/ThankYouPage';
import YourOrderPage from './pages/YourOrderPage';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element ={<LoginPage />} />
            <Route path=':productid' element={<FoodPage></FoodPage>}></Route>
            <Route path='/cart' element={<CartPage></CartPage>}></Route>
            <Route path='/thanks' element={<ThankYouPage></ThankYouPage>}></Route>
            <Route path='/yourorders' element={<YourOrderPage></YourOrderPage>}></Route>
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
