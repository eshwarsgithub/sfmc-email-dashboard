// src/App.tsx
import React, { useState } from 'react';
import { 
  Heart, 
  Users, 
  Shield, 
  DollarSign, 
  MapPin, 
  Calendar,
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  AlertCircle
} from 'lucide-react';
import paymentService from './services/paymentService';
import './App.css';

interface DonationAmountProps {
  amount: number;
  selected: boolean;
  onClick: (amount: number) => void;
}

const DonationAmount: React.FC<DonationAmountProps> = ({ amount, selected, onClick }) => {
  return (
    <button
      onClick={() => onClick(amount)}
      className={`donation-amount ${selected ? 'selected' : ''}`}
    >
      ${amount}
    </button>
  );
};

interface ImpactCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  amount: string;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ icon: Icon, title, description, amount }) => {
  return (
    <div className="impact-card">
      <div className="impact-icon">
        <Icon size={32} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="impact-amount">{amount}</div>
    </div>
  );
};

interface TestimonialProps {
  name: string;
  message: string;
  location: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ name, message, location }) => {
  return (
    <div className="testimonial">
      <div className="testimonial-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={16} fill="#fbbf24" color="#fbbf24" />
        ))}
      </div>
      <p className="testimonial-message">"{message}"</p>
      <div className="testimonial-author">
        <strong>{name}</strong>
        <span>{location}</span>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [donationAmount, setDonationAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorInfo, setDonorInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];
  
  const impactData = [
    {
      icon: Users,
      title: "Emergency Relief",
      description: "Provides emergency food and water for a family for one week",
      amount: "$50"
    },
    {
      icon: Shield,
      title: "Medical Aid",
      description: "Covers basic medical supplies and first aid for flood victims",
      amount: "$100"
    },
    {
      icon: Heart,
      title: "Temporary Shelter",
      description: "Helps provide temporary housing materials for displaced families",
      amount: "$250"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      message: "Knowing my donation directly helps flood victims in Punjab gives me hope. This organization is transparent and effective.",
      location: "California, USA"
    },
    {
      name: "Michael Chen",
      message: "I've donated multiple times. They provide regular updates on how the funds are being used. Highly recommend!",
      location: "New York, USA"
    },
    {
      name: "Emily Rodriguez",
      message: "The impact reports they send show exactly how my contributions are making a difference. Very trustworthy.",
      location: "Texas, USA"
    }
  ];

  const handleDonationAmountSelect = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount('');
    setPaymentError(null);
  };

  const handleCustomAmountChange = (value: string) => {
    const numericValue = parseInt(value);
    if (!isNaN(numericValue) && numericValue > 0) {
      setDonationAmount(numericValue);
      setCustomAmount(value);
      setPaymentError(null);
    } else {
      setCustomAmount(value);
    }
  };

  const handleDonorInfoChange = (field: string, value: string) => {
    setDonorInfo(prev => ({
      ...prev,
      [field]: value
    }));
    setPaymentError(null);
  };

  const handleDonateNow = async () => {
    if (!isValidForm()) {
      setPaymentError('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const donationData = {
        amount: donationAmount,
        currency: 'usd',
        donorInfo
      };

      const result = await paymentService.processDirectPayment(donationData);
      
      if (result.success) {
        setShowThankYou(true);
      } else {
        setPaymentError(result.error || 'Payment processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isValidForm = () => {
    return donationAmount > 0 && 
           donorInfo.firstName.trim() && 
           donorInfo.lastName.trim() && 
           donorInfo.email.trim() && 
           donorInfo.phone.trim();
  };

  if (showThankYou) {
    return (
      <div className="thank-you-container">
        <div className="thank-you-content">
          <CheckCircle size={64} className="thank-you-icon" />
          <h1>Thank You for Your Generosity!</h1>
          <p>Your donation of <strong>${donationAmount}</strong> will make a real difference in the lives of Punjab flood victims.</p>
          <p>You will receive an email confirmation shortly with your donation receipt.</p>
          <button 
            onClick={() => {
              setShowThankYou(false);
              setDonationAmount(50);
              setCustomAmount('');
              setDonorInfo({ firstName: '', lastName: '', email: '', phone: '' });
              setPaymentError(null);
            }}
            className="btn-primary"
          >
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-website">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <h1>Punjab Floods 2025 Relief Fund</h1>
              <p className="hero-subtitle">
                "In times of crisis, humanity shines brightest. Your donation today becomes hope tomorrow."
              </p>
              <p className="hero-description">
                Devastating floods have displaced thousands of families across Punjab. 
                Your support provides immediate relief, clean water, food, and temporary shelter to those in desperate need.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">15,000+</span>
                  <span className="stat-label">Families Affected</span>
                </div>
                <div className="stat">
                  <span className="stat-number">$2.3M</span>
                  <span className="stat-label">Raised So Far</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5,000+</span>
                  <span className="stat-label">Donors Worldwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="donation-section">
        <div className="container">
          <div className="donation-grid">
            <div className="donation-form">
              <h2>Make a Difference Today</h2>
              <p>Every dollar counts. Choose your impact:</p>
              
              {paymentError && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{paymentError}</span>
                </div>
              )}
              
              <div className="amount-selection">
                <h3>Select Amount (USD)</h3>
                <div className="amount-grid">
                  {predefinedAmounts.map(amount => (
                    <DonationAmount
                      key={amount}
                      amount={amount}
                      selected={donationAmount === amount && !customAmount}
                      onClick={handleDonationAmountSelect}
                    />
                  ))}
                </div>
                <div className="custom-amount">
                  <label>Other Amount:</label>
                  <div className="input-group">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      min="1"
                    />
                  </div>
                </div>
              </div>

              <div className="donor-info">
                <h3>Your Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={donorInfo.firstName}
                      onChange={(e) => handleDonorInfoChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={donorInfo.lastName}
                      onChange={(e) => handleDonorInfoChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={donorInfo.email}
                      onChange={(e) => handleDonorInfoChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={donorInfo.phone}
                      onChange={(e) => handleDonorInfoChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="donation-summary">
                <div className="summary-row">
                  <span>Donation Amount:</span>
                  <span className="amount">${donationAmount}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span className="amount">${donationAmount}</span>
                </div>
                <p className="tax-info">This donation is tax-deductible. You will receive a receipt via email.</p>
              </div>

              <button
                onClick={handleDonateNow}
                disabled={!isValidForm() || isProcessing}
                className="donate-button"
              >
                {isProcessing ? (
                  <>Processing... Please Wait</>
                ) : (
                  <>
                    Donate ${donationAmount} Now
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <div className="security-badges">
                <Shield size={16} />
                <span>256-bit SSL encrypted • PCI DSS compliant</span>
              </div>
            </div>

            <div className="impact-info">
              <h3>Your Impact</h3>
              <div className="impact-cards">
                {impactData.map((impact, index) => (
                  <ImpactCard key={index} {...impact} />
                ))}
              </div>
              
              <div className="urgent-update">
                <Calendar size={20} />
                <div>
                  <h4>Latest Update</h4>
                  <p>September 15, 2025 - Our teams have distributed emergency supplies to 3,000 families in Ludhiana and Patiala districts. Clean water systems restored in 12 villages.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Information */}
      <section className="crisis-info">
        <div className="container">
          <div className="crisis-content">
            <div className="crisis-text">
              <h2>The Crisis</h2>
              <p>
                "When disaster strikes, it's not just homes that are lost—it's hope. But together, we can rebuild both."
              </p>
              <p>
                Unprecedented monsoon rains have caused severe flooding across Punjab, affecting over 15,000 families. 
                Villages are submerged, crops destroyed, and thousands have been forced to evacuate their homes. 
                The immediate needs are shelter, clean drinking water, food, and medical aid.
              </p>
              
              <div className="crisis-stats">
                <div className="crisis-stat">
                  <MapPin className="icon" />
                  <div>
                    <strong>8 Districts Affected</strong>
                    <span>Ludhiana, Patiala, Mohali, and 5 others</span>
                  </div>
                </div>
                <div className="crisis-stat">
                  <Users className="icon" />
                  <div>
                    <strong>60,000+ People Displaced</strong>
                    <span>Including 18,000 children</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="crisis-image">
              <div className="placeholder-image">
                <span>Punjab Floods 2025 - Emergency Relief Needed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2>What Our Donors Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="transparency-section">
        <div className="container">
          <h2>Complete Transparency</h2>
          <div className="transparency-grid">
            <div className="transparency-card">
              <div className="transparency-icon">
                <DollarSign size={32} />
              </div>
              <h3>100% of Donations Go to Relief</h3>
              <p>Administrative costs are covered separately. Every dollar you donate directly supports flood victims.</p>
            </div>
            <div className="transparency-card">
              <div className="transparency-icon">
                <CheckCircle size={32} />
              </div>
              <h3>Regular Impact Reports</h3>
              <p>Receive monthly updates with photos, stories, and detailed reports on how your contribution is making a difference.</p>
            </div>
            <div className="transparency-card">
              <div className="transparency-icon">
                <Shield size={32} />
              </div>
              <h3>Secure & Verified</h3>
              <p>Registered 501(c)(3) non-profit organization. All donations are tax-deductible and receipts provided.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Punjab Floods Relief</h3>
              <p>A non-profit organization dedicated to providing emergency relief and long-term support to flood victims in Punjab.</p>
              <div className="footer-quote">
                "Hope is the thing with feathers that perches in the soul." - Emily Dickinson
              </div>
            </div>
            <div className="footer-section">
              <h4>Contact Us</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <Phone size={16} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <Mail size={16} />
                  <span>help@punjabrelief.org</span>
                </div>
                <div className="contact-item">
                  <Globe size={16} />
                  <span>www.punjabrelief.org</span>
                </div>
              </div>
            </div>
            <div className="footer-section">
              <h4>Our Promise</h4>
              <p>We are committed to transparency, accountability, and ensuring every donation creates maximum impact for those in need.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Punjab Floods Relief Fund. All rights reserved. | Tax ID: 123-45-6789</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;