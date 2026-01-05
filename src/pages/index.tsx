import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageUseCases from '@site/src/components/HomepageUseCases';
import Heading from '@theme/Heading';

import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './index.module.css';

import SolutionChasm from '@site/src/components/SolutionChasm';



function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="row" style={{ alignItems: 'center' }}>
          <div className="col col--6" style={{ textAlign: 'left' }}>
            <Heading as="h1" className={clsx(styles.hero__title, 'text-gradient')}>
              The Universal<br />
              Nervous System
            </Heading>
            <p className={styles.hero__subtitle}>
              <strong>Automate Everything. Runs Anywhere.</strong><br />
              From Local LLMs to Enterprise Clusters.
            </p>
            <div className={styles.buttons} style={{ justifyContent: 'flex-start' }}>
              <Link
                className="button button--primary button--lg"
                to="/download">
                Deploy in 5 Seconds
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/docs/intro">
                Read the Docs
              </Link>
            </div>
            <p className={styles.heroNote} style={{ textAlign: 'left' }}>
              Open Source Foundation • 50+ Plugins • 0.1ms Latency
            </p>
          </div>
          <div className="col col--6">
            <div className={styles.heroImageContainer}>
              <div className="glow-effect">
                <img
                  src={useBaseUrl('img/undergrowth-social-card.png')}
                  className={styles.heroImage}
                  alt="The Universal Automation Engine"
                  style={{
                    transform: 'perspective(1000px) rotateY(-10deg) rotateX(5deg)',
                    boxShadow: '20px 20px 60px rgba(0,0,0,0.5)',
                    borderRadius: 'var(--ifm-global-radius)',
                    width: '100%',
                    maxWidth: '600px',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'perspective(1000px) rotateY(-10deg) rotateX(5deg)'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatsSection() {
  return (
    <section className={styles.statsSection}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.statsGrid} style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '2rem',
          marginTop: '-4rem'
        }}>
          <div className={styles.statItem}>
            <span className={clsx(styles.statNumber, 'text-gradient')}>50+</span>
            <span className={styles.statLabel}>Plugins</span>
          </div>
          <div className={styles.statItem}>
            <span className={clsx(styles.statNumber, 'text-gradient')}>&lt;10MB</span>
            <span className={styles.statLabel}>Footprint</span>
          </div>
          <div className={styles.statItem}>
            <span className={clsx(styles.statNumber, 'text-gradient')}>0.1ms</span>
            <span className={styles.statLabel}>Latency</span>
          </div>
          <div className={styles.statItem}>
            <span className={clsx(styles.statNumber, 'text-gradient')}>$0</span>
            <span className={styles.statLabel}>Usage Fees</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingPreview() {
  return (
    <section className={styles.pricingPreview}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--md">
          Simple Pricing. No Surprises.
        </Heading>
        <p className="text--center margin-bottom--lg" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
          Start free with Community. Upgrade to Pro when you need unlimited workflows.
          <strong> $0 Usage Fees on all plans.</strong>
        </p>
        <div className={styles.pricingPreviewGrid}>
          <div className={styles.pricingPreviewCard}>
            <h3>Community</h3>
            <div className={styles.previewPrice}>Free</div>
            <p>3 active workflows, 100 AI calls/day</p>
          </div>
          <div className={styles.pricingPreviewCard}>
            <h3>Starter</h3>
            <div className={styles.previewPrice}>$49<span>/year</span></div>
            <p>10 active workflows, 500 AI calls/day</p>
          </div>
          <div className={clsx(styles.pricingPreviewCard, styles.highlighted)}>
            <h3>Pro</h3>
            <div className={styles.previewPrice}>$99<span>/year</span></div>
            <p>Unlimited workflows, Unlimited AI</p>
          </div>
          <div className={styles.pricingPreviewCard}>
            <h3>Team</h3>
            <div className={styles.previewPrice}>$249<span>/year</span></div>
            <p>5 seats, RBAC, audit logs</p>
          </div>
        </div>
        <div className="text--center margin-top--lg">
          <Link to="/pricing" className="button button--secondary button--lg">
            Compare All Plans →
          </Link>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className={styles.finalCta}>
      <div className="container text--center">
        <Heading as="h2">
          Ready to automate everything?
        </Heading>
        <p>
          Join hundreds of developers, IT pros, and DevOps teams who trust Undergrowth
          to power their automation workflows.
        </p>
        <div className={styles.ctaButtons}>
          <Link
            className="button button--primary button--lg"
            to="/download">
            Download Free
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Read the Docs
          </Link>
        </div>
      </div>
    </section>
  );
}

import BentoGrid from '@site/src/components/BentoGrid';

// ... (header code)

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="The Universal Automation Engine"
      description="Undergrowth is the universal nervous system for your infrastructure. Automate everything from edge to cloud.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <BentoGrid />
        <HomepageUseCases />
        <PricingPreview />
        <FinalCTA />
      </main>
    </Layout>
  );
}
