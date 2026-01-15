import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './McpShowcase.css';

const McpShowcase = () => {
    return (
        <section className="mcp-showcase-section">
            <div className="container">
                <div className="mcp-header">
                    <h2 className="mcp-title">Universal Connectivity with MCP</h2>
                    <p className="mcp-subtitle">
                        Undergrowth is a native host for the Model Context Protocol.
                        Connect any standard MCP server and instantly use its tools in your workflows.
                    </p>
                </div>

                {/* Step 1: Connect */}
                <div className="mcp-grid">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mcp-content"
                    >
                        <span className="mcp-step-badge">Step 1: Connect</span>
                        <h3 className="mcp-feature-title">Add Any MCP Server</h3>
                        <p className="mcp-feature-desc">
                            Use the Connection Wizard to link local CLI tools or remote SSE servers.
                            Undergrowth manages the lifecycle, handles the handshake, and validates the protocol capabilities.
                        </p>
                        <ul className="mcp-list">
                            <li className="mcp-list-item">
                                <Check size={20} className="check-icon" />
                                <span>Connect via Stdio (CLI) or HTTP/SSE (Remote)</span>
                            </li>
                            <li className="mcp-list-item">
                                <Check size={20} className="check-icon" />
                                <span>Manage environment variables and arguments</span>
                            </li>
                            <li className="mcp-list-item">
                                <Check size={20} className="check-icon" />
                                <span>Automatic capability discovery</span>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mcp-visual"
                    >
                        <div className="mcp-glow"></div>
                        <div className="mcp-image-card">
                            <img src="/mcp_connection.png" alt="MCP Connection Wizard" className="mcp-image" />
                        </div>
                    </motion.div>
                </div>

                <div style={{ height: '6rem' }}></div>

                {/* Step 2: Use */}
                <div className="mcp-grid reversed">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mcp-content"
                    >
                        <span className="mcp-step-badge">Step 2: Automate</span>
                        <h3 className="mcp-feature-title">First-Class Citizens</h3>
                        <p className="mcp-feature-desc">
                            Tools discovered from MCP servers aren't just API calls—they become native component blocks.
                            Drag them onto your canvas, wire them up to AI agents, and orchestrate complex flows.
                        </p>
                        <ul className="mcp-list">
                            <li className="mcp-list-item">
                                <Check size={20} className="check-icon" />
                                <span>Dynamic tool registration in the Sidebar</span>
                            </li>
                            <li className="mcp-list-item">
                                <Check size={20} className="check-icon" />
                                <span>Full type-safety and visual schema validation</span>
                            </li>
                            <li className="mcp-list-item">
                                <Check size={20} className="check-icon" />
                                <span>Mix and match tools from different servers</span>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mcp-visual"
                    >
                        <div className="mcp-glow"></div>
                        <div className="mcp-image-card">
                            <img src="/mcp_usage.png" alt="MCP Tool Usage in Workflow" className="mcp-image" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default McpShowcase;
