import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DocPage = () => {
    const { slug } = useParams();
    const { docsLinks } = useOutletContext();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDoc = async () => {
            setLoading(true);
            setError(null);

            try {
                // Find the file mapping for the current slug
                const docSettings = docsLinks.find(link => link.path === slug);

                if (!docSettings) {
                    // Handle default case or 404
                    if (!slug) {
                        // If /docs/ root, maybe redirect or show index?
                        // For now, let's load the first one or a welcome.
                        const first = docsLinks[0];
                        const res = await fetch(`/docs/${first.file}`);
                        const text = await res.text();
                        setContent(text);
                        return;
                    }
                    throw new Error('Document not found');
                }

                const response = await fetch(`/docs/${docSettings.file}`);
                if (!response.ok) {
                    throw new Error(`Failed to load document: ${response.statusText}`);
                }
                const text = await response.text();
                setContent(text);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadDoc();
    }, [slug, docsLinks]);

    if (loading) {
        return <div className="loading">Loading documentation...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Page not found</h2>
                <p>The requested documentation page could not be found.</p>
                <p className="error-details">{error}</p>
            </div>
        );
    }

    return (
        <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
    );
};

export default DocPage;
