// src/components/LiveUpdates.tsx
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Heart, Shield, Users, Package } from 'lucide-react';
import dynamicDataService, { type LiveUpdate } from '../services/dynamicDataService';

const LiveUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<LiveUpdate[]>(dynamicDataService.getLiveUpdates());
  const [newUpdateCount, setNewUpdateCount] = useState(0);

  useEffect(() => {
    const unsubscribe = dynamicDataService.onLiveUpdatesChange((newUpdates) => {
      const previousCount = updates.length;
      setUpdates(newUpdates);
      
      // Show notification for new updates
      if (newUpdates.length > previousCount) {
        setNewUpdateCount(newUpdates.length - previousCount);
        setTimeout(() => setNewUpdateCount(0), 3000);
      }
    });

    return unsubscribe;
  }, [updates.length]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'relief':
        return <Package size={16} />;
      case 'medical':
        return <Heart size={16} />;
      case 'rescue':
        return <Shield size={16} />;
      case 'supplies':
        return <Package size={16} />;
      default:
        return <Users size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'relief':
        return 'type-relief';
      case 'medical':
        return 'type-medical';
      case 'rescue':
        return 'type-rescue';
      case 'supplies':
        return 'type-supplies';
      default:
        return 'type-default';
    }
  };

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
    <div className="live-updates">
      <div className="updates-header">
        <div className="header-content">
          <h3>Live Updates from the Field</h3>
          <div className="live-indicator">
            <div className="pulse-dot"></div>
            <span>Live</span>
            {newUpdateCount > 0 && (
              <div className="new-updates-badge">
                +{newUpdateCount} new
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="updates-list">
        {updates.map((update, index) => (
          <div 
            key={update.id} 
            className={`update-item ${index < newUpdateCount ? 'new-update' : ''}`}
          >
            <div className="update-header">
              <div className={`update-type ${getTypeColor(update.type)}`}>
                {getTypeIcon(update.type)}
                <span className="type-label">{update.type.toUpperCase()}</span>
              </div>
              <div className="update-time">
                <Clock size={14} />
                {formatTimeAgo(update.timestamp)}
              </div>
            </div>
            
            <div className="update-content">
              <h4 className="update-title">{update.title}</h4>
              <p className="update-description">{update.description}</p>
              {update.location && (
                <div className="update-location">
                  <MapPin size={14} />
                  <span>{update.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="updates-footer">
        <p>Updates are posted in real-time as our teams work across Punjab</p>
      </div>
    </div>
  );
};

export default LiveUpdates;