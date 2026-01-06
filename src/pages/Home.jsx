import React from 'react';
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
                    <p>© 2026 Undergrowth. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
