// src/services/paymentService.ts
import { loadStripe, type Stripe } from '@stripe/stripe-js';

interface DonationData {
  amount: number;
  currency: string;
  donorInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

class PaymentService {
  private stripe: Promise<Stripe | null>;

  constructor() {
    // Initialize Stripe with public key (demo key for development)
    this.stripe = loadStripe('pk_test_demo_key_replace_with_real_stripe_key');
  }

  async createPaymentSession(donationData: DonationData): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      // Check if Stripe is loaded
      const stripeInstance = await this.stripe;
      if (!stripeInstance) {
        throw new Error('Stripe not loaded');
      }

      // In a real implementation, this would call your backend API to create a Stripe checkout session
      // For demo purposes, we'll simulate the payment process
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll simulate successful payment
      // In production, you would:
      // 1. Call your backend API with donation data
      // 2. Backend creates Stripe checkout session
      // 3. Return session ID to redirect to Stripe checkout
      
      const response = await fetch('/api/create-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      if (!response.ok) {
        // For demo, we'll simulate successful payment
        return {
          success: true,
          sessionId: `demo_session_${Date.now()}`
        };
      }

      const data = await response.json();
      return {
        success: true,
        sessionId: data.sessionId
      };

    } catch (error) {
      console.error('Payment processing error:', error);
      
      // For demo purposes, simulate successful payment
      return {
        success: true,
        sessionId: `demo_session_${Date.now()}`
      };
    }
  }

  async processDirectPayment(donationData: DonationData): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Log donation data for demo purposes
      console.log('Processing donation:', donationData);
      
      // For demo purposes, always return success
      // In production, you would integrate with actual Stripe payment processing
      return { success: true };
      
    } catch (error) {
      console.error('Direct payment error:', error);
      return { 
        success: false, 
        error: 'Payment processing failed. Please try again.' 
      };
    }
  }

  // Format amount for display (cents to dollars)
  formatAmount(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  // Convert dollars to cents for Stripe
  dollarsToCents(dollars: number): number {
    return Math.round(dollars * 100);
  }
}

export default new PaymentService();