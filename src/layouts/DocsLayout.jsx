import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './DocsLayout.css';

const docsLinks = [
    { path: 'getting-started', title: 'Getting Started', file: 'GETTING_STARTED.md' },
    { path: 'configuration', title: 'Configuration', file: 'CONFIGURATION.md' },
    { path: 'cli-reference', title: 'CLI Reference', file: 'CLI_REFERENCE.md' },
    { path: 'foundation-api', title: 'Foundation API', file: 'FOUNDATION_API_REFERENCE.md' },
    { path: 'plugin-dev-guide', title: 'Plugin Developer Guide', file: 'PLUGIN_DEVELOPER_GUIDE.md' },
    { path: 'plugin-reference', title: 'Plugin Reference', file: 'PLUGIN_REFERENCE.md' },
    { path: 'plugin-style-guide', title: 'Plugin Style Guide', file: 'PLUGIN_STYLE_GUIDE.md' },
    { path: 'rest-api', title: 'REST API', file: 'REST_API_REFERENCE.md' },

];

const DocsLayout = () => {
    return (
        <div className="docs-layout">
            <Navbar />
            <div className="docs-container container">
                <aside className="docs-sidebar glass-panel">
                    <nav className="docs-nav">
                        <h3 className="docs-nav-title">Documentation</h3>
                        <ul>
                            {docsLinks.map((link) => (
                                <li key={link.path}>
                                    <NavLink
                                        to={`/docs/${link.path}`}
                                        className={({ isActive }) => isActive ? 'active' : ''}
                                    >
                                        {link.title}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                <main className="docs-content glass-panel">
                    <Outlet context={{ docsLinks }} />
                </main>
            </div>
        </div>
    );
};

export default DocsLayout;
export { docsLinks };
