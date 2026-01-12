import React from 'react';
import { Download as DownloadIcon, Github, Copy } from 'lucide-react';
import './Download.css';

const Download = () => {
    return (
        <section className="download-section">
            <div className="container">
                <div className="glass-panel download-card">
                    <div className="download-content">
                        <h2 className="section-title">Ready to Automate?</h2>
                        <p className="section-subtitle">
                            Get started with Undergrowth today. Free for personal and non-commercial use.
                        </p>

                        <div className="install-options">
                            <div className="install-method">
                                <span className="install-label">
                                    <span role="img" aria-label="linux">🐧</span> Linux / macOS
                                </span>
                                <div className="terminal-block">
                                    <code>curl -fsSL https://undergrowth.ai/install.sh | bash</code>
                                    <button
                                        className="copy-btn"
                                        onClick={() => navigator.clipboard.writeText('curl -fsSL https://undergrowth.ai/install.sh | bash')}
                                        title="Copy to clipboard"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="install-method">
                                <span className="install-label">
                                    <span role="img" aria-label="windows">🪟</span> Windows (PowerShell)
                                </span>
                                <div className="terminal-block">
                                    <code>iwr -useb https://undergrowth.ai/install.ps1 | iex</code>
                                    <button
                                        className="copy-btn"
                                        onClick={() => navigator.clipboard.writeText('iwr -useb https://undergrowth.ai/install.ps1 | iex')}
                                        title="Copy to clipboard"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="download-actions">
                            <a href="https://github.com/MyysticOwl/undergrowth/releases" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                                <Github size={20} />
                                View on GitHub
                            </a>
                        </div>
                        <p className="version-text">Version 0.1.0 • Stable</p>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default Download;
