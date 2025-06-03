import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const nav = document.querySelector('nav');
    
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (nav) nav.style.display = 'none';
    
    document.body.classList.add('fullscreen-form');
    
    return () => {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
      if (nav) nav.style.display = '';
      document.body.classList.remove('fullscreen-form');
    };
  }, []);

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: 'url("/decorative-bg.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-orange-900/30"></div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-orange-500">404</h1>
          <div className="mt-4 text-xl font-semibold text-gray-800">
            {t('notFound.title')}
          </div>
          <p className="mt-2 text-gray-600">
            {t('notFound.description')}
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200 font-medium"
          >
            {t('notFound.goHome')}
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium block sm:inline-block mt-3 sm:mt-0 sm:ml-3"
          >
            {t('notFound.goBack')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 