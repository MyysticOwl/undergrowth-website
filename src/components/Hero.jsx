import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Terminal } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-background">
                <div className="gradient-sphere sphere-1"></div>
                <div className="gradient-sphere sphere-2"></div>
            </div>

            <div className="container hero-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-content"
                >
                    <div className="hero-badge">
                        <span>v0.1.0 Community Preview</span>
                    </div>

                    <h1 className="hero-title">
                        The Universal Nervous System.
                    </h1>

                    <p className="hero-subtitle">
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No Cloud Required. One Binary. Zero Dependencies.</span>
                        <br />
                        Build powerful workflows that run everywhere from tiny edge devices
                        to enterprise servers. Your data stays yours.
                    </p>

                    <div className="hero-actions">
                        <a href="https://github.com/MyysticOwl/undergrowth" target="_blank" rel="noopener noreferrer" className="btn-primary">
                            <Download size={20} />
                            Download Now
                        </a>
                        <a href="/docs" className="btn-secondary">
                            <Terminal size={20} />
                            Documentation
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hero-visual"
                >
                    <div className="glass-panel visual-card">
                        <img src="/hero_nerve_center.png" alt="Undergrowth Nerve Center" className="hero-image" />
                        <div className="visual-glow"></div>
                        <div className="visual-overlay"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
