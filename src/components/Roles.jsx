import React from 'react';
import { Code, Server, GitBranch, BarChart, Bot, TrendingUp } from 'lucide-react';
import './Roles.css';

const roles = [
    {
        id: 'developers',
        title: 'For Developers',
        icon: <Code size={24} />,
        description: 'Plugin SDK in Rust • WebAssembly sandbox • Full REST API',
        details: 'Build on a foundation of Rust and WebAssembly. Extend with your own plugins using a stable, public API. No proprietary lock-in—you own your automation.'
    },
    {
        id: 'it-pros',
        title: 'For IT Professionals',
        icon: <Server size={24} />,
        description: 'System resource monitoring • Scheduled tasks • File operations',
        details: 'Automate the boring stuff: file syncing, system monitoring, log processing, scheduled maintenance. Set it up once and forget about it.'
    },
    {
        id: 'devops',
        title: 'For DevOps Teams',
        icon: <GitBranch size={24} />,
        description: 'CI/CD integration • Remote deployment • Headless execution',
        details: 'Integrate with your CI/CD pipelines. Deploy workflows headlessly, trigger builds, monitor infrastructure—all from one engine.'
    },
    {
        id: 'managers',
        title: 'For Managers',
        icon: <BarChart size={24} />,
        description: 'Audit logging • Team collaboration • Cost consolidation',
        details: 'ROI in weeks, not months. Reduce manual work by 80%. Audit trails for compliance. One tool instead of a dozen point solutions.'
    },
    {
        id: 'ai-engineers',
        title: 'For AI Engineers',
        icon: <Bot size={24} />,
        description: 'Local Inference • Privacy-first • RAG Pipelines',
        details: 'Orchestrate Local LLMs (Ollama, LlamaCpp) without data leaving your infrastructure. Build private RAG pipelines.'
    },
    {
        id: 'marketers',
        title: 'For Marketers',
        icon: <TrendingUp size={24} />,
        description: 'SEO Automation • Social workflows • Lead enrichment',
        details: 'Automate SEO audits, social scheduling, and lead enrichment. Build your own tools without waiting for engineering.'
    }
];

const Roles = () => {
    return (
        <section id="roles" className="roles-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Built for Your Role</h2>
                    <p className="section-subtitle">
                        Whether you're writing code, managing systems, or making decisions, Undergrowth fits your workflow.
                    </p>
                </div>

                <div className="roles-grid">
                    {roles.map((role) => (
                        <div key={role.id} className="role-card glass-panel">
                            <div className="role-header">
                                <div className="role-icon">{role.icon}</div>
                                <h3 className="role-title">{role.title}</h3>
                            </div>
                            <p className="role-tags">{role.description}</p>
                            <p className="role-details">{role.details}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Roles;
