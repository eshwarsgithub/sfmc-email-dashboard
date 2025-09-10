// Debug panel component to show SFMC API debug information
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, Terminal, X } from 'lucide-react';

interface DebugPanelProps {
  onClose: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ onClose }) => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const fetchDebugInfo = async () => {
    setIsLoading(true);
    setLogs(['🔄 Starting debug information fetch...']);
    
    try {
      // Test the API endpoint directly
      const apiUrl = import.meta.env.PROD 
        ? '/api/dashboard' 
        : 'http://localhost:3001/api/dashboard';
      
      setLogs(prev => [...prev, `📡 Testing API endpoint: ${apiUrl}`]);
      
      const response = await fetch(apiUrl + '?period=7', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setLogs(prev => [...prev, `📊 Response status: ${response.status} ${response.statusText}`]);
      setLogs(prev => [...prev, `📊 Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`]);

      const data = await response.json();
      setDebugInfo(data);
      
      if (data.debugInfo) {
        setLogs(prev => [...prev, `✅ Debug info received: ${JSON.stringify(data.debugInfo, null, 2)}`]);
      }
      
      if (data.error) {
        setLogs(prev => [...prev, `❌ API Error: ${data.error}`]);
      }
      
      setLogs(prev => [...prev, `🎯 Connection status: ${data.connectionStatus || 'Unknown'}`]);
      setLogs(prev => [...prev, `🔗 SFMC connected: ${data.sfmcConnected ? 'YES' : 'NO'}`]);
      setLogs(prev => [...prev, `📈 Real data: ${data.isRealData ? 'YES' : 'NO'}`]);
      setLogs(prev => [...prev, `📧 Campaigns found: ${data.campaigns?.length || 0}`]);

    } catch (error) {
      setLogs(prev => [...prev, `❌ Fetch error: ${(error as Error).message}`]);
      setDebugInfo({ error: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectConnection = async () => {
    setLogs(prev => [...prev, '🧪 Testing direct SFMC connection...']);
    
    // Test environment variables
    const envVars = {
      clientId: import.meta.env.VITE_SFMC_CLIENT_ID,
      subdomain: import.meta.env.VITE_SFMC_SUBDOMAIN,
      hasSecret: !!import.meta.env.VITE_SFMC_CLIENT_SECRET
    };
    
    setLogs(prev => [...prev, `🔧 Environment variables: ${JSON.stringify(envVars, null, 2)}`]);
    
    if (!envVars.clientId || !envVars.subdomain || !envVars.hasSecret) {
      setLogs(prev => [...prev, '❌ Missing required environment variables']);
      return;
    }
    
    try {
      // Test authentication directly
      const authUrl = `https://${envVars.subdomain}.auth.marketingcloudapis.com/v2/token`;
      setLogs(prev => [...prev, `🔐 Testing auth URL: ${authUrl}`]);
      
      const authResponse = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: envVars.clientId,
          client_secret: import.meta.env.VITE_SFMC_CLIENT_SECRET
        })
      });
      
      setLogs(prev => [...prev, `🔐 Auth response: ${authResponse.status} ${authResponse.statusText}`]);
      
      if (authResponse.ok) {
        const authData = await authResponse.json();
        setLogs(prev => [...prev, '✅ Direct authentication SUCCESS!']);
        setLogs(prev => [...prev, `🎫 Token expires in: ${authData.expires_in} seconds`]);
        setLogs(prev => [...prev, `🌐 REST instance: ${authData.rest_instance_url}`]);
        setLogs(prev => [...prev, `📧 Scopes: ${authData.scope}`]);
      } else {
        const errorData = await authResponse.text();
        setLogs(prev => [...prev, `❌ Direct authentication FAILED: ${errorData}`]);
      }
      
    } catch (error) {
      setLogs(prev => [...prev, `❌ Direct connection error: ${(error as Error).message}`]);
    }
  };

  useEffect(() => {
    fetchDebugInfo();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <Terminal className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">SFMC API Debug Panel</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {/* Control Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={fetchDebugInfo}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              {isLoading ? 'Testing...' : 'Test API Endpoint'}
            </button>
            
            <button
              onClick={testDirectConnection}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <CheckCircle size={16} />
              Test Direct Connection
            </button>
            
            <button
              onClick={() => setLogs([])}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Clear Logs
            </button>
          </div>

          {/* Debug Information */}
          {debugInfo && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Connection Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  {debugInfo.sfmcConnected ? (
                    <CheckCircle className="text-green-500" size={18} />
                  ) : (
                    <AlertCircle className="text-red-500" size={18} />
                  )}
                  Connection Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">SFMC Connected:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      debugInfo.sfmcConnected 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                    }`}>
                      {debugInfo.sfmcConnected ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Real Data:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      debugInfo.isRealData 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {debugInfo.isRealData ? 'YES' : 'DEMO'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className="ml-2 text-gray-600">{debugInfo.connectionStatus}</span>
                  </div>
                  {debugInfo.error && (
                    <div>
                      <span className="font-medium text-red-600">Error:</span>
                      <span className="ml-2 text-red-600">{debugInfo.error}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Data Summary</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Campaigns:</span>
                    <span className="ml-2">{debugInfo.campaigns?.length || 0}</span>
                  </div>
                  <div>
                    <span className="font-medium">Total Sent:</span>
                    <span className="ml-2">{debugInfo.overview?.totalSent?.toLocaleString() || 0}</span>
                  </div>
                  <div>
                    <span className="font-medium">Total Opened:</span>
                    <span className="ml-2">{debugInfo.overview?.opened?.toLocaleString() || 0}</span>
                  </div>
                  <div>
                    <span className="font-medium">Total Clicked:</span>
                    <span className="ml-2">{debugInfo.overview?.clicked?.toLocaleString() || 0}</span>
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>
                    <span className="ml-2">{debugInfo.lastUpdated ? new Date(debugInfo.lastUpdated).toLocaleString() : 'Never'}</span>
                  </div>
                </div>
              </div>

              {/* Debug Info */}
              {debugInfo.debugInfo && (
                <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Technical Debug Information</h3>
                  <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-auto max-h-40">
                    {JSON.stringify(debugInfo.debugInfo, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Live Logs */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Terminal size={18} />
              Live Debug Logs
            </h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-80 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500">No logs yet. Click "Test API Endpoint" to start debugging.</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Environment Variables Check */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-3">Environment Variables Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Client ID:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  import.meta.env.VITE_SFMC_CLIENT_ID 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
                }`}>
                  {import.meta.env.VITE_SFMC_CLIENT_ID ? 'SET' : 'MISSING'}
                </span>
              </div>
              <div>
                <span className="font-medium">Client Secret:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  import.meta.env.VITE_SFMC_CLIENT_SECRET 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
                }`}>
                  {import.meta.env.VITE_SFMC_CLIENT_SECRET ? 'SET' : 'MISSING'}
                </span>
              </div>
              <div>
                <span className="font-medium">Subdomain:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  import.meta.env.VITE_SFMC_SUBDOMAIN 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
                }`}>
                  {import.meta.env.VITE_SFMC_SUBDOMAIN || 'MISSING'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;