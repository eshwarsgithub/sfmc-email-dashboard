// src/components/RecentDonations.tsx
import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Clock, MessageCircle } from 'lucide-react';
import dynamicDataService, { type DonationActivity } from '../services/dynamicDataService';

const RecentDonations: React.FC = () => {
  const [donations, setDonations] = useState<DonationActivity[]>(dynamicDataService.getRecentDonations());
  const [newDonationCount, setNewDonationCount] = useState(0);

  useEffect(() => {
    const unsubscribe = dynamicDataService.onRecentDonationsChange((newDonations) => {
      const previousCount = donations.length;
      setDonations(newDonations);
      
      // Show notification for new donations
      if (newDonations.length > previousCount) {
        setNewDonationCount(newDonations.length - previousCount);
        setTimeout(() => setNewDonationCount(0), 4000);
      }
    });

    return unsubscribe;
  }, [donations.length]);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="recent-donations">
      <div className="donations-header">
        <div className="header-content">
          <h3>Recent Donations</h3>
          <div className="live-indicator">
            <Heart size={16} className="pulse-heart" />
            <span>Live</span>
            {newDonationCount > 0 && (
              <div className="new-donations-badge">
                +{newDonationCount} new
              </div>
            )}
          </div>
        </div>
        <p className="donations-subtitle">Join these generous souls making a difference</p>
      </div>
      
      <div className="donations-list">
        {donations.slice(0, 8).map((donation, index) => (
          <div 
            key={donation.id} 
            className={`donation-item ${index < newDonationCount ? 'new-donation' : ''}`}
          >
            <div className="donation-main">
              <div className="donation-info">
                <div className="donor-name">{donation.donorName}</div>
                <div className="donation-details">
                  <span className="donation-amount">${donation.amount}</span>
                  <div className="donation-meta">
                    <MapPin size={12} />
                    <span className="donor-location">{donation.location}</span>
                    <Clock size={12} />
                    <span className="donation-time">{formatTimeAgo(donation.timestamp)}</span>
                  </div>
                </div>
              </div>
              <div className="donation-heart">
                <Heart size={20} fill="currentColor" />
              </div>
            </div>
            
            {donation.message && (
              <div className="donation-message">
                <MessageCircle size={14} />
                <span>"{donation.message}"</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="donations-footer">
        <p>Every donation, no matter the size, brings hope to families in need</p>
        <div className="donation-impact">
          <span>💝 {donations.length} hearts beating as one</span>
        </div>
      </div>
    </div>
  );
};

export default RecentDonations;