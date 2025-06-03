import React from "react";
import { Helmet } from "react-helmet-async";

const Rite = () => {
  return (
    <div 
      className="min-h-screen py-2 sm:py-4 md:py-6 relative"
      style={{
        backgroundImage: 'url("/decorative-bg.jpg")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: '#991b1b',
      }}
    >
      <Helmet>
        <title>गोत्र-आंकने</title>
        <meta name="description" content="Learn about the sacred rites and ceremonies at Gahoi Temple Trust. Discover our religious practices, rituals, and spiritual traditions." />
        <meta name="keywords" content="Gahoi Temple Rites, Religious Ceremonies, Spiritual Practices, Temple Rituals, Religious Traditions" />
      </Helmet>

      <div className="absolute inset-0 bg-gradient-to-b from-red-900/80 to-red-800/80"></div>
      <div className="relative w-full max-w-6xl mx-auto bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border-2 border-red-200/50 mx-4 mt-28 sm:mt-20 md:mt-24">
        <div className="bg-white/90 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="relative p-6 text-center border-b border-red-200">
            <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-900 opacity-90"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
               
              </div>
              
              <div className="inline-block bg-red-800/50 backdrop-blur-sm px-6 py-3 rounded-full border border-yellow-500/30 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center gap-3">
                 
                  <p className="text-lg sm:text-xl font-medium text-yellow-100"> गोत्र-आंकने</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Rite; 