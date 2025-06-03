import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Download,
  Search,
  Calendar,
  IndianRupee,
  HousePlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';

const CowIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
<path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z"/><path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2"/><path d="M18 22v-3"/><circle cx="10" cy="10" r="3"/></svg>


);

const CowSevaCollection = () => {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("donations");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState({
    donations: [],
    monthlyExpenses: [],
    sevaPlaces: []
  });

  // Add function to ensure proper URL format
  const formatUrl = (url) => {
    if (!url || url === '#') return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  // Memoize filtered donations to prevent unnecessary recalculations
  const filteredDonations = useMemo(() => {
    if (!content?.donations?.length) return [];
    if (!searchTerm) return content.donations;
    
    const searchLower = searchTerm.toLowerCase();
    return content.donations.filter(donation => 
      donation?.Name?.toLowerCase().includes(searchLower) ||
      donation?.place?.toLowerCase().includes(searchLower) ||
      donation?.purpose?.toLowerCase().includes(searchLower)
    );
  }, [searchTerm, content.donations]);

  // Reset page when search term or filtered results change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filteredDonations.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API_TOKEN = import.meta.env.VITE_API_TOKEN;
        const response = await fetch('http://localhost:1337/api/cowsevas?populate[donations][populate]=*&populate[monthlyExpenses][populate]=*&populate[sevaPlaces][populate]=*', {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
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

        // Process and combine data
        const combinedData = data.reduce((acc, entry) => {
          
          if (Array.isArray(entry.donations)) {
            acc.donations.push(...entry.donations
              .filter(d => d?.Name)
              .map(d => ({
                id: d.id,
                Name: d.Name,
                Amount: Number(d.Amount) || 0,
                Date: d.Date,
                place: d.place,
                purpose: d.purpose
              })));
          }

          // Process monthly expenses
          if (Array.isArray(entry.monthlyExpenses)) {
            acc.monthlyExpenses.push(...entry.monthlyExpenses
              .filter(e => e?.Month)
              .map(e => ({
                id: e.id,
                Month: e.Month,
                feed: Number(e.feed) || 0,
                medical: Number(e.medical) || 0,
                maintenance: Number(e.maintenance) || 0,
                staff: Number(e.staff) || 0,
                total: Number(e.total) || 0
              })));
          }

          // Process seva places
          if (Array.isArray(entry.sevaPlaces)) {
            acc.sevaPlaces.push(...entry.sevaPlaces
              .filter(p => p?.name)
              .map(p => {
                const imageData = p.image;
                return {
                  id: p.id,
                  name: p.name,
                  address: p.address,
                  contact: p.contact,
                  inCharge: p.inCharge,
                  imageUrl: imageData?.url ? `http://localhost:1337${imageData.url}` : null,
                  thumbnailUrl: imageData?.formats?.thumbnail?.url 
                    ? `http://localhost:1337${imageData.formats.thumbnail.url}` 
                    : null,
                  url: p.url || '#'
                };
              }));
          }

          return acc;
        }, { donations: [], monthlyExpenses: [], sevaPlaces: [] });

        setContent(combinedData);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoize totals to prevent unnecessary recalculations
  const { totalDonations, totalYearlyExpenses } = useMemo(() => ({
    totalDonations: content?.donations?.reduce(
      (sum, donation) => sum + (Number(donation?.Amount) || 0),
      0
    ) || 0,
    totalYearlyExpenses: content?.monthlyExpenses?.reduce(
      (sum, month) => sum + (Number(month?.total) || 0),
      0
    ) || 0
  }), [content.donations, content.monthlyExpenses]);

  const entriesPerPage = 5;
  const totalPages = Math.ceil(filteredDonations.length / entriesPerPage);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleExportDonations = useCallback(() => {
    const donationsData = filteredDonations.map(donation => ({
      [t('cowSevaCollection.donations.columns.name')]: donation.Name,
      [t('cowSevaCollection.donations.columns.amount')]: donation.Amount,
      [t('cowSevaCollection.donations.columns.date')]: new Date(donation.Date).toLocaleDateString(),
      [t('cowSevaCollection.donations.columns.place')]: donation.place,
      [t('cowSevaCollection.donations.columns.purpose')]: donation.purpose
    }));
    exportToExcel(donationsData, i18n.language === "hi" ? "दान-रिकॉर्ड" : "donation-records");
  }, [filteredDonations, t, i18n.language]);

  const handleExportExpenses = useCallback(() => {
    const expensesData = content.monthlyExpenses.map(expense => ({
      [t('cowSevaCollection.expenses.columns.month')]: expense.Month,
      [t('cowSevaCollection.expenses.columns.feed')]: expense.feed,
      [t('cowSevaCollection.expenses.columns.medical')]: expense.medical,
      [t('cowSevaCollection.expenses.columns.maintenance')]: expense.maintenance,
      [t('cowSevaCollection.expenses.columns.staff')]: expense.staff,
      [t('cowSevaCollection.expenses.columns.total')]: expense.total
    }));
    exportToExcel(expensesData, i18n.language === "hi" ? "मासिक-खर्च" : "monthly-expenses");
  }, [content.monthlyExpenses, t, i18n.language]);

  const exportToExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">
          {t('cowSevaCollection.error', { message: error })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-800">
      <main className="container mx-auto py-6 px-3 sm:px-4 md:py-8">
        {/* Title and Description */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            {t('cowSevaCollection.title')}
          </h2>
          <p className="text-gray-600">
            {t('cowSevaCollection.description')}
          </p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-700">
                {t('cowSevaCollection.summaryCards.totalDonations.title')}
              </h3>
              <IndianRupee className="text-orange-500" size={20} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-orange-600">
              Rs.{totalDonations.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              {t('cowSevaCollection.summaryCards.totalDonations.period')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-700">
                {t('cowSevaCollection.summaryCards.totalExpenses.title')}
              </h3>
              <Calendar className="text-orange-500" size={20} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-orange-600">
              Rs.{totalYearlyExpenses.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              {t('cowSevaCollection.summaryCards.totalExpenses.period')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-700">
                {t('cowSevaCollection.summaryCards.cowsSheltered.title')}
              </h3>
              <CowIcon className="text-orange-500" size={20} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-orange-600">550</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              {t('cowSevaCollection.summaryCards.cowsSheltered.period')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-700">
                {t('cowSevaCollection.summaryCards.sevaCenters.title')}
              </h3>
              <HousePlus className="text-orange-500" size={20} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-orange-600">
              {content.sevaPlaces.length}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              {t('cowSevaCollection.summaryCards.sevaCenters.period')}
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-8">
            <button
              onClick={() => setActiveTab("donations")}
              className={`py-3 sm:py-4 px-1 font-medium text-xs sm:text-sm border-b-2 whitespace-nowrap ${
                activeTab === "donations"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t('cowSevaCollection.tabs.donations')}
            </button>
            <button
              onClick={() => setActiveTab("expenses")}
              className={`py-3 sm:py-4 px-1 font-medium text-xs sm:text-sm border-b-2 whitespace-nowrap ${
                activeTab === "expenses"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t('cowSevaCollection.tabs.expenses')}
            </button>
            <button
              onClick={() => setActiveTab("places")}
              className={`py-3 sm:py-4 px-1 font-medium text-xs sm:text-sm border-b-2 whitespace-nowrap ${
                activeTab === "places"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t('cowSevaCollection.tabs.places')}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "expenses" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {t('cowSevaCollection.expenses.title')}
                </h2>
                <div className="flex space-x-2 sm:space-x-4">
                  <button 
                    onClick={handleExportExpenses}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 flex items-center space-x-2 hover:bg-gray-50 transition text-sm"
                  >
                    <Download size={16} />
                    <span className="hidden sm:inline">{t('cowSevaCollection.expenses.exportReport')}</span>
                    <span className="sm:hidden">{t('cowSevaCollection.expenses.export')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Expenses Cards */}
            <div className="sm:hidden">
              {content.monthlyExpenses.map((expense, index) => (
                <div key={index} className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-900">{expense.Month}</h3>
                    <div className="font-bold text-gray-900">₹{expense.total.toLocaleString()}</div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{t('cowSevaCollection.expenses.columns.feed')}:</span>
                      <span>₹{expense.feed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{t('cowSevaCollection.expenses.columns.medical')}:</span>
                      <span>₹{expense.medical.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{t('cowSevaCollection.expenses.columns.maintenance')}:</span>
                      <span>₹{expense.maintenance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{t('cowSevaCollection.expenses.columns.staff')}:</span>
                      <span>₹{expense.staff.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cowSevaCollection.expenses.columns.month')}
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cowSevaCollection.expenses.columns.feed')}
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cowSevaCollection.expenses.columns.medical')}
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cowSevaCollection.expenses.columns.maintenance')}
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cowSevaCollection.expenses.columns.staff')}
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cowSevaCollection.expenses.columns.total')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {content.monthlyExpenses.map((expense, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap font-medium text-gray-900 text-xs sm:text-sm">
                        {expense.Month}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-500 text-xs sm:text-sm">
                      Rs.{expense.feed.toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-500 text-xs sm:text-sm">
                      Rs.{expense.medical.toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-500 text-xs sm:text-sm">
                        Rs.{expense.maintenance.toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-500 text-xs sm:text-sm">
                      Rs.{expense.staff.toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <div className="font-bold text-gray-900">
                        Rs.{expense.total.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "places" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                {t('cowSevaCollection.sevaPlaces.title')}
              </h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                {t('cowSevaCollection.sevaPlaces.description')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {content.sevaPlaces.map((place, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                  >
                    <div className="h-32 sm:h-48 bg-orange-100 overflow-hidden">
                      <img
                        src={place.imageUrl || '/cow-seva-place-1.webp'}
                        alt={place.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = '/cow-seva-place-1.webp';
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-bold text-base sm:text-lg mb-2">
                        {place.name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3">
                        {place.address}
                      </p>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500 text-xs sm:text-sm">
                            {t('cowSevaCollection.sevaPlaces.details.inCharge')}:
                          </span>
                          <span className="font-medium text-xs sm:text-sm">{place.inCharge}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 text-xs sm:text-sm">
                            {t('cowSevaCollection.sevaPlaces.details.contact')}:
                          </span>
                          <span className="font-medium text-xs sm:text-sm">{place.contact}</span>
                        </div>
                      </div>
                      <a 
                        href={formatUrl(place.url)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-3 sm:mt-4 w-full bg-orange-100 text-orange-700 rounded-lg py-1.5 sm:py-2 hover:bg-orange-200 transition font-medium text-xs sm:text-sm inline-block text-center"
                      >
                        {t('cowSevaCollection.sevaPlaces.details.visitButton')}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "donations" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {t('cowSevaCollection.donations.title')}
                </h2>
                <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder={t('cowSevaCollection.donations.searchPlaceholder')}
                      className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-1.5 sm:py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search
                      className="absolute left-3 top-2 text-gray-400"
                      size={16}
                    />
                  </div>
                  <button 
                    onClick={handleExportDonations}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 flex items-center justify-center space-x-2 hover:bg-gray-50 transition text-sm"
                  >
                    <Download size={16} />
                    <span>{t('cowSevaCollection.donations.export')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Donation Cards */}
            <div className="sm:hidden">
              {filteredDonations
                .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
                .map((donation) => (
                  <div key={donation.id} className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900 text-sm">
                        {donation.Name}
                      </div>
                      <div className="text-gray-900 font-bold text-sm">
                        Rs.{donation.Amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <div>{new Date(donation.Date).toLocaleDateString()}</div>
                      <div>{donation.place}</div>
                    </div>
                    <div className="flex justify-end">
                      <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-orange-100 text-orange-800">
                        {donation.purpose}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cowSevaCollection.donations.columns.name')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cowSevaCollection.donations.columns.amount')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cowSevaCollection.donations.columns.date')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cowSevaCollection.donations.columns.place')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cowSevaCollection.donations.columns.purpose')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDonations
                    .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
                    .map((donation) => (
                      <tr key={donation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {donation.Name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            Rs.{donation.Amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(donation.Date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {donation.place}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                            {donation.purpose}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                {t('cowSevaCollection.pagination.showing', {
                  start: (currentPage - 1) * entriesPerPage + 1,
                  end: Math.min(currentPage * entriesPerPage, filteredDonations.length),
                  total: filteredDonations.length
                })}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <ChevronLeft size={16} />
                    <span>{t('cowSevaCollection.pagination.previous')}</span>
                  </div>
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === Math.ceil(filteredDonations.length / entriesPerPage)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === Math.ceil(filteredDonations.length / entriesPerPage)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{t('cowSevaCollection.pagination.next')}</span>
                    <ChevronRight size={16} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CowSevaCollection;
