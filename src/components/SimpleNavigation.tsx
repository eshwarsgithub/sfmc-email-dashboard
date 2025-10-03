// src/components/SimpleNavigation.tsx
import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, Info, Phone, Share2 } from 'lucide-react';

interface SimpleNavigationProps {
  onQuickDonate: () => void;
}

const SimpleNavigation: React.FC<SimpleNavigationProps> = ({ onQuickDonate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Punjab Floods 2025 Relief Fund',
        text: 'Help Punjab flood victims with emergency relief. Every donation counts!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied! Share it with friends to spread awareness.');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`simple-navigation ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-text">🙏 Punjab Relief</span>
            <div className="live-indicator">
              <div className="pulse-dot"></div>
              <span>LIVE</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-links desktop">
            <button onClick={() => scrollToSection('photo-stories')} className="nav-link">
              📷 Stories
            </button>
            <button onClick={() => scrollToSection('progress-tracker')} className="nav-link">
              📊 Progress
            </button>
            <button onClick={() => scrollToSection('donation-form')} className="nav-link">
              💝 Donate
            </button>
            <button onClick={handleShare} className="nav-link share">
              <Share2 size={16} />
              Share
            </button>
            <button onClick={onQuickDonate} className="nav-donate-btn">
              <Heart size={16} />
              Quick $50
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <div className="quick-actions">
                <button onClick={onQuickDonate} className="quick-action primary">
                  <Heart size={20} />
                  <span>Quick Donate $50</span>
                </button>
                <button onClick={handleShare} className="quick-action">
                  <Share2 size={20} />
                  <span>Share with Friends</span>
                </button>
              </div>

              <div className="menu-links">
                <button onClick={() => scrollToSection('photo-stories')} className="menu-link">
                  <Info size={20} />
                  <div>
                    <span>View Stories</span>
                    <small>See real impact photos</small>
                  </div>
                </button>
                
                <button onClick={() => scrollToSection('progress-tracker')} className="menu-link">
                  <div className="progress-icon">📊</div>
                  <div>
                    <span>Our Progress</span>
                    <small>$2.3M raised so far</small>
                  </div>
                </button>
                
                <button onClick={() => scrollToSection('donation-form')} className="menu-link">
                  <Heart size={20} />
                  <div>
                    <span>Full Donation Form</span>
                    <small>Personalized giving</small>
                  </div>
                </button>
                
                <a href="tel:+15551234567" className="menu-link">
                  <Phone size={20} />
                  <div>
                    <span>Call for Support</span>
                    <small>+1 (555) 123-4567</small>
                  </div>
                </a>
              </div>

              <div className="urgent-banner">
                <div className="urgent-content">
                  <div className="urgent-icon">🚨</div>
                  <div>
                    <strong>URGENT: 15,000 families need help</strong>
                    <small>Flood situation critical - immediate aid needed</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default SimpleNavigation;