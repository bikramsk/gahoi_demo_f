import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

const API_URL = import.meta.env.VITE_PUBLIC_STRAPI_API_URL;

const CommunityFunds = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;


  const [supportedStudents, setSupportedStudents] = useState([]);
  const [regularContributors, setRegularContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch supported students
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

        // Fetch regular contributors
        const contributorsResponse = await fetch(
          `${API_URL}/api/regular-contributors?populate=*`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(import.meta.env.VITE_API_TOKEN && {
                'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`
              })
            }
          }
        );

        if (!studentsResponse.ok || !contributorsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const studentsData = await studentsResponse.json();
        const contributorsData = await contributorsResponse.json();

        // Process students data
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

        // Process contributors data
        const processedContributors = contributorsData.data.map(contributor => ({
          id: contributor.id,
          name: contributor.name,
          role: contributor.role,
          contribution: {
            monthly: contributor.monthly_contribution,
            total: contributor.total_contribution
          },
          photo: contributor.photo?.url ? 
            (contributor.photo.url.startsWith('http') ? contributor.photo.url : `${API_URL}${contributor.photo.url}`) : 
            '/placeholder-contributor.jpg',
          impact: contributor.impact,
          message: contributor.message,
          contribution_date: contributor.contribution_date,
          place: contributor.place,
          purpose: contributor.purpose
        }));

        setSupportedStudents(processedStudents);
        setRegularContributors(processedContributors);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Carousel settings
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

  // Filter contributors based on search term
  const filteredContributors = useMemo(() => {
    if (!searchTerm) return regularContributors;
    
    const searchLower = searchTerm.toLowerCase().trim();
    return regularContributors.filter(contributor => {
    
      const name = contributor.name?.toLowerCase() || '';
      const role = contributor.role?.toLowerCase() || '';
      const monthlyContribution = contributor.contribution?.monthly?.toLowerCase() || '';
      const impact = contributor.impact?.toLowerCase() || '';
      const place = contributor.place?.toLowerCase() || '';
      const purpose = contributor.purpose?.toLowerCase() || '';

      return name.includes(searchLower) ||
             role.includes(searchLower) ||
             monthlyContribution.includes(searchLower) ||
             impact.includes(searchLower) ||
             place.includes(searchLower) ||
             purpose.includes(searchLower);
    });
  }, [searchTerm, regularContributors]);

  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredContributors.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredContributors.length / recordsPerPage);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Export to Excel function
  const exportToExcel = useCallback((data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }, []);

  // Handle export
  const handleExport = useCallback(() => {
    const communityData = filteredContributors.map(contributor => ({
      [t('funds.regularContributors.contributorName')]: contributor.name,
      [t('funds.regularContributors.contributionAmount')]: contributor.contribution.monthly,
      [t('funds.regularContributors.date')]: contributor.contribution_date || new Date().toLocaleDateString(),
      [t('funds.regularContributors.place')]: contributor.place || 'N/A',
      [t('funds.regularContributors.purpose')]: contributor.purpose || t('funds.regularContributors.educationSupport')
    }));
    exportToExcel(communityData, i18n.language === "hi" ? "सामुदायिक-योगदान-रिकॉर्ड" : "community-contribution-records");
  }, [filteredContributors, t, i18n.language, exportToExcel]);

  // Language-specific font class
  const languageFontClass = i18n.language === "hi" ? "font-serif" : "font-sans";

  // Calculate total contributions
  const totalContributions = useMemo(() => {
    return regularContributors.reduce((total, contributor) => {
      
      const amount = parseFloat(contributor.contribution.total?.replace(/[₹,]/g, '')) || 0;
      return total + amount;
    }, 0);
  }, [regularContributors]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-red-800 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('funds.meta.title')}</title>
        <meta name="description" content={t('funds.meta.description')} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative w-full bg-red-800 pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <img
          src="/community-funds/community_funds_bg.webp"
          alt="Community Funds Background"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="p-3 md:p-5 bg-white/10 rounded-full w-20 h-20 mx-auto mb-6 backdrop-blur-sm">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              {t('funds.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium max-w-3xl mx-auto">
              {t('funds.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-[#FD7D01] mb-2">{regularContributors.length}+</p>
              <p className="text-gray-600">{t('funds.stats.totalContributors')}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-[#FD7D01] mb-2">{supportedStudents.length}+</p>
              <p className="text-gray-600">{t('funds.stats.studentsSupported')}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-[#FD7D01] mb-2">
                ₹{new Intl.NumberFormat('en-IN', { 
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0 
                }).format(totalContributions >= 100000 ? totalContributions/100000 : totalContributions/1000)}
                {totalContributions >= 100000 ? 'L+' : 'K+'}
              </p>
              <p className="text-gray-600">{t('funds.stats.totalContributions')}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-[#FD7D01] mb-2">99%</p>
              <p className="text-gray-600">{t('funds.stats.successRate')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            {t('funds.sections.supportedStudents')}
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
            {t('funds.sections.supportedStudentsDesc')}
          </p>
        </div> */}

        {/* Supported Students Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('funds.supportedStudentsTitle')}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('funds.supportedStudentsDescription')}</p>
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

        {/* Regular Contributors Section */}
        <div className="mb-8 md:mb-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Section Title */}
            <div className="p-4 md:p-6 bg-gray-50">
              <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 ${languageFontClass}`}>
                {t('funds.regularContributors.sectionTitle')}
              </h2>
              <p className={`mt-2 text-sm md:text-base text-gray-600 ${languageFontClass}`}>
                {t('funds.regularContributors.sectionDescription')}
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button className={`px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium text-red-800 border-b-2 border-red-800 ${languageFontClass}`}>
                  {t('funds.regularContributors.donationRecord')}
                </button>
              </nav>
            </div>

            {/* Search and Export */}
            <div className="p-3 md:p-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-gray-200">
              <div className="relative flex-1 w-full sm:max-w-xs">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={t('funds.regularContributors.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-2.5">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button 
                onClick={handleExport}
                className="w-full sm:w-auto px-4 py-2 bg-red-800 text-white rounded-lg text-sm hover:bg-red-700 flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t('funds.regularContributors.export')}
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {t('funds.regularContributors.contributorName')}
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {t('funds.regularContributors.monthlyContribution')}
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {t('funds.regularContributors.totalContribution')}
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {t('funds.regularContributors.date')}
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {t('funds.regularContributors.place')}
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {t('funds.regularContributors.purpose')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRecords.map((contributor) => (
                      <tr key={contributor.id} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                          {contributor.name}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                          {contributor.contribution.monthly}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                          {contributor.contribution.total}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                          {contributor.contribution_date || new Date().toLocaleDateString()}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                          {contributor.place || 'N/A'}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            {contributor.purpose || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-white px-3 md:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200">
              <div className="w-full sm:w-auto text-center sm:text-left">
                <p className="text-xs md:text-sm text-gray-700">
                  {t('funds.regularContributors.showing')} {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredContributors.length)} {t('funds.regularContributors.of')} {filteredContributors.length} {t('funds.regularContributors.total')}
                </p>
              </div>
              <div className="flex gap-2 md:gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-md ${
                    currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-red-800 text-white hover:bg-red-700'
                  }`}
                >
                  <svg className="h-4 w-4 mr-1 md:mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('cowSevaCollection.pagination.previous')}
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-md ${
                    currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-red-800 text-white hover:bg-red-700'
                  }`}
                >
                  {t('cowSevaCollection.pagination.next')}
                  <svg className="h-4 w-4 ml-1 md:ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Join */}
        <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{t('funds.joinUs.title')}</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">{t('funds.joinUs.description')}</p>
          <Link to="/contact-us">
            <button className="bg-white text-red-800 px-8 py-4 rounded-lg font-semibold hover:bg-red-50 transition-colors text-lg">
              {t('funds.joinUs.button')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityFunds;