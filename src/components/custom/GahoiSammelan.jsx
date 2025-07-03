import React, { useEffect } from 'react';
import { Calendar, MapPin, Phone, Heart, Users, Star, FileText, Camera, Upload, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GahoiSammelanPage = () => {
  const { t } = useTranslation();

  // Updated scroll to top effect
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    };

   
    scrollToTop();

    window.addEventListener('beforeunload', scrollToTop);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', scrollToTop);
    };
  }, []);

  const contacts = [
    { name: 'प्रदीप पहरिया', phone: '9803872220' },
    { name: 'सुधीर रावत', phone: '9826260742' },
    { name: 'भानु चपरा', phone: '8251980900' },
    { name: 'भाईजी सियाशरण कस्तवार', phone: '9826513272' },
    { name: 'नितेश सेठ', phone: '9560100097' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-800 to-orange-800"></div>
        <div className="absolute inset-0 bg-[url('/sammelan-bg.webp')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
        
        <div className="relative pt-16 pb-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-xl">
              <Heart className="w-8 h-8 text-white" />
              </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              {t('gahoiSammelan.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              {t('gahoiSammelan.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-8">
              {/* Event Details Header */}
              <div className="relative py-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 relative z-10 inline-block">
                  {t('gahoiSammelan.eventDetails.title')}
                </h2>
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-32 h-1 bg-red-800/20 rounded-full"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-16 h-1 bg-red-800/40 rounded-full"></div>
              </div>
            </div>

            {/* Event Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-red-800" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{t('gahoiSammelan.eventDetails.date')}</h3>
                      <p className="text-gray-600">{t('gahoiSammelan.eventDetails.dateValue')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6 text-red-800" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{t('gahoiSammelan.eventDetails.location')}</h3>
                      <p className="text-gray-600">{t('gahoiSammelan.eventDetails.locationValue')}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">{t('gahoiSammelan.eventDetails.registrationFee')}</h3>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-red-800">{t('gahoiSammelan.eventDetails.feeAmount')}</p>
                      <p className="text-sm text-gray-600">{t('gahoiSammelan.eventDetails.perRegistration')}</p>
                      <p className="text-sm text-gray-600">{t('gahoiSammelan.eventDetails.optionalFee')}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">{t('gahoiSammelan.eventDetails.lastDate')}</p>
                    <p className="text-lg font-semibold text-red-600">{t('gahoiSammelan.eventDetails.lastDateValue')}</p>
                  </div>
                </div>
              </div>
            
            {/* First Register Now Button */}
            <div className="mt-8 text-center">
              <a 
                href="/login"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white text-lg font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 duration-200"
              >
                <Heart className="w-5 h-5 mr-2" />
                {t('gahoiSammelan.buttons.registerNow')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              </div>
            </div>

            {/* Why This Event Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t('gahoiSammelan.whyEvent.title')}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    key: 'support',
                    icon: <Users className="w-6 h-6 text-red-800" />
                  },
                  {
                    key: 'match',
                    icon: <Heart className="w-6 h-6 text-red-800" />
                  },
                  {
                    key: 'break',
                    icon: <Star className="w-6 h-6 text-red-800" />
                  },
                  {
                    key: 'stability',
                    icon: <Check className="w-6 h-6 text-red-800" />
                  }
                ].map((item) => (
                  <div key={item.key} className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
                    <div className="flex items-center space-x-3 mb-3">
                      {item.icon}
                      <h3 className="font-semibold text-gray-800">{t(`gahoiSammelan.whyEvent.reasons.${item.key}.title`)}</h3>
                    </div>
                    <p className="text-gray-600">{t(`gahoiSammelan.whyEvent.reasons.${item.key}.desc`)}</p>
                  </div>
                ))}
              </div>

            {/* Second Register Now Button */}
            <div className="mt-12 text-center">
              <a 
                href="/login"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-orange-400 text-white text-lg font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
              >
                <Users className="w-5 h-5 mr-2" />
                {t('gahoiSammelan.buttons.joinEvent')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              </div>
            </div>

            {/* Souvenir Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-8 h-8 text-blue-500" />
                <h2 className="text-3xl font-bold text-gray-800">{t('gahoiSammelan.souvenir.title')}</h2>
              </div>
              <p className="text-gray-600 mb-6">{t('gahoiSammelan.souvenir.description')}</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="font-semibold text-gray-800 mb-2">{t('gahoiSammelan.souvenir.fullPage')}</h3>
                  <p className="text-2xl font-bold text-blue-600">₹5,000/-</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="font-semibold text-gray-800 mb-2">{t('gahoiSammelan.souvenir.halfPage')}</h3>
                  <p className="text-2xl font-bold text-blue-600">₹3,000/-</p>
                </div>
              </div>
            </div>

             {/* WhatsApp Group Section */}
             <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
               <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                 {/* Text Content - Left Side */}
                 <div className="flex-1 space-y-6">
                   <div className="space-y-4">
                     <h2 className="text-3xl font-bold text-red-600 border-b-2 border-red-200/20 pb-4">
                       अखिल भारतीय गहोई वैश्य परिचय सम्मेलन 2025
                     </h2>
                     <h3 className="text-2xl font-semibold text-red-800">
                       WhatsApp Group
                     </h3>
                   </div>
                   <div className="text-red-800 space-y-6">
                     <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg">
                       आइए जुड़े इस पावन पहल से!
                     </p>
                     <p className="text-lg leading-relaxed">
                       जो भी समाजबंधु इस संदेश को पढ़ रहे हैं, उनसे विनम्र अनुरोध है कि कृपया इस जानकारी को अपने परिचितों,
                       रिश्तेदारों एवं सोशल मीडिया के माध्यम से पुरे भारतवर्ष में सभी गहोई वैश्य तक पहुँचाने का कष्ट करें।
                     </p>
                   </div>
                 </div>

                 {/* QR Code - Right Side */}
                 <div className="md:w-72 flex-shrink-0">
                   <div className="bg-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                     <img 
                       src="/whatsapp.jpg" 
                       alt="WhatsApp Group QR Code" 
                       className="w-full h-auto object-contain rounded-xl"
                     />
                     <p className="text-center mt-4 text-gray-600 font-medium">
                       Scan to Join
                     </p>
                   </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t('gahoiSammelan.contact.title')}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map((contact, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                    <Phone className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-gray-800">{contact.name}</p>
                      <p className="text-gray-600">{contact.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">{t('gahoiSammelan.contact.phonepeTitle')}</p>
                <p className="text-2xl font-bold text-green-600">8251980900</p>
                <p className="text-sm text-gray-500 mt-2">{t('gahoiSammelan.contact.paymentNote')}</p>
              </div>
            </div>

            {/* Committees Section */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-red-100 mt-8 sm:mt-12 md:mt-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8 md:mb-12">
                {t('gahoiSammelan.committees.mainTitle')}
              </h2>

              <div className="space-y-8 sm:space-y-10 md:space-y-12">
                {/* Registration Committee */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-4 sm:mb-6 pb-2 border-b-2 border-red-100">
                    {t('gahoiSammelan.committees.registration.title')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { name: 'ramPrakash', phone: '9827315676' },
                      { name: 'rameshGandhi', phone: '9425109934' },
                      { name: 'omPrakash', phone: '9826806693' },
                      { name: 'mahadev', phone: '9425778734' },
                      { name: 'priyanka', phone: '9977098044' }
                    ].map((member, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg sm:rounded-xl border border-red-100 hover:shadow-md transition-shadow duration-200">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                            {t(`gahoiSammelan.committees.registration.members.${member.name}`)}
                          </p>
                          <p className="text-gray-600 text-sm">{member.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Patrika Committee */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-4 sm:mb-6 pb-2 border-b-2 border-red-100">
                    {t('gahoiSammelan.committees.patrika.title')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { name: 'radheshyam', phone: '' },
                      { name: 'chetna', phone: '9826511049' }
                    ].map((member, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg sm:rounded-xl border border-red-100 hover:shadow-md transition-shadow duration-200">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                            {t(`gahoiSammelan.committees.patrika.members.${member.name}`)}
                          </p>
                          {member.phone && <p className="text-gray-600 text-sm">{member.phone}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accommodation Committee */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-4 sm:mb-6 pb-2 border-b-2 border-red-100">
                    {t('gahoiSammelan.committees.accommodation.title')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { name: 'sanjeev', phone: '9826236020' },
                      { name: 'ramesh', phone: '9425109811' },
                      { name: 'pawan', phone: '9589390740' },
                      { name: 'neelam', phone: '9685779660' }
                    ].map((member, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg sm:rounded-xl border border-red-100 hover:shadow-md transition-shadow duration-200">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                            {t(`gahoiSammelan.committees.accommodation.members.${member.name}`)}
                          </p>
                          <p className="text-gray-600 text-sm">{member.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-red-800 to-red-700 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{t('gahoiSammelan.footer.title')}</h3>
          </div>
          <p className="text-gray-600 mb-4">{t('gahoiSammelan.footer.tagline')}</p>
          <p className="text-sm text-gray-500">{t('gahoiSammelan.footer.note')}</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GahoiSammelanPage;