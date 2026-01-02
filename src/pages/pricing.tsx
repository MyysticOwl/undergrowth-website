import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './pricing.module.css';

type PricingTier = {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    ctaLink: string;
    highlighted?: boolean;
    badge?: string;
};

const tiers: PricingTier[] = [
    {
        name: 'Community',
        price: 'Free',
        period: 'forever',
        description: 'Perfect for evaluation and small personal projects.',
        features: [
            '3 active workflows',
            '7-day execution history',
            '100 AI calls/day',
            'All 50+ plugins',
            'Web UI & Sprout CLI',
            '"Powered by" badge',
        ],
        cta: 'Download Free',
        ctaLink: '/download',
    },
    {
        name: 'Starter',
        price: '$49',
        period: '/year',
        description: 'For solo developers and homelab enthusiasts.',
        features: [
            '10 active workflows',
            '30-day execution history',
            '500 AI calls/day',
            'Badge removed',
            'Clean blueprint exports',
            'Email support',
            '1 machine license',
        ],
        cta: 'Buy Starter',
        ctaLink: 'https://undergrowth.lemonsqueezy.com/buy/starter',
    },
    {
        name: 'Pro',
        price: '$99',
        period: '/year',
        description: 'Unlimited power for serious automation.',
        features: [
            'Unlimited workflows',
            'Unlimited history',
            'Unlimited AI calls',
            'Badge removed',
            'Clean blueprint exports',
            'Priority email support',
            '1 machine license',
            'Volume discounts available',
        ],
        cta: 'Buy Pro',
        ctaLink: 'https://undergrowth.lemonsqueezy.com/buy/pro',
        highlighted: true,
        badge: 'Most Popular',
    },
    {
        name: 'Team',
        price: '$249',
        period: '/year',
        description: 'Collaboration and compliance for small teams.',
        features: [
            'Everything in Pro',
            '5 team seats included',
            'Multi-user authentication',
            'Role-based access control',
            'Audit log export',
            'Team blueprint sharing',
            'Priority email support',
        ],
        cta: 'Buy Team',
        ctaLink: 'https://undergrowth.lemonsqueezy.com/buy/team',
    },
    {
        name: 'Enterprise',
        price: '$999+',
        period: '/year',
        description: 'For organizations requiring compliance and custom solutions.',
        features: [
            'Everything in Team',
            'SSO/OIDC integration',
            'Volume licensing',
            '99.9% SLA',
            '24/7 support',
            'Custom plugin development',
            'Dedicated success manager',
        ],
        cta: 'Contact Sales',
        ctaLink: 'mailto:enterprise@undergrowth.io',
    },
];

type VolumeDiscount = {
    machines: string;
    discount: string;
    price: string;
};

const volumeDiscounts: VolumeDiscount[] = [
    { machines: '3+', discount: '15%', price: '~$84/machine' },
    { machines: '5+', discount: '25%', price: '~$74/machine' },
    { machines: '10+', discount: '40%', price: '~$59/machine' },
];

function PricingCard({ tier }: { tier: PricingTier }) {
    return (
        <div className={clsx(styles.pricingCard, tier.highlighted && styles.highlighted)}>
            {tier.badge && <div className={styles.badge}>{tier.badge}</div>}
            <Heading as="h3" className={styles.tierName}>{tier.name}</Heading>
            <div className={styles.priceRow}>
                <span className={styles.price}>{tier.price}</span>
                <span className={styles.period}>{tier.period}</span>
            </div>
            <p className={styles.description}>{tier.description}</p>
            <ul className={styles.featureList}>
                {tier.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                ))}
            </ul>
            <Link to={tier.ctaLink} className={clsx('button', tier.highlighted ? 'button--primary' : 'button--secondary', 'button--lg', styles.ctaButton)}>
                {tier.cta}
            </Link>
        </div>
    );
}

function ComparisonTable() {
    return (
        <div className={styles.comparisonSection}>
            <Heading as="h2">Feature Comparison</Heading>
            <div className={styles.tableWrapper}>
                <table className={styles.comparisonTable}>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Community</th>
                            <th>Starter</th>
                            <th>Pro</th>
                            <th>Team</th>
                            <th>Enterprise</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Active Workflows</td>
                            <td>3</td>
                            <td>10</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>Execution History</td>
                            <td>7 days</td>
                            <td>30 days</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>AI Calls/Day</td>
                            <td>100</td>
                            <td>500</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>Machines/Seats</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>5 seats</td>
                            <td>Volume</td>
                        </tr>
                        <tr>
                            <td>"Powered by" Badge</td>
                            <td>Visible</td>
                            <td>Removed</td>
                            <td>Removed</td>
                            <td>Removed</td>
                            <td>Custom</td>
                        </tr>
                        <tr>
                            <td>Blueprint Export</td>
                            <td>Watermarked</td>
                            <td>Clean</td>
                            <td>Clean</td>
                            <td>Clean</td>
                            <td>Clean</td>
                        </tr>
                        <tr>
                            <td>Multi-User Auth</td>
                            <td>—</td>
                            <td>—</td>
                            <td>—</td>
                            <td>✓</td>
                            <td>✓</td>
                        </tr>
                        <tr>
                            <td>RBAC</td>
                            <td>—</td>
                            <td>—</td>
                            <td>—</td>
                            <td>✓</td>
                            <td>✓</td>
                        </tr>
                        <tr>
                            <td>Audit Logs</td>
                            <td>—</td>
                            <td>—</td>
                            <td>—</td>
                            <td>✓</td>
                            <td>✓</td>
                        </tr>
                        <tr>
                            <td>SSO/OIDC</td>
                            <td>—</td>
                            <td>—</td>
                            <td>—</td>
                            <td>—</td>
                            <td>✓</td>
                        </tr>
                        <tr>
                            <td>SLA</td>
                            <td>—</td>
                            <td>—</td>
                            <td>—</td>
                            <td>—</td>
                            <td>99.9%</td>
                        </tr>
                        <tr>
                            <td>Support</td>
                            <td>Community</td>
                            <td>Email</td>
                            <td>Priority</td>
                            <td>Priority</td>
                            <td>24/7</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function VolumeDiscounts() {
    return (
        <div className={styles.volumeSection}>
            <Heading as="h2">Volume Discounts</Heading>
            <p className={styles.volumeSubtitle}>Save more when you license multiple machines with Pro</p>
            <div className={styles.volumeGrid}>
                {volumeDiscounts.map((tier, idx) => (
                    <div key={idx} className={styles.volumeCard}>
                        <div className={styles.volumeMachines}>{tier.machines}</div>
                        <div className={styles.volumeDiscount}>{tier.discount} off</div>
                        <div className={styles.volumePrice}>{tier.price}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FAQ() {
    const faqs = [
        {
            q: 'Is there a free trial?',
            a: 'Yes! Community mode is free forever with up to 3 workflows. It\'s fully functional—no credit card required.',
        },
        {
            q: 'What happens when my license expires?',
            a: 'Your workflows keep running. You simply revert to Community mode limits (3 workflows, 7-day history). We never brick your production systems.',
        },
        {
            q: 'Can I transfer my license to a new machine?',
            a: 'Yes. Self-serve re-activation via the customer portal is included once per year. Additional transfers available on request.',
        },
        {
            q: 'Do you require an internet connection?',
            a: 'No. Undergrowth is 100% offline-capable. Once you have your license file, no internet is needed. Perfect for air-gapped environments.',
        },
        {
            q: 'What payment methods do you accept?',
            a: 'We use LemonSqueezy for payments—credit cards, PayPal, and more. Invoicing available for Enterprise.',
        },
        {
            q: 'Do you charge per task or execution?',
            a: 'Never. All paid tiers include unlimited executions. You pay a flat annual fee—predictable costs, no surprises.',
        },
    ];

    return (
        <div className={styles.faqSection}>
            <Heading as="h2">Frequently Asked Questions</Heading>
            <div className={styles.faqGrid}>
                {faqs.map((faq, idx) => (
                    <div key={idx} className={styles.faqItem}>
                        <Heading as="h4">{faq.q}</Heading>
                        <p>{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Pricing(): ReactNode {
    return (
        <Layout title="Pricing" description="Simple, predictable pricing for Undergrowth automation engine. Never charges per task.">
            <header className={styles.header}>
                <div className="container">
                    <Heading as="h1">Simple, Predictable Pricing</Heading>
                    <p className={styles.subtitle}>
                        No per-task fees. No execution limits. Pay once, automate everything.
                    </p>
                </div>
            </header>
            <main>
                <section className="container margin-vert--lg">
                    <div className={styles.pricingGrid}>
                        {tiers.map((tier, idx) => (
                            <PricingCard key={idx} tier={tier} />
                        ))}
                    </div>
                </section>

                <section className="container margin-vert--xl">
                    <VolumeDiscounts />
                </section>

                <section className={styles.comparisonWrapper}>
                    <div className="container">
                        <ComparisonTable />
                    </div>
                </section>

                <section className="container margin-vert--xl">
                    <FAQ />
                </section>

                <section className={styles.ctaSection}>
                    <div className="container text--center">
                        <Heading as="h2">Ready to automate?</Heading>
                        <p>Start free with Community, or go Pro for unlimited power.</p>
                        <div className={styles.ctaButtons}>
                            <Link to="/download" className="button button--primary button--lg">
                                Download Free
                            </Link>
                            <Link to="https://undergrowth.lemonsqueezy.com/buy/pro" className="button button--secondary button--lg">
                                Buy Pro — $99/year
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
