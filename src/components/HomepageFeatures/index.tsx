import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
  benefit: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Visual Workflow Builder',
    icon: '🎨',
    benefit: 'Build complex automations without writing code',
    description: (
      <>
        Drag-and-drop components onto a canvas, connect them visually, and deploy
        immediately. Perfect for IT teams who need to ship fast without endless scripting.
      </>
    ),
  },
  {
    title: '50+ Ready-to-Use Plugins',
    icon: '🧩',
    benefit: 'Stop reinventing the wheel',
    description: (
      <>
        HTTP, SQLite, Redis, MQTT, Email, AI/LLM, and more—all built-in. Most automations
        work out of the box. Need something custom? Write your own plugin in Rust.
      </>
    ),
  },
  {
    title: 'Deploy Anywhere',
    icon: '🚀',
    benefit: 'One binary, zero dependencies',
    description: (
      <>
        Run on a Raspberry Pi (5MB) or an enterprise server cluster. No Docker required.
        No cloud dependency. Works in air-gapped environments.
      </>
    ),
  },
  {
    title: 'Offline-First Licensing',
    icon: '🔐',
    benefit: 'No phone-home, no DRM servers',
    description: (
      <>
        Machine-locked license files that work completely offline. We never brick your
        production systems—expired licenses gracefully downgrade to Community mode.
      </>
    ),
  },
  {
    title: 'Sprout CLI',
    icon: '⌨️',
    benefit: 'Automate your automation',
    description: (
      <>
        Headless execution for CI/CD pipelines. Run workflows from cron, deploy via
        scripts, validate configs before production. Full control from the command line.
      </>
    ),
  },
  {
    title: 'Enterprise Security',
    icon: '🛡️',
    benefit: 'Built for compliance',
    description: (
      <>
        Role-based access control, SSO/OIDC integration, comprehensive audit logging,
        and encrypted database storage. Ready for regulated industries.
      </>
    ),
  },
];

function Feature({ title, icon, description, benefit }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
        <Heading as="h3">{title}</Heading>
        <div className={styles.featureBenefit}>{benefit}</div>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2">Everything You Need to Automate</Heading>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            Undergrowth gives you the building blocks to automate anything—from simple
            scheduled tasks to complex multi-system integrations.
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
