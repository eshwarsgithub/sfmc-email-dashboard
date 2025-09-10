// Data upload component for SFMC CSV files and manual entry
import React, { useState, useRef } from 'react';
import { Upload, FileText, Plus, X, Download, AlertCircle, CheckCircle } from 'lucide-react';
import type { DashboardData } from '../services/sfmcService';

interface DataUploadProps {
  onDataUploaded: (data: Partial<DashboardData>) => void;
  onClose: () => void;
}

interface ManualCampaign {
  name: string;
  sent: string;
  opened: string;
  clicked: string;
  bounced: string;
  date: string;
}

const DataUpload: React.FC<DataUploadProps> = ({ onDataUploaded, onClose }) => {
  const [activeTab, setActiveTab] = useState<'csv' | 'manual'>('csv');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Manual entry state
  const [manualCampaigns, setManualCampaigns] = useState<ManualCampaign[]>([
    { name: '', sent: '', opened: '', clicked: '', bounced: '', date: new Date().toISOString().split('T')[0] }
  ]);

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setErrorMessage('Please select a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setUploadStatus('uploading');
        const csvData = e.target?.result as string;
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            csvData,
            dataType: 'campaigns' // Auto-detect in backend
          })
        });

        const result = await response.json();

        if (result.success) {
          setUploadStatus('success');
          setSuccessMessage(`Successfully imported ${result.recordCount} campaigns`);
          
          // Convert uploaded data to dashboard format
          const dashboardData: Partial<DashboardData> = {
            campaigns: result.data.campaigns || [],
            isRealData: true,
            connectionStatus: 'Data imported from CSV',
            sfmcConnected: true
          };

          // Calculate overview from campaigns
          if (result.data.campaigns) {
            const overview = result.data.campaigns.reduce((acc: any, campaign: any) => {
              acc.totalSent += campaign.sent || 0;
              acc.delivered += campaign.delivered || campaign.sent || 0;
              acc.opened += campaign.opened || 0;
              acc.clicked += campaign.clicked || 0;
              acc.bounced += campaign.bounced || 0;
              return acc;
            }, { totalSent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0 });
            
            dashboardData.overview = overview;
          }

          setTimeout(() => {
            onDataUploaded(dashboardData);
          }, 1500);
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } catch (error) {
        setUploadStatus('error');
        setErrorMessage((error as Error).message);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const addManualCampaign = () => {
    setManualCampaigns([...manualCampaigns, 
      { name: '', sent: '', opened: '', clicked: '', bounced: '', date: new Date().toISOString().split('T')[0] }
    ]);
  };

  const removeManualCampaign = (index: number) => {
    setManualCampaigns(manualCampaigns.filter((_, i) => i !== index));
  };

  const updateManualCampaign = (index: number, field: keyof ManualCampaign, value: string) => {
    const updated = [...manualCampaigns];
    updated[index][field] = value;
    setManualCampaigns(updated);
  };

  const submitManualData = () => {
    try {
      const validCampaigns = manualCampaigns.filter(c => c.name && c.sent);
      
      if (validCampaigns.length === 0) {
        setErrorMessage('Please add at least one campaign with name and sent count');
        return;
      }

      const campaigns = validCampaigns.map((campaign, index) => ({
        id: `manual_${index + 1}`,
        name: campaign.name,
        date: campaign.date || new Date().toISOString(),
        status: 'Completed',
        sent: parseInt(campaign.sent) || 0,
        opened: parseInt(campaign.opened) || 0,
        clicked: parseInt(campaign.clicked) || 0,
        delivered: parseInt(campaign.sent) || 0,
        bounced: parseInt(campaign.bounced) || 0
      }));

      // Calculate overview
      const overview = campaigns.reduce((acc, campaign) => {
        acc.totalSent += campaign.sent;
        acc.delivered += campaign.delivered;
        acc.opened += campaign.opened;
        acc.clicked += campaign.clicked;
        acc.bounced += campaign.bounced;
        return acc;
      }, { totalSent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0 });

      const dashboardData: Partial<DashboardData> = {
        campaigns,
        overview,
        isRealData: true,
        connectionStatus: 'Manual data entry',
        sfmcConnected: true
      };

      setSuccessMessage(`Successfully added ${campaigns.length} campaigns`);
      setTimeout(() => {
        onDataUploaded(dashboardData);
      }, 1500);
      
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = `Campaign Name,Send Date,Sent,Delivered,Opened,Clicked,Bounced,Status
Summer Sale Newsletter,2024-01-15,15000,14500,4500,675,500,Completed
Product Launch,2024-01-10,8200,8000,2460,410,200,Completed
Weekly Newsletter,2024-01-08,12000,11800,3600,540,200,Completed`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sfmc_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Import Your Email Campaign Data</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('csv')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'csv' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload size={16} className="inline mr-2" />
              CSV Upload
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'manual' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Plus size={16} className="inline mr-2" />
              Manual Entry
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {activeTab === 'csv' && (
            <div className="space-y-6">
              {/* Status Messages */}
              {uploadStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span className="text-green-800">{successMessage}</span>
                </div>
              )}
              
              {uploadStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                  <AlertCircle className="text-red-500 mr-3" size={20} />
                  <span className="text-red-800">{errorMessage}</span>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">How to export from SFMC:</h3>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Go to Email Studio → Reports → Email Performance</li>
                  <li>2. Select your date range and campaigns</li>
                  <li>3. Click "Export" and choose CSV format</li>
                  <li>4. Upload the file below</li>
                </ol>
                <button 
                  onClick={downloadSampleCSV}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <Download size={14} className="mr-1" />
                  Download Sample CSV Format
                </button>
              </div>

              {/* Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
                } ${uploadStatus === 'uploading' ? 'opacity-50' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {uploadStatus === 'uploading' ? 'Processing...' : 'Drop your CSV file here'}
                </p>
                <p className="text-gray-500 mb-4">or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadStatus === 'uploading'}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </div>
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Manual Campaign Entry</h3>
                <p className="text-sm text-yellow-700">Enter your email campaign data manually. At minimum, provide campaign name and sent count.</p>
              </div>

              <div className="space-y-4">
                {manualCampaigns.map((campaign, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Campaign #{index + 1}</h4>
                      {manualCampaigns.length > 1 && (
                        <button
                          onClick={() => removeManualCampaign(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Campaign Name *
                        </label>
                        <input
                          type="text"
                          value={campaign.name}
                          onChange={(e) => updateManualCampaign(index, 'name', e.target.value)}
                          className="w-full border rounded-lg px-3 py-2"
                          placeholder="e.g., Summer Sale Newsletter"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sent *
                        </label>
                        <input
                          type="number"
                          value={campaign.sent}
                          onChange={(e) => updateManualCampaign(index, 'sent', e.target.value)}
                          className="w-full border rounded-lg px-3 py-2"
                          placeholder="15000"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={campaign.date}
                          onChange={(e) => updateManualCampaign(index, 'date', e.target.value)}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Opens
                        </label>
                        <input
                          type="number"
                          value={campaign.opened}
                          onChange={(e) => updateManualCampaign(index, 'opened', e.target.value)}
                          className="w-full border rounded-lg px-3 py-2"
                          placeholder="4500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Clicks
                        </label>
                        <input
                          type="number"
                          value={campaign.clicked}
                          onChange={(e) => updateManualCampaign(index, 'clicked', e.target.value)}
                          className="w-full border rounded-lg px-3 py-2"
                          placeholder="675"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bounces
                        </label>
                        <input
                          type="number"
                          value={campaign.bounced}
                          onChange={(e) => updateManualCampaign(index, 'bounced', e.target.value)}
                          className="w-full border rounded-lg px-3 py-2"
                          placeholder="500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                  <AlertCircle className="text-red-500 mr-3" size={20} />
                  <span className="text-red-800">{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span className="text-green-800">{successMessage}</span>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={addManualCampaign}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus size={16} className="mr-2" />
                  Add Campaign
                </button>
                
                <button
                  onClick={submitManualData}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Import Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataUpload;