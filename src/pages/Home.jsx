import React from 'react';
import { Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import McpShowcase from '../components/McpShowcase';
import Showcase from '../components/Showcase';
import Features from '../components/Features';
import Roles from '../components/Roles';
import Download from '../components/Download';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="home-page">
            <Navbar />
            <Hero />
            <McpShowcase />
            <Showcase />
            <Features />
            <Roles />
            <Pricing />
            <Download />
            <Footer />
        </div>
    );
};

export default Home;
