import React from 'react';
import { Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Roles from '../components/Roles';
import Download from '../components/Download';
import Pricing from '../components/Pricing';

const Home = () => {
    return (
        <div className="home-page">
            <Navbar />
            <Hero />
            <Features />
            <Roles />
            <Pricing />
            <Download />
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
        </div>
    );
};

export default Home;
