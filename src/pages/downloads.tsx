import { useEffect, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './downloads.module.css';

type ReleaseAsset = {
    name: string;
    os: string;
    arch: string;
};

type ReleaseInfo = {
    version: string;
    date: string;
    assets: ReleaseAsset[];
};

type LatestInfo = {
    version: string;
    date: string;
    url: string;
};

const platformIcons: Record<string, string> = {
    windows: '🪟',
    linux: '🐧',
};

const archLabels: Record<string, string> = {
    x64: 'x86_64',
    arm64: 'ARM64',
};

function DownloadCard({ asset, version, baseUrl }: { asset: ReleaseAsset; version: string; baseUrl: string }) {
    const downloadUrl = `${baseUrl}${asset.name}`;
    const osLabel = asset.os.charAt(0).toUpperCase() + asset.os.slice(1);
    const archLabel = archLabels[asset.arch] || asset.arch;
    const icon = platformIcons[asset.os] || '📦';

    return (
        <div className={styles.downloadCard}>
            <div className={styles.platformIcon}>{icon}</div>
            <div className={styles.platformInfo}>
                <Heading as="h3" className={styles.platformName}>
                    {osLabel} {archLabel}
                </Heading>
                <p className={styles.filename}>{asset.name}</p>
            </div>
            <a href={downloadUrl} className="button button--primary button--lg" download>
                Download
            </a>
        </div>
    );
}

function LoadingState() {
    return (
        <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading release information...</p>
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className={styles.errorState}>
            <p>⚠️ {message}</p>
            <p>
                Check our{' '}
                <Link to="https://github.com/MyysticOwl/undergrowth/releases">GitHub Releases</Link>{' '}
                page for downloads.
            </p>
        </div>
    );
}

function ReleaseSection({ release, isLatest }: { release: ReleaseInfo; isLatest: boolean }) {
    const baseUrl = `/releases/${release.version}/`;
    const releaseDate = new Date(release.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <section className={styles.releaseSection}>
            <div className={styles.releaseHeader}>
                <div className={styles.versionInfo}>
                    <Heading as="h2" className={styles.versionTitle}>
                        {release.version}
                        {isLatest && <span className={styles.latestBadge}>Latest</span>}
                    </Heading>
                    <p className={styles.releaseDate}>Released {releaseDate}</p>
                </div>
                <Link
                    to={`https://github.com/MyysticOwl/undergrowth/releases/tag/${release.version}`}
                    className="button button--secondary"
                >
                    Release Notes
                </Link>
            </div>
            <div className={styles.downloadGrid}>
                {release.assets.map((asset, idx) => (
                    <DownloadCard key={idx} asset={asset} version={release.version} baseUrl={baseUrl} />
                ))}
            </div>
        </section>
    );
}

function SystemRequirements() {
    return (
        <section className={styles.requirementsSection}>
            <Heading as="h2">System Requirements</Heading>
            <div className={styles.requirementsGrid}>
                <div className={styles.requirementCard}>
                    <Heading as="h4">🪟 Windows</Heading>
                    <ul>
                        <li>Windows 10 or later (64-bit)</li>
                        <li>4 GB RAM minimum</li>
                        <li>100 MB disk space</li>
                    </ul>
                </div>
                <div className={styles.requirementCard}>
                    <Heading as="h4">🐧 Linux</Heading>
                    <ul>
                        <li>Ubuntu 20.04+, Debian 11+, or equivalent</li>
                        <li>4 GB RAM minimum</li>
                        <li>100 MB disk space</li>
                        <li>glibc 2.31 or later</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}

function QuickStart() {
    return (
        <section className={styles.quickStartSection}>
            <Heading as="h2">Quick Start</Heading>
            <div className={styles.steps}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <Heading as="h4">Download & Extract</Heading>
                        <p>Download the archive for your platform and extract it to your preferred location.</p>
                    </div>
                </div>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <Heading as="h4">Run Undergrowth</Heading>
                        <code className={styles.codeBlock}>./undergrowth</code>
                        <p>Or on Windows: <code>undergrowth.exe</code></p>
                    </div>
                </div>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <Heading as="h4">Open Web UI</Heading>
                        <p>
                            Visit <code>http://localhost:8096</code> in your browser to access the dashboard.
                        </p>
                    </div>
                </div>
            </div>
            <div className={styles.docLinks}>
                <Link to="/docs/intro" className="button button--secondary">
                    📚 Documentation
                </Link>
                <Link to="/docs/ai/ollama-setup" className="button button--secondary">
                    🤖 AI Setup Guide
                </Link>
                <Link to="https://github.com/MyysticOwl/undergrowth" className="button button--secondary">
                    ⚙️ GitHub Repository
                </Link>
            </div>
        </section>
    );
}

export default function Downloads(): ReactNode {
    const [latest, setLatest] = useState<LatestInfo | null>(null);
    const [release, setRelease] = useState<ReleaseInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchReleaseInfo() {
            try {
                // Fetch latest version info
                const latestRes = await fetch('/releases/latest.json');
                if (!latestRes.ok) {
                    throw new Error('No releases available yet');
                }
                const latestData: LatestInfo = await latestRes.json();
                setLatest(latestData);

                // Fetch release details
                const releaseRes = await fetch(`/releases/${latestData.version}/release.json`);
                if (releaseRes.ok) {
                    const releaseData: ReleaseInfo = await releaseRes.json();
                    setRelease(releaseData);
                } else {
                    // Create minimal release info from latest
                    setRelease({
                        version: latestData.version,
                        date: latestData.date,
                        assets: [
                            { name: `undergrowth-${latestData.version}-windows-x64.zip`, os: 'windows', arch: 'x64' },
                            { name: `undergrowth-${latestData.version}-linux-x64.tar.gz`, os: 'linux', arch: 'x64' },
                            { name: `undergrowth-${latestData.version}-linux-arm64.tar.gz`, os: 'linux', arch: 'arm64' },
                        ],
                    });
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load release information');
            } finally {
                setLoading(false);
            }
        }

        fetchReleaseInfo();
    }, []);

    return (
        <Layout title="Downloads" description="Download Undergrowth automation engine for Windows and Linux.">
            <header className={styles.header}>
                <div className="container">
                    <Heading as="h1">Download Undergrowth</Heading>
                    <p className={styles.subtitle}>
                        Get the latest release for your platform. Free to download, free to use.
                    </p>
                </div>
            </header>
            <main className="container margin-vert--lg">
                {loading && <LoadingState />}
                {error && <ErrorState message={error} />}
                {!loading && !error && release && (
                    <ReleaseSection release={release} isLatest={true} />
                )}

                <SystemRequirements />
                <QuickStart />

                <section className={styles.moreSection}>
                    <Heading as="h2">Previous Releases</Heading>
                    <p>
                        Looking for an older version? Check our{' '}
                        <Link to="https://github.com/MyysticOwl/undergrowth/releases">
                            GitHub Releases
                        </Link>{' '}
                        page for the full release history.
                    </p>
                </section>
            </main>
        </Layout>
    );
}
