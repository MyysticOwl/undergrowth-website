import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import pluginsData from '../data/plugins.json';
import { Search, Brain, Cpu, Database, Wrench, Settings, Activity, Box } from 'lucide-react';
import './Plugins.css';

// Helper to guess category if not present
const getCategory = (plugin) => {
    const text = (plugin.name + plugin.description).toLowerCase();
    if (plugin.category) return plugin.category; // If data already has it
    if (text.includes('ai') || text.includes('llm') || text.includes('chat') || text.includes('rag')) return 'AI';
    if (text.includes('camera') || text.includes('video') || text.includes('mqtt') || text.includes('serial') || text.includes('gpio')) return 'IoT';
    if (text.includes('database') || text.includes('sql') || text.includes('store') || text.includes('csv')) return 'Data';
    if (text.includes('http') || text.includes('request') || text.includes('api')) return 'Network';
    if (text.includes('time') || text.includes('cron') || text.includes('loop')) return 'Utility';
    return 'System';
};

const CATEGORIES = [
    { id: 'All', label: 'All Plugins', icon: <Box size={16} /> },
    { id: 'AI', label: 'AI & Intelligence', icon: <Brain size={16} /> },
    { id: 'IoT', label: 'IoT & Hardware', icon: <Cpu size={16} /> },
    { id: 'Data', label: 'Data & Storage', icon: <Database size={16} /> },
    { id: 'Utility', label: 'Utilities', icon: <Wrench size={16} /> },
    { id: 'System', label: 'System', icon: <Settings size={16} /> },
];

const PluginCard = ({ plugin }) => {
    const category = getCategory(plugin);
    const displayedVariations = plugin.variations.slice(0, 3);
    const remainingCount = plugin.variations.length - 3;

    return (
        <div className="plugin-card glass-panel">
            <div className="plugin-header">
                <div className="plugin-icon-container">
                    <span className="plugin-icon">
                        {plugin.variations[0]?.icon || "🧩"}
                    </span>
                </div>
                <div className="plugin-info">
                    <div className="plugin-top-row">
                        <span className={`category-badge cat-${category.toLowerCase()}`}>{category}</span>
                        <span className="plugin-version">v{plugin.version}</span>
                    </div>
                    <h3 className="plugin-name">{plugin.name}</h3>
                    <p className="plugin-desc">{plugin.description}</p>
                </div>
            </div>

            <div className="plugin-variations">
                <div className="tags-container">
                    {displayedVariations.map(v => (
                        <span key={v.id} className="tag-chip" title={v.description}>
                            {v.icon} {v.id}
                        </span>
                    ))}
                    {remainingCount > 0 && (
                        <span className="tag-chip more-chip">+{remainingCount} more</span>
                    )}
                </div>
            </div>
        </div>
    );
};

const Plugins = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Enrich and sort
    const processedPlugins = useMemo(() => {
        return pluginsData.map(p => ({ ...p, category: getCategory(p) }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    const filteredPlugins = processedPlugins.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.variations.some(v => v.id.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="page-wrapper">
            <Navbar />

            <main className="plugins-page container">
                <div className="page-header">
                    <h1 className="gradient-text">Plugin Library</h1>
                    <p className="subtitle">Extensive collection of automation capabilities.</p>
                </div>

                <div className="toolbar-container">
                    <div className="category-tabs">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.icon}
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="search-bar glass-panel">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search plugins..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="count-badge">{filteredPlugins.length}</span>
                    </div>
                </div>

                <div className="plugins-grid">
                    {filteredPlugins.map(plugin => (
                        <PluginCard key={plugin.name} plugin={plugin} />
                    ))}
                </div>

                {filteredPlugins.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No plugins found</h3>
                        <p>Try adjusting your search or category filter.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Plugins;
