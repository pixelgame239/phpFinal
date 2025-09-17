import React from 'react';
import "../styles/footer.css"; 

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Address</h4>
          <p>Nam Tu Liem, Ha Noi</p>
        </div>
        <div className="footer-section">
          <h4>Phone</h4>
          <p>+84 0000 000</p>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-media">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Online Restaurant Ordering | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
