
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import axios from 'axios';
import confetti from 'canvas-confetti';
import clsx from 'clsx';
import styles from './index.module.css'; // Re-using home styles or generic

export default function Activate(): JSX.Element {
    const [email, setEmail] = useState('');
    const [licenseKey, setLicenseKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/activate', {
                email,
                license_key: licenseKey,
            }, {
                responseType: 'blob' // Important for file download
            });

            // Trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            // Try to get filename from header or default
            link.setAttribute('download', 'license.undergrowth');
            document.body.appendChild(link);
            link.click();
            link.remove();

            setSuccess(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data instanceof Blob) {
                // Parse blob error
                const text = await err.response.data.text();
                try {
                    const json = JSON.parse(text);
                    setError(json.error || 'Activation failed');
                } catch {
                    setError(text || 'Activation failed');
                }
            } else {
                setError(err.message || 'Activation failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout
            title="Activate License"
            description="Activate your Undergrowth license for offline use">
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                padding: '2rem'
            }}>
                <h1>License Activation</h1>
                <p style={{ maxWidth: '600px', textAlign: 'center', marginBottom: '2rem' }}>
                    Enter your Lemon Squeezy license key below to generate your offline license file.
                    <br />
                    Once downloaded, place the <code>license.undergrowth</code> file in your Engine's <code>data/</code> folder.
                </p>

                <div style={{
                    background: 'var(--ifm-card-background-color)',
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    width: '100%',
                    maxWidth: '500px'
                }}>
                    {success ? (
                        <div style={{ textAlign: 'center', color: 'green' }}>
                            <h2>🎉 Activation Successful!</h2>
                            <p>Your license file should be downloading automatically.</p>
                            <button
                                className="button button--secondary"
                                onClick={() => { setSuccess(false); setLicenseKey(''); }}
                                style={{ marginTop: '1rem' }}
                            >
                                Activate Another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleActivate}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '4px',
                                        border: '1px solid var(--ifm-color-emphasis-300)',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>License Key</label>
                                <input
                                    type="text"
                                    required
                                    value={licenseKey}
                                    onChange={(e) => setLicenseKey(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '4px',
                                        border: '1px solid var(--ifm-color-emphasis-300)',
                                        fontSize: '1rem',
                                        fontFamily: 'monospace'
                                    }}
                                    placeholder="XXXX-XXXX-XXXX-XXXX"
                                />
                            </div>

                            {error && (
                                <div style={{ color: 'var(--ifm-color-danger)', marginBottom: '1rem', background: 'rgba(255,0,0,0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={clsx('button button--primary button--lg', { 'button--disabled': loading })}
                                style={{ width: '100%' }}
                            >
                                {loading ? 'Activating...' : 'Generate Offline License'}
                            </button>
                        </form>
                    )}
                </div>

                <div style={{ marginTop: '3rem', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)' }}>
                    <p>Need help? <a href="mailto:support@undergrowth.io">Contact Support</a></p>
                </div>
            </div>
        </Layout>
    );
}
