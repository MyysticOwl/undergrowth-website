import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type UseCaseItem = {
    title: string;
    description: ReactNode;
    icon: string;
    benefit: string;
};

const UseCaseList: UseCaseItem[] = [
    {
        title: 'For Developers',
        icon: '💻',
        benefit: 'Plugin SDK in Rust • WebAssembly sandbox • Full REST API',
        description: (
            <>
                Build on a foundation of Rust and WebAssembly. Extend with your own plugins
                using a stable, public API. No proprietary lock-in—you own your automation.
            </>
        ),
    },
    {
        title: 'For IT Professionals',
        icon: '🖥️',
        benefit: 'System resource monitoring • Scheduled tasks • File operations',
        description: (
            <>
                Automate the boring stuff: file syncing, system monitoring, log processing,
                scheduled maintenance. Set it up once and forget about it.
            </>
        ),
    },
    {
        title: 'For DevOps Teams',
        icon: '🔧',
        benefit: 'CI/CD integration • Remote deployment • Headless execution',
        description: (
            <>
                Integrate with your CI/CD pipelines. Deploy workflows headlessly, trigger
                builds, monitor infrastructure—all from one engine.
            </>
        ),
    },
    {
        title: 'For Managers & Decision Makers',
        icon: '📊',
        benefit: 'Audit logging • Team collaboration • Cost consolidation',
        description: (
            <>
                ROI in weeks, not months. Reduce manual work by 80%. Audit trails for
                compliance. One tool instead of a dozen point solutions.
            </>
        ),
    },
    {
        title: 'For AI Engineers',
        icon: '🤖',
        benefit: 'Local Inference • Privacy-first • RAG Pipelines',
        description: (
            <>
                Orchestrate <strong>Local LLMs</strong> (Ollama, LlamaCpp) without data leaving your infrastructure. Build private RAG pipelines.
            </>
        ),
    },
    {
        title: 'For Marketers',
        icon: '📈',
        benefit: 'SEO Automation • Social workflows • Lead enrichment',
        description: (
            <>
                Automate SEO audits, social scheduling, and lead enrichment. Build your own tools without waiting for engineering.
            </>
        ),
    },
];

function UseCase({ title, description, icon, benefit }: UseCaseItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className={styles.useCaseCard}>
                <div className={styles.useCaseIcon}>{icon}</div>
                <Heading as="h3">{title}</Heading>
                <div className={styles.useCaseBenefit}>{benefit}</div>
                <p className={styles.useCaseDescription}>{description}</p>
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
