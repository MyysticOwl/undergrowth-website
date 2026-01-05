import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function BentoGrid() {
    return (
        <section className={styles.bentoSection}>
            <div className="container">
                <Heading as="h2" className="text--center margin-bottom--lg">
                    The Platform for Modern Automation
                </Heading>

                <div className={styles.bentoGrid}>
                    <div className={clsx(styles.bentoCard, styles.mainFeature)}>
                        <div className={styles.bentoContent}>
                            <h3>Evolution of Logic</h3>
                            <p>Stop writing fragile bash scripts glued together with cron. Build resilient, visual workflows that scale.</p>

                            <div className={styles.comparison}>
                                <div className={styles.oldWay}>
                                    <div className={styles.techLabel}>The Old Way</div>
                                    <div className={styles.codeBlock}>
                                        <div className="code-line"><span>0 3 * * * /opt/scripts/backup.sh</span></div>
                                        <div className="code-line"><span>&gt; /tmp/log 2&gt;&1</span></div>
                                        <div className="code-line comment"># Did it run? Who knows.</div>
                                    </div>
                                </div>
                                <div className={styles.arrow} style={{ fontSize: '2rem' }}>➔</div>
                                <div className={styles.newWay}>
                                    <div className={styles.techLabel}>The Undergrowth Way</div>
                                    <div className={styles.visualFlow}>
                                        <div className={styles.node}>⏱️ Cron Trigger</div>
                                        <div className={styles.connector}>↓</div>
                                        <div className={styles.node}>📦 Backup DB</div>
                                        <div className={styles.connector}>↓</div>
                                        <div className={styles.node}>✅ Notify Slack</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stat 1: Latency */}
                    <div className={clsx(styles.bentoCard, styles.statCard)}>
                        <div className={styles.statNumber}>0.1ms</div>
                        <div className={styles.statLabel}>Latency</div>
                    </div>

                    {/* Stat 2: Footprint */}
                    <div className={clsx(styles.bentoCard, styles.statCard)}>
                        <div className={styles.statNumber}>&lt;10MB</div>
                        <div className={styles.statLabel}>Binary Size</div>
                    </div>

                    {/* Feature: Plugins */}
                    <div className={clsx(styles.bentoCard, styles.featureCard)}>
                        <h3>50+ Variations</h3>
                        <p>AI Agents, MQTT, HTTP, SQLite, Redis, Discord...</p>
                    </div>

                    {/* Feature: No Fees */}
                    <div className={clsx(styles.bentoCard, styles.featureCard, styles.highlight)}>
                        <h3>$0 Usage Fees</h3>
                        <p>Run locally or on your own metal. We don't charge per run.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
