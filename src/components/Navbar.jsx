import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleActivate = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licenseKey }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'License activated successfully!');
        setTimeout(() => {
          setShowActivateModal(false);
          setLicenseKey('');
          setStatus('idle');
          setMessage('');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Activation failed. Please check your key.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <>
      <nav className="navbar glass-panel">
        <div className="container nav-container">
          <Link to="/" className="nav-logo">
            <img src="/processed_logo.png" alt="Undergrowth Logo" className="logo-img" />
            <span className="logo-text">Undergrowth</span>
          </Link>

          <div className={`nav-links ${isOpen ? 'active' : ''}`}>
            <HashLink smooth to="/#features" onClick={() => setIsOpen(false)}>Features</HashLink>
            <HashLink smooth to="/#roles" onClick={() => setIsOpen(false)}>For You</HashLink>
            <HashLink smooth to="/#pricing" onClick={() => setIsOpen(false)}>Pricing</HashLink>
            <Link to="/docs" onClick={() => setIsOpen(false)}>Docs</Link>
            <button className="btn-text" onClick={() => { setIsOpen(false); setShowActivateModal(true); }}>
              Activate
            </button>
            <a href="https://github.com/MyysticOwl/undergrowth-website/releases" target="_blank" rel="noopener noreferrer" className="btn-primary" onClick={() => setIsOpen(false)}>
              Download
            </a>
          </div>

          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {showActivateModal && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setShowActivateModal(false);
        }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Activate License</h2>
              <button className="close-btn" onClick={() => setShowActivateModal(false)}>
                <X size={24} />
              </button>
            </div>

            {status === 'success' ? (
              <div className="status-message success">
                {message}
              </div>
            ) : (
              <form onSubmit={handleActivate} className="activate-form">
                {status === 'error' && (
                  <div className="status-message error">
                    {message}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="licenseKey">License Key</label>
                  <input
                    type="text"
                    id="licenseKey"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    placeholder="Enter your license key"
                    className="form-input"
                    required
                    disabled={status === 'loading'}
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn-primary btn-activate" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Activating...' : 'Activate'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
