// src/components/FloatingActionButton.tsx
import React, { useState, useEffect } from 'react';
import { Heart, X, Zap, Share2, Phone } from 'lucide-react';

interface FloatingActionButtonProps {
  onQuickDonate: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onQuickDonate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsExpanded(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Help Punjab Flood Victims',
        text: 'Join me in supporting Punjab flood relief. Every donation helps save lives!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
    setIsExpanded(false);
  };

  const handleCall = () => {
    window.location.href = 'tel:+15551234567';
    setIsExpanded(false);
  };

  return (
    <div className={`floating-action-button ${isVisible ? 'visible' : 'hidden'}`}>
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fab-backdrop" 
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      {/* Action Menu */}
      {isExpanded && (
        <div className="fab-menu">
          <button 
            className="fab-action quick-donate"
            onClick={() => {
              onQuickDonate();
              setIsExpanded(false);
            }}
            title="Quick Donate $50"
          >
            <Zap size={20} />
            <span>Quick $50</span>
          </button>
          
          <button 
            className="fab-action share"
            onClick={handleShare}
            title="Share with friends"
          >
            <Share2 size={20} />
            <span>Share</span>
          </button>
          
          <button 
            className="fab-action call"
            onClick={handleCall}
            title="Call for help"
          >
            <Phone size={20} />
            <span>Call Us</span>
          </button>
        </div>
      )}
      
      {/* Main FAB Button */}
      <button
        className={`fab-main ${isExpanded ? 'expanded' : ''}`}
        onClick={toggleExpanded}
        title={isExpanded ? 'Close menu' : 'Quick actions'}
      >
        {isExpanded ? (
          <X size={24} />
        ) : (
          <>
            <Heart size={24} className="fab-heart" />
            <div className="fab-pulse"></div>
          </>
        )}
      </button>
      
      {/* Urgent Badge */}
      {!isExpanded && (
        <div className="fab-badge">
          URGENT
        </div>
      )}
    </div>
  );
};

export default FloatingActionButton;