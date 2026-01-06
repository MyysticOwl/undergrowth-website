import React from 'react';
import { Download as DownloadIcon, Github } from 'lucide-react';
import './Download.css';

const Download = () => {
    return (
        <section className="download-section">
            <div className="container">
                <div className="glass-panel download-card">
                    <div className="download-content">
                        <h2 className="section-title">Ready to Automate?</h2>
                        <p className="section-subtitle">
                            Get started with Undergrowth today. Open source and free for likely use cases.
                        </p>

                        <div className="download-actions">
                            <a href="https://github.com/MyysticOwl/undergrowth-website/releases" target="_blank" rel="noopener noreferrer" className="btn-primary btn-large">
                                <DownloadIcon size={24} />
                                Download Latest Release
                            </a>
                        </div>
                        <p className="version-text">Version 0.1.0 • Windows, macOS, Linux</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Download;
