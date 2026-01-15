import React, { useState } from 'react';
import { ChevronRight, Maximize2, X } from 'lucide-react';
import './Showcase.css';

const SHOWCASE_ITEMS = [
    {
        id: 'blueprints',
        title: 'Visual Workflow Design',
        description: 'Design complex automation flows with our drag-and-drop blueprint editor. Visualize logic, data flow, and dependencies in real-time.',
        image: '/blueprint_screenshot.png',
        tag: 'Design'
    },
    {
        id: 'rag',
        title: 'RAG Knowledge Assistant',
        description: 'Build intelligent knowledge bases that can answer questions, summarize documents, and assist with research using local LLMs.',
        image: '/rag_assistant_screenshot.png',
        tag: 'AI Agent'
    },
    {
        id: 'video',
        title: 'Real-time Video Security',
        description: 'Deploy advanced video analytics pipelines for motion detection, object recognition, and security monitoring on edge devices.',
        image: '/video_security_screenshot.png',
        tag: 'Computer Vision'
    },
    {
        id: 'sentinel',
        title: 'Industrial IoT Sentinel',
        description: 'Monitor factory equipment with vibration sensors, trigger maintenance alerts, and log critical events—all running locally without cloud dependencies.',
        image: '/Sentinel_screenshot.png',
        tag: 'Industrial IoT'
    }
];

const Showcase = () => {
    const [activeItem, setActiveItem] = useState(0);
    const [isLightboxOpen, setLightboxOpen] = useState(false);

    return (
        <section id="showcase" className="showcase-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Built for Real-World Applications</h2>
                    <p className="section-subtitle">
                        From visual programming to edge AI, Undergrowth powers diverse automation needs.
                    </p>
                </div>

                <div className="showcase-container glass-panel">
                    <div className="showcase-nav">
                        {SHOWCASE_ITEMS.map((item, index) => (
                            <button
                                key={item.id}
                                className={`showcase-nav-item ${index === activeItem ? 'active' : ''}`}
                                onClick={() => setActiveItem(index)}
                            >
                                <div className="nav-item-content">
                                    <span className="nav-item-tag">{item.tag}</span>
                                    <h3 className="nav-item-title">{item.title}</h3>
                                    <p className="nav-item-desc">{item.description}</p>
                                </div>
                                <ChevronRight className={`nav-arrow ${index === activeItem ? 'active' : ''}`} size={20} />
                            </button>
                        ))}
                    </div>

                    <div className="showcase-display">
                        {SHOWCASE_ITEMS.map((item, index) => (
                            <div
                                key={item.id}
                                className={`showcase-image-wrapper ${index === activeItem ? 'active' : ''}`}
                            >
                                <div className="image-overlay-gradient"></div>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="showcase-image"
                                />
                                <button
                                    className="expand-btn"
                                    aria-label="View full image"
                                    onClick={() => setLightboxOpen(true)}
                                >
                                    <Maximize2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isLightboxOpen && (
                <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
                            <X size={24} />
                        </button>
                        <img
                            src={SHOWCASE_ITEMS[activeItem].image}
                            alt={SHOWCASE_ITEMS[activeItem].title}
                            className="lightbox-image"
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default Showcase;
