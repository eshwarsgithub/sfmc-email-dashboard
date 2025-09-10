// Vercel serverless function for CSV data upload
import { parse } from 'csv-parse/sync';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { csvData, dataType } = req.body;
    
    if (!csvData) {
      return res.status(400).json({ error: 'No CSV data provided' });
    }

    // Parse CSV data
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`📊 Processing ${records.length} records of type: ${dataType}`);

    // Process different types of SFMC data
    let processedData;
    switch (dataType) {
      case 'campaigns':
        processedData = processCampaignData(records);
        break;
      case 'tracking':
        processedData = processTrackingData(records);
        break;
      case 'sends':
        processedData = processSendData(records);
        break;
      default:
        processedData = autoDetectAndProcess(records);
    }

    return res.json({
      success: true,
      message: `Successfully processed ${records.length} records`,
      data: processedData,
      recordCount: records.length
    });

  } catch (error) {
    console.error('❌ Error processing CSV upload:', error.message);
    return res.status(400).json({
      error: 'Failed to process CSV data',
      details: error.message
    });
  }
}

// Process campaign data from SFMC exports
function processCampaignData(records) {
  return records.map((record, index) => {
    // Common SFMC campaign export fields
    const campaignName = record['Campaign Name'] || record['Email Name'] || record['Subject'] || `Campaign ${index + 1}`;
    const sendDate = record['Send Date'] || record['Date Sent'] || new Date().toISOString();
    const sent = parseInt(record['Sent'] || record['Total Sent'] || record['Recipients'] || 0);
    const delivered = parseInt(record['Delivered'] || record['Total Delivered'] || sent);
    const opened = parseInt(record['Opened'] || record['Total Opens'] || record['Unique Opens'] || 0);
    const clicked = parseInt(record['Clicked'] || record['Total Clicks'] || record['Unique Clicks'] || 0);
    const bounced = parseInt(record['Bounced'] || record['Total Bounces'] || 0);

    return {
      id: record['Job ID'] || record['Send ID'] || `upload_${index + 1}`,
      name: campaignName,
      date: sendDate,
      status: record['Status'] || 'Completed',
      sent: sent,
      opened: opened,
      clicked: clicked,
      delivered: delivered,
      bounced: bounced
    };
  });
}

// Process tracking event data
function processTrackingData(records) {
  const aggregated = {
    totalSent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    trends: []
  };

  // Group by date if date field exists
  const dateGroups = {};
  
  records.forEach(record => {
    const date = record['Date'] || record['Event Date'] || new Date().toISOString().split('T')[0];
    const eventType = record['Event Type'] || record['Type'] || 'open';
    
    if (!dateGroups[date]) {
      dateGroups[date] = { opens: 0, clicks: 0 };
    }
    
    // Count events by type
    if (eventType.toLowerCase().includes('open')) {
      dateGroups[date].opens++;
      aggregated.opened++;
    } else if (eventType.toLowerCase().includes('click')) {
      dateGroups[date].clicks++;
      aggregated.clicked++;
    }
  });

  // Convert to trends array
  Object.entries(dateGroups).forEach(([date, counts]) => {
    aggregated.trends.push({
      date: date,
      opens: counts.opens,
      clicks: counts.clicks
    });
  });

  return aggregated;
}

// Process send/delivery data
function processSendData(records) {
  let totalSent = 0;
  let totalDelivered = 0;
  let totalBounced = 0;

  records.forEach(record => {
    totalSent += parseInt(record['Sent'] || record['Total Sent'] || 0);
    totalDelivered += parseInt(record['Delivered'] || record['Total Delivered'] || 0);
    totalBounced += parseInt(record['Bounced'] || record['Total Bounces'] || 0);
  });

  return {
    totalSent,
    delivered: totalDelivered,
    bounced: totalBounced
  };
}

// Auto-detect data type and process accordingly
function autoDetectAndProcess(records) {
  if (records.length === 0) {
    return { error: 'No data to process' };
  }

  const firstRecord = records[0];
  const fields = Object.keys(firstRecord).map(k => k.toLowerCase());
  
  // Detect if it's campaign data
  if (fields.some(f => f.includes('campaign') || f.includes('email') || f.includes('subject'))) {
    console.log('🎯 Auto-detected: Campaign data');
    return { campaigns: processCampaignData(records) };
  }
  
  // Detect if it's tracking data
  if (fields.some(f => f.includes('event') || f.includes('open') || f.includes('click'))) {
    console.log('🎯 Auto-detected: Tracking data');
    return { tracking: processTrackingData(records) };
  }
  
  // Default to campaign processing
  console.log('🎯 Auto-detected: Default campaign processing');
  return { campaigns: processCampaignData(records) };
}