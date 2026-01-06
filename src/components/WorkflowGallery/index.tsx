import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type WorkflowNode = {
    label: string;
    type: 'trigger' | 'action' | 'ai' | 'data';
    icon?: string;
};

type WorkflowItem = {
    title: string;
    description: string;
    nodes: WorkflowNode[];
    plugins: string[];
};

const workflows: WorkflowItem[] = [
    {
        title: 'Self-Healing Infrastructure',
        description: 'Concept: Monitor system health and trigger recovery routines via CLI or Webhooks.',
        nodes: [
            { label: 'Scheduler', type: 'trigger', icon: '⏱️' },
            { label: 'Health Check (Alert)', type: 'data', icon: '💾' },
            { label: 'Utility Script / CLI', type: 'action', icon: '🛠️' },
            { label: 'Webhook (Notification)', type: 'action', icon: '💬' },
        ],
        plugins: ['time-scheduler', 'monitoring-alert', 'utility-system', 'notify-webhook'],
    },
    {
        title: 'AI Content Pipeline',
        description: 'Concept: Process incoming text streams through local LLMs for sentiment or categorization.',
        nodes: [
            { label: 'HTTP / Webhook', type: 'trigger', icon: '🌐' },
            { label: 'Local LLM (Inference)', type: 'ai', icon: '🧠' },
            { label: 'Logic (Filter)', type: 'action', icon: '🛡️' },
            { label: 'SQLite Storage', type: 'data', icon: '📊' },
        ],
        plugins: ['comm-http', 'ai-llm', 'logic', 'storage-sqlite'],
    },
    {
        title: 'Intelligent Data Sync',
        description: 'Concept: Orchestrate data movement between local storage and external APIs with validation.',
        nodes: [
            { label: 'File Watcher', type: 'trigger', icon: '📁' },
            { label: 'JSON Transform', type: 'data', icon: '🔄' },
            { label: 'HTTP Request', type: 'action', icon: '🚀' },
            { label: 'Redis Cache Sync', type: 'data', icon: '⚡' },
        ],
        plugins: ['storage-file', 'data-transform', 'comm-http', 'storage-redis'],
    },
    {
        title: 'Edge Event Processing',
        description: 'Concept: Capture edge signals and run localized logic before surfacing to a central hub.',
        nodes: [
            { label: 'Custom Protocol (IoT)', type: 'trigger', icon: '📶' },
            { label: 'Threshold Alert', type: 'data', icon: '🎯' },
            { label: 'Local Action', type: 'action', icon: '🛠️' },
            { label: 'Central Sync (Hook)', type: 'action', icon: '🔗' },
        ],
        plugins: ['iot-protocol', 'monitoring-alert', 'utility-system', 'notify-webhook'],
    }
];

function WorkflowCard({ title, description, nodes, plugins }: WorkflowItem) {
    return (
        <div className={styles.workflowCard}>
            <div className={styles.cardHeader}>
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
            <div className={styles.diagram}>
                {nodes.map((node, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <div className={clsx(styles.node, styles[node.type])}>
                            <span>{node.icon}</span> {node.label}
                        </div>
                        {index < nodes.length - 1 && <div className={styles.arrow}>↓</div>}
                    </div>
                ))}
            </div>
            <div className={styles.pluginList}>
                {plugins.map((plugin) => (
                    <span key={plugin} className={styles.pluginTag}>#{plugin}</span>
                ))}
            </div>
        </div>
    );
}

export default function WorkflowGallery(): ReactNode {
    return (
        <section className={styles.galleryContainer}>
            <div className="container">
                <div className="text--center margin-bottom--xl">
                    <Heading as="h2" className="text-gradient" style={{ fontSize: '2.5rem' }}>
                        Workflow Concepts & Vision
                    </Heading>
                    <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', opacity: 0.8 }}>
                        Explore what's possible with the Undergrowth nervous system.
                        These concepts showcase how our foundation can be composed to solve
                        complex infrastructure challenges.
                    </p>
                </div>
                <div className={styles.galleryGrid}>
                    {workflows.map((workflow, idx) => (
                        <WorkflowCard key={idx} {...workflow} />
                    ))}
                </div>
                <div className="text--center margin-top--lg" style={{ opacity: 0.6, fontSize: '0.9rem' }}>
                    <em>Note: These are architectural concepts. Implementation requires configuring specific plugins available in the Undergrowth engine.</em>
                </div>
            </div>
        </section>
    );
}
