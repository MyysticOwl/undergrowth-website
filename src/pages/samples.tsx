import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import WorkflowGallery from '@site/src/components/WorkflowGallery';
import styles from './index.module.css';

export default function Samples(): ReactNode {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title="Workflow Concepts & Vision"
            description="Explore visionary automation patterns built on the Undergrowth foundation.">
            <header className="hero hero--primary" style={{ padding: '6rem 0', background: 'var(--site-hero-bg)' }}>
                <div className="container text--center">
                    <Heading as="h1" className="text-gradient" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
                        Workflow Concepts
                    </Heading>
                    <p className="hero__subtitle" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.5rem', opacity: 0.9 }}>
                        Visionary automation patterns for modern infrastructure.
                        Explore the potential of building custom solutions on the Undergrowth foundation.
                    </p>
                </div>
            </header>
            <main>
                <WorkflowGallery />

                <section style={{ padding: '4rem 0', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <div className="container text--center">
                        <Heading as="h2" className="margin-bottom--lg">Can't find what you need?</Heading>
                        <p style={{ maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>
                            Undergrowth's plugin architecture is designed to be extensible.
                            You can combine any of our 50+ plugins to create custom workflows tailored to your specific needs.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <a className="button button--primary button--lg" href="/docs/plugins/reference">
                                Browse All Plugins
                            </a>
                            <a className="button button--secondary button--lg" href="https://github.com/MyysticOwl/undergrowth">
                                View on GitHub
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
