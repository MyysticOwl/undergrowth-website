import React from 'react';
import { Palette, Puzzle, Rocket, Lock, Terminal, Shield } from 'lucide-react';
import './Features.css';

const features = [
    {
        icon: <Palette size={32} />,
        title: 'Visual Workflow Builder',
        description: 'Build complex automations without writing code. Drag-and-drop components onto a canvas, connect them visually, and deploy immediately.'
    },
    {
        icon: <Puzzle size={32} />,
        title: '50+ Ready-to-Use Plugins',
        description: 'Stop reinventing the wheel. HTTP, SQLite, Redis, MQTT, Email, AI/LLM, and more—all built-in. Need something custom? Write your own in Rust.'
    },
    {
        icon: <Rocket size={32} />,
        title: 'Deploy Anywhere',
        description: 'One binary, zero dependencies. Run on a Raspberry Pi (5MB) or an enterprise server cluster. No Docker required. Works in air-gapped environments.'
    },
    {
        icon: <Lock size={32} />,
        title: 'Offline-First Licensing',
        description: 'No phone-home, no DRM servers. Machine-locked license files that work completely offline. Expired licenses gracefully downgrade to Community mode.'
    },
    {
        icon: <Terminal size={32} />,
        title: 'Sprout CLI',
        description: 'Automate your automation. Headless execution for CI/CD pipelines. Run workflows from cron, deploy via scripts, validate configs before production.'
    },
    {
        icon: <Shield size={32} />,
        title: 'Enterprise Security',
        description: 'Built for compliance. Future-proof security with RBAC, SSO, and OIDC (Coming Soon). Designed for planned audit logging and encrypted asset protection.'
    }
];

const Features = () => {
    return (
        <section id="features" className="features-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Everything You Need to Automate</h2>
                    <p className="section-subtitle">
                        Undergrowth gives you the building blocks to automate anything—from simple scheduled tasks to complex multi-system integrations.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card glass-panel">
                            <div className="feature-icon">
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
