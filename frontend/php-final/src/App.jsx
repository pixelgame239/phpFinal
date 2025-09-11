import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import { GlobalProvider } from './GlobalContext';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element ={<LoginPage />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
