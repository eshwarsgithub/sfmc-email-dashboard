// src/services/dynamicDataService.ts
export interface DynamicStats {
  totalRaised: number;
  totalGoal: number;
  familiesHelped: number;
  totalFamiliesAffected: number;
  donorsCount: number;
  districtsActive: number;
  lastUpdateTime: Date;
}

export interface LiveUpdate {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  location?: string;
  type: 'relief' | 'rescue' | 'medical' | 'supplies';
}

export interface DonationActivity {
  id: string;
  amount: number;
  donorName: string;
  location: string;
  timestamp: Date;
  message?: string;
}

class DynamicDataService {
  private stats: DynamicStats = {
    totalRaised: 2300000,
    totalGoal: 5000000,
    familiesHelped: 8500,
    totalFamiliesAffected: 15000,
    donorsCount: 5247,
    districtsActive: 8,
    lastUpdateTime: new Date()
  };

  private liveUpdates: LiveUpdate[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      title: 'Emergency Relief Distributed',
      description: 'Distributed food packets and clean water to 500 families in Ludhiana district',
      location: 'Ludhiana',
      type: 'relief'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      title: 'Medical Team Deployed',
      description: 'Mobile medical unit with 5 doctors arrived in Patiala to treat flood victims',
      location: 'Patiala',
      type: 'medical'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      title: 'Water Pumping Operations',
      description: 'Successfully drained flood water from 3 villages, 200 families can return home',
      location: 'Mohali',
      type: 'rescue'
    }
  ];

  private recentDonations: DonationActivity[] = [
    {
      id: '1',
      amount: 250,
      donorName: 'Sarah M.',
      location: 'California, USA',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      message: 'Stay strong Punjab!'
    },
    {
      id: '2',
      amount: 100,
      donorName: 'Michael C.',
      location: 'New York, USA',
      timestamp: new Date(Date.now() - 32 * 60 * 1000)
    },
    {
      id: '3',
      amount: 500,
      donorName: 'Anonymous',
      location: 'Texas, USA',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      message: 'Prayers for all affected families'
    }
  ];

  // Simulate real-time updates
  private updateStatsInterval?: number;

  constructor() {
    this.startRealTimeUpdates();
  }

  private startRealTimeUpdates() {
    this.updateStatsInterval = setInterval(() => {
      // Simulate small increases in donations and donor count
      const donationIncrease = Math.floor(Math.random() * 500) + 50; // $50-$550
      const newDonors = Math.floor(Math.random() * 3) + 1; // 1-3 new donors
      
      this.stats.totalRaised += donationIncrease;
      this.stats.donorsCount += newDonors;
      this.stats.familiesHelped += Math.floor(Math.random() * 5); // 0-5 families helped
      this.stats.lastUpdateTime = new Date();

      // Occasionally add new live updates
      if (Math.random() < 0.3) { // 30% chance
        this.addRandomLiveUpdate();
      }

      // Add recent donation activity
      if (Math.random() < 0.4) { // 40% chance
        this.addRandomDonation();
      }
    }, 30000); // Update every 30 seconds
  }

  private addRandomLiveUpdate() {
    const locations = ['Ludhiana', 'Patiala', 'Mohali', 'Jalandhar', 'Amritsar', 'Bathinda'];
    const updateTypes = [
      {
        type: 'relief' as const,
        titles: ['Food Distribution Complete', 'Relief Supplies Delivered', 'Emergency Kits Distributed'],
        descriptions: [
          'Successfully distributed relief supplies to affected families',
          'Emergency food packets reached vulnerable communities',
          'Clean water and basic necessities provided to flood victims'
        ]
      },
      {
        type: 'medical' as const,
        titles: ['Medical Aid Provided', 'Health Camp Organized', 'Emergency Treatment'],
        descriptions: [
          'Medical team provided health checkups and treatment',
          'Mobile health clinic served flood-affected areas',
          'Emergency medical assistance provided to injured victims'
        ]
      },
      {
        type: 'rescue' as const,
        titles: ['Rescue Operation Success', 'Evacuation Complete', 'Area Cleared'],
        descriptions: [
          'Successful evacuation of families from flooded areas',
          'Rescue teams cleared debris and restored access',
          'Safe evacuation completed with all families relocated'
        ]
      }
    ];

    const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
    const randomTitle = randomType.titles[Math.floor(Math.random() * randomType.titles.length)];
    const randomDescription = randomType.descriptions[Math.floor(Math.random() * randomType.descriptions.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];

    const newUpdate: LiveUpdate = {
      id: Date.now().toString(),
      timestamp: new Date(),
      title: randomTitle,
      description: randomDescription,
      location: randomLocation,
      type: randomType.type
    };

    this.liveUpdates.unshift(newUpdate);
    // Keep only the latest 10 updates
    this.liveUpdates = this.liveUpdates.slice(0, 10);
  }

  private addRandomDonation() {
    const firstNames = ['Sarah', 'Michael', 'Emma', 'David', 'Jennifer', 'Robert', 'Lisa', 'John', 'Maria', 'James'];
    const lastInitials = ['M', 'C', 'S', 'J', 'R', 'T', 'L', 'W', 'H', 'B'];
    const locations = [
      'California, USA', 'New York, USA', 'Texas, USA', 'Florida, USA',
      'Illinois, USA', 'Pennsylvania, USA', 'Ohio, USA', 'Georgia, USA',
      'North Carolina, USA', 'Michigan, USA', 'Washington, USA', 'Arizona, USA'
    ];
    const messages = [
      'Stay strong Punjab!',
      'Prayers for all affected families',
      'Hope this helps',
      'Together we can make a difference',
      'Sending love from USA',
      'Every little bit helps'
    ];

    const amounts = [25, 50, 75, 100, 150, 200, 250, 300, 500, 1000];
    const isAnonymous = Math.random() < 0.3; // 30% chance of anonymous

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastInitial = lastInitials[Math.floor(Math.random() * lastInitials.length)];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];

    const newDonation: DonationActivity = {
      id: Date.now().toString(),
      amount,
      donorName: isAnonymous ? 'Anonymous' : `${firstName} ${lastInitial}.`,
      location,
      timestamp: new Date(),
      message: Math.random() < 0.4 ? messages[Math.floor(Math.random() * messages.length)] : undefined
    };

    this.recentDonations.unshift(newDonation);
    // Keep only the latest 20 donations
    this.recentDonations = this.recentDonations.slice(0, 20);
  }

  // Public methods
  getStats(): DynamicStats {
    return { ...this.stats };
  }

  getLiveUpdates(): LiveUpdate[] {
    return [...this.liveUpdates];
  }

  getRecentDonations(): DonationActivity[] {
    return [...this.recentDonations];
  }

  // Subscribe to real-time updates
  onStatsUpdate(callback: (stats: DynamicStats) => void): () => void {
    const interval = setInterval(() => {
      callback(this.getStats());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }

  onLiveUpdatesChange(callback: (updates: LiveUpdate[]) => void): () => void {
    const interval = setInterval(() => {
      callback(this.getLiveUpdates());
    }, 10000); // Check for updates every 10 seconds

    return () => clearInterval(interval);
  }

  onRecentDonationsChange(callback: (donations: DonationActivity[]) => void): () => void {
    const interval = setInterval(() => {
      callback(this.getRecentDonations());
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }

  // Simulate adding a new donation (called when user donates)
  addDonation(amount: number, donorInfo: { firstName: string; lastName: string }) {
    this.stats.totalRaised += amount;
    this.stats.donorsCount += 1;
    this.stats.lastUpdateTime = new Date();

    const newDonation: DonationActivity = {
      id: Date.now().toString(),
      amount,
      donorName: `${donorInfo.firstName} ${donorInfo.lastName.charAt(0)}.`,
      location: 'USA', // Since we're targeting US donors
      timestamp: new Date(),
      message: 'Thank you for your generosity!'
    };

    this.recentDonations.unshift(newDonation);
    this.recentDonations = this.recentDonations.slice(0, 20);
  }

  cleanup() {
    if (this.updateStatsInterval) {
      clearInterval(this.updateStatsInterval);
    }
  }
}

export default new DynamicDataService();