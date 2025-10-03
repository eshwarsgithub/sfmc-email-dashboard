// src/components/SimpleQuickDonate.tsx
import React, { useState } from 'react';
import { Heart, Zap, Gift, Shield, CheckCircle, ArrowRight } from 'lucide-react';

interface QuickDonateProps {
  onDonate: (amount: number, isQuick: boolean) => void;
  isProcessing: boolean;
}

const SimpleQuickDonate: React.FC<QuickDonateProps> = ({ onDonate, isProcessing }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [showThankYou, setShowThankYou] = useState(false);

  const quickAmounts = [
    { amount: 25, impact: 'Feeds 1 family for 3 days', icon: '🍽️', popular: false },
    { amount: 50, impact: 'Emergency kit for 1 family', icon: '🎒', popular: true },
    { amount: 100, impact: 'Clean water for 5 families', icon: '💧', popular: false },
    { amount: 250, impact: 'Temporary shelter materials', icon: '🏠', popular: false },
    { amount: 500, impact: 'Medical supplies for 10 people', icon: '🏥', popular: false },
    { amount: 1000, impact: 'Complete relief package', icon: '🎁', popular: false }
  ];

  const handleQuickDonate = async (amount: number) => {
    setSelectedAmount(amount);
    await onDonate(amount, true);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 5000);
  };

  if (showThankYou) {
    return (
      <div className="quick-donate-thank-you">
        <div className="thank-you-animation">
          <CheckCircle size={64} className="success-icon" />
          <h3>Thank You! 🙏</h3>
          <p>Your ${selectedAmount} donation is making a real difference!</p>
          <div className="impact-message">
            <div className="impact-icon">
              {quickAmounts.find(a => a.amount === selectedAmount)?.icon}
            </div>
            <p>{quickAmounts.find(a => a.amount === selectedAmount)?.impact}</p>
          </div>
          <div className="thank-you-actions">
            <button 
              className="btn-share"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'I just donated to Punjab Flood Relief',
                    text: `I donated $${selectedAmount} to help Punjab flood victims. Join me in making a difference!`,
                    url: window.location.href
                  });
                }
              }}
            >
              Share with Friends
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-quick-donate">
      <div className="quick-donate-header">
        <div className="header-icon">
          <Zap size={24} />
        </div>
        <h3>Quick Donate - Help Right Now!</h3>
        <p>One-click donations, maximum impact</p>
      </div>

      <div className="quick-amounts-grid">
        {quickAmounts.map((option) => (
          <button
            key={option.amount}
            className={`quick-amount-card ${option.popular ? 'popular' : ''}`}
            onClick={() => handleQuickDonate(option.amount)}
            disabled={isProcessing}
          >
            {option.popular && <div className="popular-badge">Most Popular</div>}
            
            <div className="amount-icon">{option.icon}</div>
            <div className="amount-value">${option.amount}</div>
            <div className="amount-impact">{option.impact}</div>
            
            <div className="donate-action">
              {isProcessing && selectedAmount === option.amount ? (
                <div className="processing">
                  <div className="spinner"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <Heart size={16} />
                  Donate Now
                </>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="quick-donate-features">
        <div className="feature">
          <Shield size={16} />
          <span>100% Secure</span>
        </div>
        <div className="feature">
          <Zap size={16} />
          <span>Instant Impact</span>
        </div>
        <div className="feature">
          <Gift size={16} />
          <span>Tax Deductible</span>
        </div>
      </div>

      <div className="quick-donate-urgency">
        <div className="urgency-message">
          <div className="pulse-dot"></div>
          <span><strong>URGENT:</strong> Families need help NOW - every minute counts!</span>
        </div>
      </div>

      <div className="alternative-donate">
        <p>Want to customize your donation?</p>
        <button 
          className="btn-full-form"
          onClick={() => document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Use Full Donation Form
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default SimpleQuickDonate;