import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const Video = () => {
  const { t, i18n } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const languageFontClass = i18n.language === "hi" ? "font-hindi" : "font-english";

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideo]);

  const videos = [
    {
      id: "local-video-1",
      thumbnail: "/news/news-28-04-2025-08.webp",
      url: "/videos/video_2025-04-28.mp4",
      type: "local",
      title: "गहोई समुदाय के अग्रणी उद्यमियों की पहल"
    },
    {
      id: "d-e0ic5p658",
      thumbnail: `https://img.youtube.com/vi/d-e0ic5p658/hqdefault.jpg`,
      url: "https://youtu.be/d-e0ic5p658",
      type: "youtube"
    },
    {
      id: "gnJ6DxR2TuA",
      thumbnail: `https://img.youtube.com/vi/gnJ6DxR2TuA/hqdefault.jpg`,
      url: "https://youtu.be/gnJ6DxR2TuA",
      type: "youtube"
    },
    {
      id: "9GAF3Uj5BdY",
      thumbnail: `https://img.youtube.com/vi/9GAF3Uj5BdY/hqdefault.jpg`,
      url: "https://youtu.be/9GAF3Uj5BdY",
      type: "youtube"
    },
    {
      id: "K3edRRYRhtI",
      thumbnail: `https://img.youtube.com/vi/K3edRRYRhtI/hqdefault.jpg`,
      url: "https://youtu.be/K3edRRYRhtI",
      type: "youtube"
    },
    {
      id: "HTRAylDOagI",
      thumbnail: `https://img.youtube.com/vi/HTRAylDOagI/hqdefault.jpg`,
      url: "https://youtu.be/HTRAylDOagI",
      type: "youtube"
    },
    {
      id: "MagfvlEf2KI",
      thumbnail: `https://img.youtube.com/vi/MagfvlEf2KI/hqdefault.jpg`,
      url: "https://youtu.be/MagfvlEf2KI",
      type: "youtube"
    },
    {
      id: "1h343roqIvU",
      thumbnail: `https://img.youtube.com/vi/1h343roqIvU/hqdefault.jpg`,
      url: "https://youtu.be/1h343roqIvU",
      type: "youtube"
    },
    {
      id: "J4yCyLCgwd0",
      thumbnail: `https://img.youtube.com/vi/J4yCyLCgwd0/hqdefault.jpg`,
      url: "https://youtu.be/J4yCyLCgwd0",
      type: "youtube"
    },
    {
      id: "Zp884vfPTTA",
      thumbnail: `https://img.youtube.com/vi/Zp884vfPTTA/hqdefault.jpg`,
      url: "https://youtu.be/Zp884vfPTTA",
      type: "youtube"
    },
    {
      id: "F8iMz5U1ACs",
      thumbnail: `https://img.youtube.com/vi/F8iMz5U1ACs/hqdefault.jpg`,
      url: "https://youtu.be/F8iMz5U1ACs",
      type: "youtube"
    },
  
  ];

  const handleVideoClick = (video) => {
    if (video.type === "local") {
      setSelectedVideo(video);
    }
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-red-50/30 to-gray-50">
      <Helmet>
        <title>{t('videoPage.meta.title')}</title>
        <meta
          name="description"
          content={t('videoPage.meta.description')}
        />
      </Helmet>

      {/* Video Modal Overlay */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 py-8"
          onClick={closeVideoModal}
        >
          <div 
            className="relative w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute -top-8 right-0 text-white hover:text-red-500 transition-colors z-10"
            >
              <div className="bg-black/70 rounded-full p-2 hover:bg-black/90">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </div>
            </button>
            <video
              className="w-full rounded-lg shadow-2xl"
              controls
              autoPlay
            >
              <source src={selectedVideo.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative w-full bg-red-800 pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/30 to-red-900/70"></div>
        <img
          src="/videopage-hero.webp"
          alt={t('videoPage.hero.backgroundAlt')}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full w-20 h-20 mx-auto mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 ${languageFontClass}`}>
              {t('videoPage.hero.title')}
            </h1>
            <p className={`text-xl md:text-2xl text-white font-medium max-w-3xl mx-auto ${languageFontClass}`}>
              {t('videoPage.hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Videos Grid Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {video.type === "youtube" ? (
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative aspect-video bg-gray-900 rounded-xl"
                    >
                      <img
                        src={video.thumbnail}
                        alt={`Video ${index + 1} thumbnail`}
                        className="w-full h-full object-cover rounded-xl group-hover:opacity-80 transition-opacity duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-600/90 text-white transform scale-90 group-hover:scale-100 transition-transform duration-300">
                          <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div 
                      className="block relative aspect-video bg-gray-900 rounded-xl cursor-pointer"
                      onClick={() => handleVideoClick(video)}
                    >
                      <img
                        src={video.thumbnail}
                        alt={`Video ${index + 1} thumbnail`}
                        className="w-full h-full object-cover rounded-xl group-hover:opacity-80 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-600/90 text-white transform scale-90 group-hover:scale-100 transition-transform duration-300">
                          <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Video Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                    <h3 className="text-white font-medium text-lg mb-1">
                      {video.title || `गहोई वैश्य महासभा वीडियो ${index + 1}`}
                    </h3>
                    <p className="text-gray-200 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                      {video.type === "youtube" ? "Watch on YouTube" : "Watch Video"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video; 