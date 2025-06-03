import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const API_URL = import.meta.env.VITE_PUBLIC_STRAPI_API_URL;

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
                'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`
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
          supporter: {
            name: student.supporter_name,
            role: student.supporter_role,
            photo: student.supporter_photo?.url ? 
              (student.supporter_photo.url.startsWith('http') ? student.supporter_photo.url : `${API_URL}${student.supporter_photo.url}`) : 
              '/placeholder-supporter.jpg'
          }
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
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    className: "supported-students-slider",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  if (isLoading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 py-12">{error}</div>;
  }
  if (!supportedStudents.length) {
    return null;
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-4">{t('funds.supportedStudentsTitle')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">{t('funds.supportedStudentsDescription')}</p>
        </div>
        <Slider {...sliderSettings}>
          {supportedStudents.map((student, index) => (
            <div key={index} className="px-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[32rem]">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-full h-48 object-cover"
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
                <div className="p-6 flex flex-col h-[calc(32rem-12rem)]">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{student.name}</h3>
                    <p className="text-gray-600 mb-4">{student.school}</p>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm font-medium text-red-800 bg-red-100 px-3 py-1 rounded-full">
                        {student.marks}
                      </span>
                      <span className="text-sm font-medium text-green-800 bg-green-100 px-3 py-1 rounded-full">
                        {student.supportAmount}
                      </span>
                    </div>
                    <div className="overflow-y-auto mb-4 pr-2" style={{ maxHeight: '120px' }}>
                      <p className="text-gray-700 text-sm">{student.story}</p>
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-auto">
                    <p className="text-sm text-gray-500 mb-2">
                      {t('funds.supportedBy')}
                    </p>
                    <div className="flex items-center">
                      <img
                        src={student.supporter.photo}
                        alt={student.supporter.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-900">
                          {student.supporter.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {student.supporter.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SupportedStudentsSection;
