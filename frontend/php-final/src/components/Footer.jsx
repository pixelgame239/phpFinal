import React from 'react';
import "../styles/footer.css"; 

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Virtual Address</h4>
          <p>1234 Restaurant St., Food City, TastyLand</p>
        </div>
        <div className="footer-section">
          <h4>Phone</h4>
          <p>+84 123 456 789</p>
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
