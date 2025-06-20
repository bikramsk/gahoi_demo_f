import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Image, Maximize2, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_PUBLIC_STRAPI_API_URL;

const Gallery = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const verifiedMobile = localStorage.getItem('verifiedMobile');
    setIsAuthenticated(!!token && !!verifiedMobile);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/gallery-events?populate=*`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error?.message || `Server responded with status ${response.status}`);
        }

        const { data } = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }

        // transform data
        const transformedEvents = data.map(event => {
          return {
            id: event.id,
            documentId: event.documentId,
            name: event.Name,
            description: event.Description,
            date: event.Date,
            images: event.Images || [],
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            publishedAt: event.publishedAt
          };
        });

        setEvents(transformedEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching gallery events:', err);
        setError(err.message || 'Failed to load gallery events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: '/gallery' } });
  };

  const openLightbox = useCallback((event, imageIdx = 0) => {
    if (!isAuthenticated) {
      handleLoginRedirect();
      return;
    }
    setSelectedEvent(event);
    setSelectedImageIdx(imageIdx);
    document.body.style.overflow = 'hidden';
  }, [isAuthenticated, navigate]);

  const closeLightbox = useCallback(() => {
    setSelectedEvent(null);
    setSelectedImageIdx(0);
    document.body.style.overflow = 'unset';
  }, []);

  const navigateImage = useCallback((direction) => {
    if (!selectedEvent) return;
    
    const totalImages = selectedEvent.images.length;
    setSelectedImageIdx(prev => {
      if (direction === 'next') {
        return (prev + 1) % totalImages;
      } else {
        return (prev - 1 + totalImages) % totalImages;
      }
    });
  }, [selectedEvent]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedEvent) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case 'Escape':
          closeLightbox();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent, navigateImage, closeLightbox]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-rose-100">
      {/* Hero Section - Always visible */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-800 to-orange-800"></div>
        <div className="absolute inset-0 bg-[url('/gallery-bg.webp')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
        
        <div className="relative pt-32 pb-24 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-8 shadow-xl">
              <Image className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {t('gallery.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              {t('gallery.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Events Grid Section - Shows loading/error states */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading gallery events...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No gallery events available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="group bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  {!isAuthenticated ? (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 p-6">
                      <Lock className="w-8 h-8 text-white mb-3" />
                      <p className="text-white text-center mb-4">{t('gallery.loginRequired')}</p>
                      <button
                        onClick={handleLoginRedirect}
                        className="bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-full font-semibold hover:bg-white/30 transition-colors duration-200"
                      >
                        {t('gallery.loginToView')}
                      </button>
                    </div>
                  ) : null}
                  <img
                    src={event.images[0]?.url || '/placeholder-image.jpg'}
                    alt={event.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${!isAuthenticated ? 'brightness-100' : ''}`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => openLightbox(event)}
                      className="w-full bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-full font-semibold hover:bg-white/30 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      {isAuthenticated ? (
                        <>
                          <Maximize2 className="w-4 h-4" />
                          {t('gallery.viewGallery')}
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          {t('gallery.loginToView')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.date)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                    {event.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  <div className="flex items-center">
                    <span className="text-red-600 font-semibold text-sm flex items-center gap-1">
                      <Image className="w-4 h-4" />
                      {event.images.length} {t('gallery.photos')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedEvent && isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          ></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label={t('gallery.lightbox.close')}
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-2">{selectedEvent.name}</h2>
              <p className="text-white/90 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(selectedEvent.date)}
              </p>
            </div>

            {/* Image Display */}
            <div className="relative bg-gray-900">
              <img
                src={selectedEvent.images[selectedImageIdx].url}
                alt={selectedEvent.images[selectedImageIdx].alt}
                className="w-full h-96 md:h-[500px] object-contain"
              />
              
              {/* Navigation Arrows */}
              {selectedEvent.images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label={t('gallery.lightbox.previous')}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label={t('gallery.lightbox.next')}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">
                  {selectedEvent.images[selectedImageIdx].alt}
                </p>
                <span className="text-sm text-gray-500">
                  {t('gallery.lightbox.imageOf', {
                    current: selectedImageIdx + 1,
                    total: selectedEvent.images.length
                  })}
                </span>
              </div>
              
              {/* Thumbnail Navigation */}
              {selectedEvent.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedEvent.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        idx === selectedImageIdx
                          ? 'border-red-500 ring-2 ring-red-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;