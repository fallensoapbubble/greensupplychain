import React from 'react';
import './Footer.css'; // Optional: Add styles for the footer

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Green Supply Chain. All rights reserved.</p>
                <p>
                    Follow us on: 
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"> Twitter </a> | 
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"> Facebook </a> | 
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"> LinkedIn </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;