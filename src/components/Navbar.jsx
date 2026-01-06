import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
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
          <a href="https://github.com/MyysticOwl/undergrowth/releases" target="_blank" rel="noopener noreferrer" className="btn-primary" onClick={() => setIsOpen(false)}>
            Download
          </a>
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
