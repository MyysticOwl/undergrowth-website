import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const GITHUB_RELEASES_URL = 'https://github.com/MyysticOwl/undergrowth-website/releases';

type Platform = {
    name: string;
    icon: string;
    architecture: string;
    fileName: string;
    extension: string;
};

const platforms: Platform[] = [
    {
        name: 'Windows',
        icon: '🪟',
        architecture: 'x64',
        fileName: 'undergrowth-windows-x64',
        extension: '.zip',
    },
    {
        name: 'Linux',
        icon: '🐧',
        architecture: 'x64',
        fileName: 'undergrowth-linux-x64',
        extension: '.tar.gz',
    },
    {
        name: 'Linux',
        icon: '🐧',
        architecture: 'arm64',
        fileName: 'undergrowth-linux-arm64',
        extension: '.tar.gz',
    },
];

function DownloadHeader() {
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero__title">
                    Download Undergrowth
                </Heading>
                <p className="hero__subtitle">
                    Get the latest release of the Undergrowth engine and start automating in minutes.
                </p>
                <Link
                    to={GITHUB_RELEASES_URL}
                    className="button button--secondary button--lg"
                >
                    View All Releases on GitHub →
                </Link>
            </div>
        </header>
    );
}

function PlatformCard({ platform }: { platform: Platform }) {
    return (
        <div className={styles.platformCard}>
            <div className={styles.platformIcon}>{platform.icon}</div>
            <Heading as="h3">{platform.name}</Heading>
            <p className={styles.architecture}>{platform.architecture}</p>
            <Link
                to={GITHUB_RELEASES_URL}
                className="button button--primary"
            >
                Download {platform.extension}
            </Link>
        </div>
    );
}

function InstallationInstructions() {
    return (
        <div className={styles.instructionsSection}>
            <Heading as="h2">Quick Start</Heading>
            <div className={styles.instructionsGrid}>
                <div className={styles.instructionStep}>
                    <div className={styles.stepNumber}>1</div>
                    <Heading as="h4">Download</Heading>
                    <p>
                        Download the appropriate archive for your platform from the{' '}
                        <Link to={GITHUB_RELEASES_URL}>releases page</Link>.
                    </p>
                </div>
                <div className={styles.instructionStep}>
                    <div className={styles.stepNumber}>2</div>
                    <Heading as="h4">Extract</Heading>
                    <p>
                        Extract the archive to a location of your choice.
                        The package includes the engine binary and core plugins.
                    </p>
                </div>
                <div className={styles.instructionStep}>
                    <div className={styles.stepNumber}>3</div>
                    <Heading as="h4">Run</Heading>
                    <p>
                        Double-click <code>undergrowth</code> (or run from terminal) and
                        open <code>http://localhost:3000</code> in your browser.
                    </p>
                </div>
            </div>

            <div className={styles.cliSection}>
                <Heading as="h3">Command Line Usage</Heading>
                <pre className={styles.codeBlock}>
                    {`# Start the engine with Web UI
./undergrowth

# Run a workflow headlessly
./undergrowth run workflow.yaml

# Validate a workflow without running
./undergrowth check workflow.yaml

# Show version and license info
./undergrowth --version
./undergrowth --license-info`}
                </pre>
            </div>
        </div>
    );
}

function SystemRequirements() {
    return (
        <div className={styles.requirementsSection}>
            <Heading as="h2">System Requirements</Heading>
            <div className={styles.requirementsGrid}>
                <div className={styles.requirementCard}>
                    <Heading as="h4">Minimum</Heading>
                    <ul>
                        <li>1 CPU core</li>
                        <li>512 MB RAM</li>
                        <li>50 MB disk space (core only)</li>
                        <li>Any OS with x64/arm64</li>
                    </ul>
                </div>
                <div className={styles.requirementCard}>
                    <Heading as="h4">Recommended</Heading>
                    <ul>
                        <li>2+ CPU cores</li>
                        <li>2 GB RAM</li>
                        <li>500 MB disk space (with plugins)</li>
                        <li>Modern browser for Web UI</li>
                    </ul>
                </div>
                <div className={styles.requirementCard}>
                    <Heading as="h4">Embedded / IoT</Heading>
                    <ul>
                        <li>Raspberry Pi 3+</li>
                        <li>256 MB RAM (headless)</li>
                        <li>10 MB (minimal plugins)</li>
                        <li>ARM64 or x64 Linux</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default function Download(): ReactNode {
    return (
        <Layout title="Download" description="Download Undergrowth automation engine for Windows, macOS, and Linux">
            <DownloadHeader />
            <main>
                <section className="container margin-vert--lg">
                    <Heading as="h2" className="text--center margin-bottom--lg">
                        Choose Your Platform
                    </Heading>
                    <div className={styles.platformGrid}>
                        {platforms.map((platform, idx) => (
                            <PlatformCard key={idx} platform={platform} />
                        ))}
                    </div>
                    <p className="text--center margin-top--lg">
                        <Link to={GITHUB_RELEASES_URL}>
                            Looking for older versions? View all releases →
                        </Link>
                    </p>
                </section>

                <section className="container margin-vert--xl">
                    <InstallationInstructions />
                </section>

                <section className={styles.requirementsWrapper}>
                    <div className="container">
                        <SystemRequirements />
                    </div>
                </section>

                <section className="container margin-vert--xl text--center">
                    <Heading as="h2">Need Help Getting Started?</Heading>
                    <p>Check out our documentation for detailed guides and tutorials.</p>
                    <div className={styles.helpButtons}>
                        <Link to="/docs/intro" className="button button--primary button--lg">
                            Read the Docs
                        </Link>
                        <Link to="https://github.com/MyysticOwl/undergrowth-website/discussions" className="button button--secondary button--lg">
                            Ask the Community
                        </Link>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
