import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../custom/LanguageSwitcher';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t, i18n } = useTranslation();

  const hindiTextClass = i18n.language === "hi" 
    ? "text-base lg:text-lg font-hindi" 
    : "text-sm md:text-xs lg:text-base font-english";

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { to: '/', label: t('navigation.home') },
    { to: '/login', label: t('navigation.login') },
    { to: '/about-us', label: t('navigation.about') },
    { to: '/contact-us', label: t('navigation.contact') },
    { to: '/gau-seva', label: t('navigation.gauseva') },
    { to: '/gotra-aankna', label: t('navigation.gotraankna') },
    { to: '/all-assembly', label: t('navigation.allassembly') },
    // { to: '/community-funds', label: t('navigation.funds') },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-[#800000]">
      <nav className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 z-50">
            <img 
              src="/logo.png" 
              alt="Gahoi Logo" 
              className="h-20 sm:h-14 md:h-16 lg:h-28 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center space-x-3">
            {/* Hamburger icon */}
            {!isMenuOpen && (
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors z-50"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-2 lg:space-x-4 items-center">
              {menuItems.map((item) => (
                <div 
                  key={item.to}
                  className="relative"
                >
                  <Link
                    to={item.to}
                    className={`${hindiTextClass} text-white hover:text-yellow-200 transition-colors drop-shadow-lg px-1 lg:px-2 whitespace-nowrap`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
            <div className="ml-4">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div 
              ref={dropdownRef}
              className="md:hidden fixed inset-0 top-[88px] bg-red-800/95 backdrop-blur-sm z-40"
            >
              {/* Close button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-lg transition-colors z-50"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`${hindiTextClass} block text-white hover:text-yellow-200 py-2 text-lg font-medium`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="mt-4 border-t border-red-700 pt-4">
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header; 
