import React from 'react';
import { Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-donation">
                        <Heart size={18} className="heart-icon" />
                        <p>
                            Enjoying the community edition? If Undergrowth has helped automate your world,
                            consider <a
                                href="https://undergrowth.lemonsqueezy.com/donate"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="donation-link"
                            >leaving a donation</a> to support the creator and keep the project growing.
                        </p>
                    </div>
                    <p className="footer-copyright">© 2026 Undergrowth. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
