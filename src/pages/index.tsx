import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageUseCases from '@site/src/components/HomepageUseCases';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.hero__title}>
          Stop Writing Glue Code.
          <br />
          Start Automating.
        </Heading>
        <p className={styles.hero__subtitle}>
          <strong>Undergrowth</strong> is a lightweight automation engine that runs everywhere—from
          Raspberry Pi to enterprise servers. Build powerful workflows visually, extend with 50+
          plugins, and deploy in under 5 minutes. Free tier available.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/download">
            Download Free
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/pricing"
            style={{ marginLeft: '1rem', color: '#fff', borderColor: '#fff' }}>
            View Pricing
          </Link>
        </div>
        <p className={styles.heroNote}>
          Free forever for personal use. Pro starts at $99/year.
        </p>
      </div>
    </header>
  );
}

function StatsSection() {
  return (
    <section className={styles.statsSection}>
      <div className="container">
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>50+</span>
            <span className={styles.statLabel}>Plugin Variations</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>5MB</span>
            <span className={styles.statLabel}>Minimal Deployment</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statLabel}>Cloud Dependencies</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statLabel}>Offline Capable</span>
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
        </p>
        <div className={styles.pricingPreviewGrid}>
          <div className={styles.pricingPreviewCard}>
            <h3>Community</h3>
            <div className={styles.previewPrice}>Free</div>
            <p>3 workflows, 7-day history</p>
          </div>
          <div className={styles.pricingPreviewCard}>
            <h3>Starter</h3>
            <div className={styles.previewPrice}>$49<span>/year</span></div>
            <p>10 workflows, 30-day history</p>
          </div>
          <div className={clsx(styles.pricingPreviewCard, styles.highlighted)}>
            <h3>Pro</h3>
            <div className={styles.previewPrice}>$99<span>/year</span></div>
            <p>Unlimited everything</p>
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

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Automate Everything, Deploy Anywhere"
      description="Undergrowth is a lightweight automation engine for building robust, scalable workflows. 50+ plugins, visual builder, runs anywhere from IoT to enterprise.">
      <HomepageHeader />
      <main>
        <StatsSection />
        <HomepageFeatures />
        <HomepageUseCases />
        <PricingPreview />
        <FinalCTA />
      </main>
    </Layout>
  );
}
