// src/components/AnimatedThermometer.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, Target } from 'lucide-react';

interface ThermometerProps {
  currentAmount: number;
  goalAmount: number;
  familiesHelped: number;
  totalFamilies: number;
  daysLeft: number;
}

const AnimatedThermometer: React.FC<ThermometerProps> = ({
  currentAmount,
  goalAmount,
  familiesHelped,
  totalFamilies,
  daysLeft
}) => {
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const [animatedFamilies, setAnimatedFamilies] = useState(0);

  useEffect(() => {
    // Animate the numbers
    const duration = 2000; // 2 seconds
    const steps = 60;
    const amountStep = currentAmount / steps;
    const familiesStep = familiesHelped / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps) {
        setAnimatedAmount(Math.floor(amountStep * currentStep));
        setAnimatedFamilies(Math.floor(familiesStep * currentStep));
        currentStep++;
      } else {
        setAnimatedAmount(currentAmount);
        setAnimatedFamilies(familiesHelped);
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [currentAmount, familiesHelped]);

  const percentage = Math.min((animatedAmount / goalAmount) * 100, 100);
  const familyPercentage = Math.min((animatedFamilies / totalFamilies) * 100, 100);
  
  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="animated-thermometer">
      <div className="thermometer-header">
        <h2>🌡️ Relief Progress Tracker</h2>
        <p>Watch the impact grow with every donation!</p>
      </div>

      {/* Main Thermometer */}
      <div className="thermometer-container">
        <div className="thermometer-main">
          <div className="thermometer-tube">
            <div className="thermometer-scale">
              {[100, 80, 60, 40, 20].map(mark => (
                <div key={mark} className="scale-mark">
                  <div className="mark-line"></div>
                  <span className="mark-label">{mark}%</span>
                </div>
              ))}
            </div>
            
            <div className="thermometer-fill-container">
              <div 
                className="thermometer-fill"
                style={{ height: `${percentage}%` }}
              >
                <div className="fill-animation"></div>
                <div className="fill-bubbles">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bubble" style={{ animationDelay: `${i * 0.3}s` }} />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="thermometer-bulb">
              <div className="bulb-inner">
                <div className="bulb-mercury"></div>
              </div>
            </div>
          </div>
          
          <div className="thermometer-stats">
            <div className="main-stat">
              <div className="stat-amount">{formatAmount(animatedAmount)}</div>
              <div className="stat-goal">of {formatAmount(goalAmount)} goal</div>
              <div className="stat-percentage">{percentage.toFixed(1)}% Complete</div>
            </div>
          </div>
        </div>

        {/* Side Statistics */}
        <div className="side-stats">
          <div className="stat-card families">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{animatedFamilies.toLocaleString()}</div>
              <div className="stat-label">Families Helped</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill families-fill"
                  style={{ width: `${familyPercentage}%` }}
                ></div>
              </div>
              <div className="stat-sub">of {totalFamilies.toLocaleString()} affected</div>
            </div>
          </div>

          <div className="stat-card urgency">
            <div className="stat-icon urgent">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number urgent">{daysLeft}</div>
              <div className="stat-label">Days Left</div>
              <div className="urgency-message">
                {daysLeft <= 7 ? '🚨 CRITICAL' : daysLeft <= 14 ? '⚠️ URGENT' : '📅 TIME SENSITIVE'}
              </div>
            </div>
          </div>

          <div className="stat-card impact">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{Math.floor(percentage)}%</div>
              <div className="stat-label">Goal Reached</div>
              <div className="remaining-amount">
                ${(goalAmount - animatedAmount).toLocaleString()} to go
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Milestones */}
      <div className="milestones">
        <h3>🎯 Recent Milestones</h3>
        <div className="milestone-list">
          {percentage >= 20 && (
            <div className="milestone achieved">
              <div className="milestone-icon">✅</div>
              <div className="milestone-text">
                <strong>20% Reached!</strong> Emergency supplies distributed
              </div>
            </div>
          )}
          {percentage >= 40 && (
            <div className="milestone achieved">
              <div className="milestone-icon">✅</div>
              <div className="milestone-text">
                <strong>40% Reached!</strong> Temporary shelters established
              </div>
            </div>
          )}
          {percentage >= 60 && (
            <div className="milestone achieved">
              <div className="milestone-icon">✅</div>
              <div className="milestone-text">
                <strong>60% Reached!</strong> Medical aid stations operational
              </div>
            </div>
          )}
          {percentage < 80 && (
            <div className="milestone upcoming">
              <div className="milestone-icon">🎯</div>
              <div className="milestone-text">
                <strong>Next: 80%</strong> Clean water systems for all districts
              </div>
            </div>
          )}
          {percentage >= 80 && percentage < 100 && (
            <div className="milestone upcoming">
              <div className="milestone-icon">🎯</div>
              <div className="milestone-text">
                <strong>Final Goal: 100%</strong> Complete rehabilitation program
              </div>
            </div>
          )}
          {percentage >= 100 && (
            <div className="milestone achieved celebration">
              <div className="milestone-icon">🎉</div>
              <div className="milestone-text">
                <strong>GOAL ACHIEVED!</strong> Thank you for making this possible!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="thermometer-cta">
        <div className="cta-content">
          <h4>🚀 Help us reach the next milestone!</h4>
          <p>Every donation brings us closer to helping all {totalFamilies.toLocaleString()} families</p>
          <button 
            className="cta-donate-btn"
            onClick={() => document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <TrendingUp size={16} />
            Boost the Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimatedThermometer;