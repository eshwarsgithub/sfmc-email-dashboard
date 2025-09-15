// src/components/DynamicStatsBar.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Target, Activity } from 'lucide-react';
import dynamicDataService, { type DynamicStats } from '../services/dynamicDataService';

const DynamicStatsBar: React.FC = () => {
  const [stats, setStats] = useState<DynamicStats>(dynamicDataService.getStats());
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = dynamicDataService.onStatsUpdate((newStats) => {
      setIsUpdating(true);
      setTimeout(() => {
        setStats(newStats);
        setIsUpdating(false);
      }, 300);
    });

    return unsubscribe;
  }, []);

  const progressPercentage = Math.min((stats.totalRaised / stats.totalGoal) * 100, 100);
  const familiesProgressPercentage = Math.min((stats.familiesHelped / stats.totalFamiliesAffected) * 100, 100);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="dynamic-stats-bar">
      <div className="container">
        <div className="stats-grid">
          {/* Fundraising Progress */}
          <div className="stat-item">
            <div className="stat-header">
              <TrendingUp className={`stat-icon ${isUpdating ? 'updating' : ''}`} />
              <div className="stat-info">
                <div className="stat-label">Fundraising Progress</div>
                <div className="stat-value">{formatCurrency(stats.totalRaised)}</div>
                <div className="stat-goal">of {formatCurrency(stats.totalGoal)} goal</div>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="progress-text">{progressPercentage.toFixed(1)}% reached</div>
          </div>

          {/* Families Helped */}
          <div className="stat-item">
            <div className="stat-header">
              <Users className={`stat-icon ${isUpdating ? 'updating' : ''}`} />
              <div className="stat-info">
                <div className="stat-label">Families Helped</div>
                <div className="stat-value">{stats.familiesHelped.toLocaleString()}</div>
                <div className="stat-goal">of {stats.totalFamiliesAffected.toLocaleString()} affected</div>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill families"
                style={{ width: `${familiesProgressPercentage}%` }}
              />
            </div>
            <div className="progress-text">{familiesProgressPercentage.toFixed(1)}% reached</div>
          </div>

          {/* Active Donors */}
          <div className="stat-item">
            <div className="stat-header">
              <Target className={`stat-icon ${isUpdating ? 'updating' : ''}`} />
              <div className="stat-info">
                <div className="stat-label">Total Donors</div>
                <div className="stat-value">{stats.donorsCount.toLocaleString()}</div>
                <div className="stat-goal">generous hearts</div>
              </div>
            </div>
            <div className="pulse-indicator">
              <div className="pulse-dot"></div>
              <span>Live donations</span>
            </div>
          </div>

          {/* Districts Active */}
          <div className="stat-item">
            <div className="stat-header">
              <Activity className={`stat-icon ${isUpdating ? 'updating' : ''}`} />
              <div className="stat-info">
                <div className="stat-label">Active Operations</div>
                <div className="stat-value">{stats.districtsActive}</div>
                <div className="stat-goal">districts covered</div>
              </div>
            </div>
            <div className="last-update">
              Last updated: {stats.lastUpdateTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicStatsBar;