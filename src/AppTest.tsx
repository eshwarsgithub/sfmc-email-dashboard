// Simple test component
import React from 'react';

const AppTest: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test App - React is Working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <div style={{ background: '#f0f0f0', padding: '10px', marginTop: '10px' }}>
        Environment variables loaded:
        <ul>
          <li>SFMC Client ID: {import.meta.env.VITE_SFMC_CLIENT_ID || 'Not found'}</li>
          <li>SFMC Subdomain: {import.meta.env.VITE_SFMC_SUBDOMAIN || 'Not found'}</li>
          <li>Dashboard Title: {import.meta.env.VITE_DASHBOARD_TITLE || 'Not found'}</li>
        </ul>
      </div>
    </div>
  );
};

export default AppTest;