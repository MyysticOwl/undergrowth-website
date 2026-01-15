import React from 'react';
import { Heart, Bug, Lightbulb, MessageCircle } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <img src="/icon.svg" alt="Undergrowth" className="footer-icon" />
                        <span className="footer-tagline">The Universal Nervous System</span>
                    </div>

                    <div className="footer-community">
                        <h4 className="footer-section-title">Community</h4>
                        <div className="community-links">
                            <a
                                href="https://github.com/MyysticOwl/undergrowth-community/issues/new?labels=bug"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="community-link"
                            >
                                <Bug size={18} />
                                <span>Report a Bug</span>
                            </a>
                            <a
                                href="https://github.com/MyysticOwl/undergrowth-community/issues/new?labels=enhancement"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="community-link"
                            >
                                <Lightbulb size={18} />
                                <span>Request a Feature</span>
                            </a>
                            <a
                                href="https://github.com/MyysticOwl/undergrowth-community/discussions"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="community-link"
                            >
                                <MessageCircle size={18} />
                                <span>Discussions</span>
                            </a>
                        </div>
                    </div>

                    <div className="footer-donation">
                        <Heart size={18} className="heart-icon" />
                        <p>
                            Enjoying the community edition? If Undergrowth has helped automate your world,
                            consider <a
                                href="https://undergrowth.lemonsqueezy.com/checkout/buy/5a1d60df-5b51-4377-8ae0-1b07e8d374e7?embed=1&logo=0"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="donation-link lemonsqueezy-button"
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
