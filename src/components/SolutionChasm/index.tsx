import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function SolutionChasm(): ReactNode {
    return (
        <section className={styles.chasmSection}>
            <div className="container">
                <Heading as="h2" className="text--center margin-bottom--lg">
                    Evolution of Automation
                </Heading>
                <div className={styles.chasmGrid}>
                    <div className={clsx(styles.chasmCard, styles.oldWay)}>
                        <div className={styles.cardHeader}>
                            <h3>The Old Way</h3>
                            <span className={styles.emoji}>🕸️</span>
                        </div>
                        <div className={styles.codeBlock}>
                            <code>
                                <span style={{ color: '#d6deeb' }}>#!/bin/bash</span><br />
                                <span style={{ color: '#addb67' }}># DEPRECATED: Do not touch</span><br />
                                <span style={{ color: '#82aaff' }}>if</span> [ -f /tmp/lock ]; <span style={{ color: '#82aaff' }}>then</span><br />
                                &nbsp;&nbsp;<span style={{ color: '#ef596f' }}>exit 1</span> <span style={{ color: '#5f7e97' }}># Hope this works</span><br />
                                <span style={{ color: '#82aaff' }}>fi</span><br />
                                <span style={{ color: '#c792ea' }}>python3</span> <span style={{ color: '#ecc48d' }}>script_v2_final.py</span>
                            </code>
                        </div>
                        <ul className={styles.painPoints}>
                            <li>❌ Fragile scripts</li>
                            <li>❌ 💸 API Bills</li>
                            <li>❌ "Who wrote this?"</li>
                            <li>❌ Hard to scale</li>
                        </ul>
                    </div>

                    <div className={clsx(styles.chasmCard, styles.newWay)}>
                        <div className={styles.cardHeader}>
                            <h3>The Undergrowth Way</h3>
                            <span className={styles.emoji}>🌱</span>
                        </div>
                        <div className={styles.visualFlow}>
                            <div className={styles.node}>Timer</div>
                            <div className={styles.arrow}>→</div>
                            <div className={styles.node}>Fetch API</div>
                            <div className={styles.arrow}>→</div>
                            <div className={styles.node}>AI Analyze</div>
                            <div className={styles.arrow}>→</div>
                            <div className={styles.node}>Slack Alert</div>
                        </div>
                        <ul className={styles.benefits}>
                            <li>✅ Visual Logic</li>
                            <li>✅ Self-Documenting</li>
                            <li>✅ No Usage Fees</li>
                            <li>✅ Instant Scale</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
