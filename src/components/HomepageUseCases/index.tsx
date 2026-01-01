import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type UseCaseItem = {
    title: string;
    description: ReactNode;
    icon: string;
    benefits: string[];
};

const UseCaseList: UseCaseItem[] = [
    {
        title: 'For Developers',
        icon: '💻',
        description: (
            <>
                Build on a foundation of Rust and WebAssembly. Extend with your own plugins
                using a stable, public API. No proprietary lock-in—you own your automation.
            </>
        ),
        benefits: ['Plugin SDK in Rust', 'WebAssembly sandbox', 'Full REST API'],
    },
    {
        title: 'For IT Professionals',
        icon: '🖥️',
        description: (
            <>
                Automate the boring stuff: file syncing, system monitoring, log processing,
                scheduled maintenance. Set it up once and forget about it.
            </>
        ),
        benefits: ['System resource monitoring', 'Scheduled tasks', 'File operations'],
    },
    {
        title: 'For DevOps Teams',
        icon: '🔧',
        description: (
            <>
                Integrate with your CI/CD pipelines. Deploy workflows headlessly, trigger
                builds, monitor infrastructure—all from one engine.
            </>
        ),
        benefits: ['CI/CD integration', 'Remote deployment', 'Headless execution'],
    },
    {
        title: 'For Managers & Decision Makers',
        icon: '📊',
        description: (
            <>
                ROI in weeks, not months. Reduce manual work by 80%. Audit trails for
                compliance. One tool instead of a dozen point solutions.
            </>
        ),
        benefits: ['Audit logging', 'Team collaboration', 'Cost consolidation'],
    },
];

function UseCase({ title, description, icon, benefits }: UseCaseItem) {
    return (
        <div className={clsx('col col--6')}>
            <div className={styles.useCaseCard}>
                <div className={styles.useCaseHeader}>
                    <div className={styles.useCaseIcon}>{icon}</div>
                    <Heading as="h3">{title}</Heading>
                </div>
                <p className={styles.useCaseDescription}>{description}</p>
                <div className={styles.benefitTags}>
                    {benefits.map((benefit, idx) => (
                        <span key={idx} className={styles.benefitTag}>{benefit}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function HomepageUseCases(): ReactNode {
    return (
        <section className={styles.useCases}>
            <div className="container">
                <div className="text--center margin-bottom--lg">
                    <Heading as="h2">Built for Your Role</Heading>
                    <p style={{ maxWidth: '600px', margin: '0 auto' }}>
                        Whether you're writing code, managing systems, or making decisions,
                        Undergrowth fits your workflow.
                    </p>
                </div>
                <div className="row">
                    {UseCaseList.map((props, idx) => (
                        <UseCase key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
