// src/components/InteractivePhotoGallery.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Heart, Share2, Eye } from 'lucide-react';

interface PhotoStory {
  id: string;
  image: string;
  title: string;
  story: string;
  location: string;
  date: string;
  impact: string;
  donationsNeeded: number;
}

const InteractivePhotoGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoStory | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Sample data - In production, these would be real Punjab flood images
  const photoStories: PhotoStory[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop',
      title: 'Families Evacuated from Ludhiana',
      story: 'Over 500 families were evacuated from their homes as floodwater reached dangerous levels. Many lost everything but are grateful to be alive.',
      location: 'Ludhiana District',
      date: 'September 10, 2025',
      impact: 'Emergency shelter needed for 500 families',
      donationsNeeded: 25000
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      title: 'Relief Supplies Distribution in Patiala',
      story: 'Volunteers distribute food packets and clean water to flood victims. Your donations make these relief operations possible.',
      location: 'Patiala District',
      date: 'September 12, 2025',
      impact: '1000 families received essential supplies',
      donationsNeeded: 15000
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1594736797933-d0401ba6fe65?w=800&h=600&fit=crop',
      title: 'Children in Temporary Shelter',
      story: 'These brave children are staying strong despite losing their homes. They need our support for education supplies and proper shelter.',
      location: 'Mohali District',
      date: 'September 11, 2025',
      impact: '200 children need educational support',
      donationsNeeded: 10000
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1573656167085-a1b99e5cd56c?w=800&h=600&fit=crop',
      title: 'Medical Team Treating Victims',
      story: 'Our medical volunteers work tirelessly to provide healthcare to flood victims. Many need urgent medical attention.',
      location: 'Jalandhar District', 
      date: 'September 13, 2025',
      impact: 'Medical care provided to 800+ people',
      donationsNeeded: 20000
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1576924228313-2b4e2ce6edb0?w=800&h=600&fit=crop',
      title: 'Community Kitchen Serving Meals',
      story: 'Free community kitchens serve hot meals to displaced families. Every donation helps us feed more people in need.',
      location: 'Bathinda District',
      date: 'September 14, 2025',
      impact: '2000 meals served daily',
      donationsNeeded: 8000
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying || selectedPhoto) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photoStories.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, selectedPhoto, photoStories.length]);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photoStories.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photoStories.length) % photoStories.length);
  };

  const openModal = (photo: PhotoStory) => {
    setSelectedPhoto(photo);
    setIsAutoPlaying(false);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setIsAutoPlaying(true);
  };

  const sharePhoto = (photo: PhotoStory) => {
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: `Help Punjab flood victims: ${photo.story}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(`${photo.title}: ${window.location.href}`);
      alert('Link copied to clipboard!');
    }
  };

  const currentPhoto = photoStories[currentIndex];

  return (
    <div className="interactive-photo-gallery">
      <div className="gallery-header">
        <h2>Stories from the Ground</h2>
        <p>Real stories from Punjab floods 2025 - See how your donation helps</p>
      </div>

      {/* Main Gallery Display */}
      <div className="main-gallery">
        <div className="photo-container">
          <button className="nav-button prev" onClick={prevPhoto}>
            <ChevronLeft size={24} />
          </button>
          
          <div className="photo-main">
            <img 
              src={currentPhoto.image} 
              alt={currentPhoto.title}
              className="main-photo"
            />
            <div className="photo-overlay">
              <div className="overlay-content">
                <h3>{currentPhoto.title}</h3>
                <p className="photo-location">📍 {currentPhoto.location}</p>
                <p className="photo-date">📅 {currentPhoto.date}</p>
                <button 
                  className="view-story-btn"
                  onClick={() => openModal(currentPhoto)}
                >
                  <Eye size={16} />
                  View Full Story
                </button>
              </div>
            </div>
          </div>

          <button className="nav-button next" onClick={nextPhoto}>
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="thumbnail-nav">
          {photoStories.map((photo, index) => (
            <button
              key={photo.id}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              <img src={photo.image} alt={photo.title} />
            </button>
          ))}
        </div>

        {/* Auto-play toggle */}
        <div className="gallery-controls">
          <button
            className={`autoplay-toggle ${isAutoPlaying ? 'active' : ''}`}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          >
            {isAutoPlaying ? '⏸️ Pause' : '▶️ Play'} Slideshow
          </button>
          <div className="progress-dots">
            {photoStories.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Full Story */}
      {selectedPhoto && (
        <div className="photo-modal">
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              <X size={24} />
            </button>
            
            <div className="modal-photo">
              <img src={selectedPhoto.image} alt={selectedPhoto.title} />
            </div>
            
            <div className="modal-story">
              <h3>{selectedPhoto.title}</h3>
              <div className="story-meta">
                <span>📍 {selectedPhoto.location}</span>
                <span>📅 {selectedPhoto.date}</span>
              </div>
              
              <p className="story-text">{selectedPhoto.story}</p>
              
              <div className="story-impact">
                <h4>Impact</h4>
                <p>✅ {selectedPhoto.impact}</p>
                <p>💰 ${selectedPhoto.donationsNeeded.toLocaleString()} needed for continued support</p>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="btn-donate-story"
                  onClick={() => {
                    closeModal();
                    document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Heart size={16} />
                  Donate Now
                </button>
                <button 
                  className="btn-share-story"
                  onClick={() => sharePhoto(selectedPhoto)}
                >
                  <Share2 size={16} />
                  Share Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractivePhotoGallery;