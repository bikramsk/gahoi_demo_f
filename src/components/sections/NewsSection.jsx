import React from 'react'

const NewsSection = () => {
  return (
    <div className="w-full md:w-1/2 p-4">
      <div className="bg-red-900 rounded-lg overflow-hidden">
        <div className="relative aspect-[16/10] w-full">
          <img 
            src="/images/news-banner.jpg" 
            alt="गहोई समाज इंडिया न्यूज़" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 text-yellow-400 space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">गहोई समाज इंडिया न्यूज़</h1>
            <h2 className="text-xl md:text-2xl">आपके अपने समाज का यूट्यूब चैनल</h2>
          </div>
          
          <ul className="space-y-2 text-white/90">
            <li>- गहोई समाज की हर ताज़ा खबर</li>
            <li>- सामाजिक मुद्दों पर चर्चा</li>
            <li>- सांस्कृतिक कार्यक्रमों की झलक</li>
            <li>- समाज की प्रगति की कहानियाँ</li>
          </ul>

          <div className="flex items-center justify-between pt-2">
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe
            </a>
            <img 
              src="/images/qr-code.png" 
              alt="QR Code" 
              className="w-24 h-24"
            />
          </div>

          <p className="text-white text-center border-t border-white/20 pt-4">
            समाज की जानकारी, अब आपके घर तक!
          </p>
        </div>
      </div>
    </div>
  )
}

export default NewsSection 