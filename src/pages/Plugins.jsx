import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import pluginsData from '../data/plugins.json';
import { Search, Grid, List as ListIcon } from 'lucide-react';
import './Plugins.css';

const PluginCard = ({ plugin }) => {
    // Variations chips
    // Limit to showing first few if too many?

    return (
        <div className="plugin-card glass-panel">
            <div className="plugin-header">
                <div className="plugin-icon-container">
                    {/* Show icon of first variation or generic if empty? */}
                    <span className="plugin-icon">
                        {plugin.variations[0]?.icon || "🧩"}
                    </span>
                </div>
                <div className="plugin-info">
                    <div className="plugin-title-row">
                        <h3 className="plugin-name">{plugin.name}</h3>
                        <span className="plugin-version">v{plugin.version}</span>
                    </div>
                    <p className="plugin-desc">{plugin.description}</p>
                </div>
            </div>

            <div className="plugin-stats">
                {/* e.g. "3 variations" */}
                <span className="var-count">{plugin.variations.length} variations</span>
            </div>

            <div className="plugin-variations">
                <h4 className="label-tiny">VARIATIONS</h4>
                <div className="tags-container">
                    {plugin.variations.map(v => (
                        <span key={v.id} className="tag-chip" title={v.description}>
                            {v.icon} {v.id}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Plugins = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Sort plugins alphabetically
    const sortedPlugins = [...pluginsData].sort((a, b) => a.name.localeCompare(b.name));

    const filteredPlugins = sortedPlugins.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.variations.some(v => v.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="page-wrapper">
            <Navbar />

            <main className="plugins-page container">
                <div className="page-header">
                    <h1 className="gradient-text">Plugin Library</h1>
                    <p className="subtitle">Extensive collection of automation capabilities.</p>
                </div>

                <div className="toolbar glass-panel">
                    <div className="search-box">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search plugins..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="stats-badge">
                        {filteredPlugins.length} available
                    </div>
                </div>

                <div className="plugins-grid">
                    {filteredPlugins.map(plugin => (
                        <PluginCard key={plugin.name} plugin={plugin} />
                    ))}
                </div>

                {filteredPlugins.length === 0 && (
                    <div className="empty-state">
                        <p>No plugins found matching "{searchTerm}"</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Plugins;
