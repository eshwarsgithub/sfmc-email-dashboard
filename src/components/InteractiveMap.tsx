// src/components/InteractiveMap.tsx
import React, { useState } from 'react';
import { MapPin, Users, Droplet, Home, Activity } from 'lucide-react';

interface District {
  id: string;
  name: string;
  status: 'critical' | 'severe' | 'moderate';
  familiesAffected: number;
  reliefCenters: number;
  waterLevel: 'high' | 'medium' | 'receding';
  lastUpdate: string;
}

const InteractiveMap: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  const districts: District[] = [
    {
      id: '1',
      name: 'Ludhiana',
      status: 'critical',
      familiesAffected: 3500,
      reliefCenters: 8,
      waterLevel: 'high',
      lastUpdate: '2 hours ago'
    },
    {
      id: '2',
      name: 'Patiala',
      status: 'severe',
      familiesAffected: 2800,
      reliefCenters: 6,
      waterLevel: 'medium',
      lastUpdate: '1 hour ago'
    },
    {
      id: '3',
      name: 'Mohali',
      status: 'moderate',
      familiesAffected: 1200,
      reliefCenters: 4,
      waterLevel: 'receding',
      lastUpdate: '3 hours ago'
    },
    {
      id: '4',
      name: 'Jalandhar',
      status: 'severe',
      familiesAffected: 2200,
      reliefCenters: 5,
      waterLevel: 'medium',
      lastUpdate: '1.5 hours ago'
    },
    {
      id: '5',
      name: 'Amritsar',
      status: 'moderate',
      familiesAffected: 1800,
      reliefCenters: 4,
      waterLevel: 'receding',
      lastUpdate: '4 hours ago'
    },
    {
      id: '6',
      name: 'Bathinda',
      status: 'critical',
      familiesAffected: 2500,
      reliefCenters: 6,
      waterLevel: 'high',
      lastUpdate: '1 hour ago'
    },
    {
      id: '7',
      name: 'Ferozepur',
      status: 'severe',
      familiesAffected: 1500,
      reliefCenters: 3,
      waterLevel: 'medium',
      lastUpdate: '2.5 hours ago'
    },
    {
      id: '8',
      name: 'Gurdaspur',
      status: 'moderate',
      familiesAffected: 900,
      reliefCenters: 3,
      waterLevel: 'receding',
      lastUpdate: '5 hours ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#dc2626'; // red
      case 'severe': return '#f59e0b';   // orange
      case 'moderate': return '#10b981'; // green
      default: return '#6b7280';         // gray
    }
  };

  const getWaterLevelIcon = (level: string) => {
    switch (level) {
      case 'high': return '🌊';
      case 'medium': return '💧';
      case 'receding': return '📉';
      default: return '💧';
    }
  };

  return (
    <div className="interactive-map">
      <div className="map-header">
        <h3>Punjab Flood Impact Map</h3>
        <p>Click on a district to see detailed information</p>
      </div>
      
      <div className="map-container">
        <div className="map-districts">
          <svg
            viewBox="0 0 400 300"
            className="districts-svg"
          >
            {/* Simplified Punjab districts representation */}
            {/* Ludhiana */}
            <circle
              cx="180"
              cy="150"
              r="25"
              fill={getStatusColor(districts[0].status)}
              className="district-marker"
              onClick={() => setSelectedDistrict(districts[0])}
            />
            <text x="180" y="185" textAnchor="middle" className="district-label">
              Ludhiana
            </text>
            
            {/* Patiala */}
            <circle
              cx="160"
              cy="120"
              r="20"
              fill={getStatusColor(districts[1].status)}
              className="district-marker"
              onClick={() => setSelectedDistrict(districts[1])}
            />
            <text x="160" y="105" textAnchor="middle" className="district-label">
              Patiala
            </text>
            
            {/* Mohali */}
            <circle
              cx="140"
              cy="140"
              r="15"
              fill={getStatusColor(districts[2].status)}
              className="district-marker"
              onClick={() => setSelectedDistrict(districts[2])}
            />
            <text x="140" y="125" textAnchor="middle" className="district-label">
              Mohali
            </text>
            
            {/* Jalandhar */}
            <circle
              cx="120"
              cy="170"
              r="20"
              fill={getStatusColor(districts[3].status)}
              className="district-marker"
              onClick={() => setSelectedDistrict(districts[3])}
            />
            <text x="120" y="205" textAnchor="middle" className="district-label">
              Jalandhar
            </text>
            
            {/* Amritsar */}
            <circle
              cx="80"
              cy="80"
              r="18"
              fill={getStatusColor(districts[4].status)}
              className="district-marker"
              onClick={() => setSelectedDistrict(districts[4])}
            />
            <text x="80" y="65" textAnchor="middle" className="district-label">
              Amritsar
            </text>
            
            {/* Bathinda */}
            <circle
              cx="200"
              cy="200"
              r="22"
              fill={getStatusColor(districts[5].status)}
              className="district-marker"
              onClick={() => setSelectedDistrict(districts[5])}
            />
            <text x="200" y="235" textAnchor="middle" className="district-label">
              Bathinda
            </text>
            
            {/* Ferozepur */}
            <circle
              cx="100"
              cy="220"
              r="16"
              fill={getStatusColor(districts[6].status)}
              className="district-marker"
              onClick={() => setSelectedDistrict(districts[6])}
            />
            <text x="100" y="250" textAnchor="middle" className="district-label">
              Ferozepur
            </text>
            
            {/* Gurdaspur */}
            <circle
              cx="60"
              cy="60"
              r="14"
              fill={getStatusColor(districts[7].status)}
              className="district-marker"
              onClick={() => setSelectedDistrict(districts[7])}
            />
            <text x="60" y="45" textAnchor="middle" className="district-label">
              Gurdaspur
            </text>
          </svg>
        </div>
        
        <div className="map-legend">
          <h4>Flood Impact Levels</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#dc2626' }}></div>
              <span>Critical</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
              <span>Severe</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
              <span>Moderate</span>
            </div>
          </div>
        </div>
      </div>
      
      {selectedDistrict && (
        <div className="district-details">
          <div className="details-header">
            <h4>
              <MapPin size={16} />
              {selectedDistrict.name} District
            </h4>
            <span className={`status-badge status-${selectedDistrict.status}`}>
              {selectedDistrict.status.toUpperCase()}
            </span>
          </div>
          
          <div className="details-grid">
            <div className="detail-item">
              <Users size={16} />
              <div>
                <span className="detail-number">{selectedDistrict.familiesAffected.toLocaleString()}</span>
                <span className="detail-label">Families Affected</span>
              </div>
            </div>
            
            <div className="detail-item">
              <Home size={16} />
              <div>
                <span className="detail-number">{selectedDistrict.reliefCenters}</span>
                <span className="detail-label">Relief Centers</span>
              </div>
            </div>
            
            <div className="detail-item">
              <Droplet size={16} />
              <div>
                <span className="detail-number">{getWaterLevelIcon(selectedDistrict.waterLevel)}</span>
                <span className="detail-label">Water Level: {selectedDistrict.waterLevel}</span>
              </div>
            </div>
            
            <div className="detail-item">
              <Activity size={16} />
              <div>
                <span className="detail-number">●</span>
                <span className="detail-label">Updated {selectedDistrict.lastUpdate}</span>
              </div>
            </div>
          </div>
          
          <button 
            className="close-details"
            onClick={() => setSelectedDistrict(null)}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;