import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_PUBLIC_STRAPI_API_URL;

// Custom Arrow Components with enhanced styling
const PrevArrow = (props) => (
  <button
    {...props}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-red-600 hover:text-white text-red-600 rounded-full shadow-lg hover:shadow-xl p-3 transition-all duration-300 transform hover:scale-110 border border-red-100"
    aria-label="Previous story"
    style={{ display: props.currentSlide === 0 ? 'none' : 'block' }}
  >
    <FaChevronLeft className="w-5 h-5" />
  </button>
);

const NextArrow = (props) => (
  <button
    {...props}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-red-600 hover:text-white text-red-600 rounded-full shadow-lg p-3 transition-all duration-300 transform hover:border border-red-100"
    aria-label="Next story"
    style={{ display: props.currentSlide === props.slideCount - props.slidesToShow ? 'none' : 'block' }}
  >
    <FaChevronRight className="w-5 h-5" />
  </button>
);

const SupportedStudentsSection = () => {
  const { t } = useTranslation();
  const [supportedStudents, setSupportedStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const studentsResponse = await fetch(
          `${API_URL}/api/supported-students?populate=*`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(import.meta.env.VITE_API_TOKEN && {
                // 'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`
              })
            }
          }
        );
        if (!studentsResponse.ok) {
          throw new Error('Failed to fetch supported students');
        }
        const studentsData = await studentsResponse.json();
        const processedStudents = studentsData.data.map(student => ({
          id: student.id,
          name: student.name,
          achievement: student.achievement,
          marks: student.marks,
          school: student.school,
          story: student.story,
          photo: student.photo?.url ? 
            (student.photo.url.startsWith('http') ? student.photo.url : `${API_URL}${student.photo.url}`) : 
            '/placeholder-student.jpg',
          supportAmount: student.supportAmount,
          // supporter: {
          //   name: student.supporter_name,
          //   role: student.supporter_role,
          //   photo: student.supporter_photo?.url ? 
          //     (student.supporter_photo.url.startsWith('http') ? student.supporter_photo.url : `${API_URL}${student.supporter_photo.url}`) : 
          //     '/placeholder-supporter.jpg'
          // }
        }));
        setSupportedStudents(processedStudents);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    className: "supported-students-slider",
    appendDots: dots => (
      <div style={{ bottom: "-40px" }}>
        <ul style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "4px",
          margin: "0",
          padding: "0",
          listStyle: "none",
          maxWidth: "100%",
          overflow: "hidden" 
        }}> 
          {dots} 
        </ul>
      </div>
    ),
    customPaging: () => (
      <div style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: "rgb(153, 27, 27)",
        opacity: "0.5",
        transition: "all 0.3s ease"
      }}></div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: false
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          centerMode: true,
          centerPadding: '0px'
        }
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="py-16 bg-gradient-to-br from-white via-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-12">{error}</div>;
  }

  if (!supportedStudents.length) {
    return null;
  }

  return (
    <div className="py-16 bg-gradient-to-br from-white via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-red-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-4">{t('funds.supportedStudentsTitle')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">{t('funds.supportedStudentsDescription')}</p>
        </div>
        
        <div className="relative">
          <Slider {...sliderSettings}>
            {supportedStudents.map((student) => (
              <div key={student.id} className="px-3 py-2">
                <div className="group bg-white rounded-xl shadow-lg overflow-hidden h-[28rem] transition-all duration-300 hover:shadow-xl border border-red-50 hover:border-red-200 relative">
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <img
                      src={student.photo}
                      alt={student.name}
                      className="w-full h-72 object-cover transition-transform duration-300 "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {student.achievement && (
                      <div className="absolute bottom-3 left-3">
                        <span className="text-sm font-medium text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                          {student.achievement}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col h-[calc(28rem-18rem)]">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-800 transition-colors">
                        {student.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{student.school}</p>
                      <div className="flex items-center gap-2 my-2">
                        <span className="text-sm font-medium text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                          {student.marks}
                        </span>
                        <span className="text-sm font-medium text-green-800 bg-green-100 px-2 py-0.5 rounded-full">
                          {student.supportAmount}
                        </span>
                      </div>
                      <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-200 scrollbar-track-gray-100" style={{ maxHeight: '60px' }}>
                        <p className="text-gray-700 text-sm">{student.story}</p>
                      </div>
                    </div>
                    <div className="border-t border-red-50 pt-2 mt-auto">
                      <p className="text-sm text-gray-500">
                        {t('funds.HonoredBy')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default SupportedStudentsSection;
