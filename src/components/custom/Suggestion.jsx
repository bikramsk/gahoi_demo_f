import React, { useState } from "react";

const Suggestion = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobile: "",
    email: "",
    suggestion: "",
    securityCode: "",
  });

  const [errors, setErrors] = useState({});
  const [generatedCode, setGeneratedCode] = useState(
    Math.floor(1000 + Math.random() * 9000)
  );

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "नाम आवश्यक है";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "पता आवश्यक है";
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = "मोबाइल नंबर आवश्यक है";
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "ईमेल आवश्यक है";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "कृपया सही ईमेल पता दर्ज करें";
    }
    
    if (!formData.suggestion.trim()) {
      newErrors.suggestion = "सुझाव आवश्यक है";
    }
    
    if (!formData.securityCode.trim()) {
      newErrors.securityCode = "सुरक्षा कोड आवश्यक है";
    } else if (formData.securityCode !== generatedCode.toString()) {
      newErrors.securityCode = "गलत सुरक्षा कोड";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      address: "",
      mobile: "",
      email: "",
      suggestion: "",
      securityCode: "",
    });
    setErrors({});
    setGeneratedCode(Math.floor(1000 + Math.random() * 9000));
  };

  return (
    <div className="min-h-screen py-2 sm:py-4 md:py-6 relative bg-red-800">
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/70 to-red-800/70"></div>
      <div className="relative w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border-2 border-red-200/50 mx-4 mt-28 sm:mt-20 md:mt-24">
        <div className="bg-white/90 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="relative p-4 text-center border-b border-red-200">
            <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-900 opacity-90"></div>
            <div className="relative z-10">
              
              <div className="inline-block bg-red-800/50 backdrop-blur-sm px-4 sm:px-6 py-2 rounded-full border border-yellow-500/30">
                <p className="text-base sm:text-lg font-medium text-yellow-100">आपकी सुझाव</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  नाम
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="अपना नाम दर्ज करें"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  पता
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="अपना पता दर्ज करें"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  मोबाइल नंबर
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.mobile ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="अपना मोबाइल नंबर दर्ज करें"
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  ईमेल
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="अपना ईमेल दर्ज करें"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Suggestion */}
              <div>
                <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700 mb-1">
                  आपका सुझाव
                </label>
                <textarea
                  id="suggestion"
                  name="suggestion"
                  value={formData.suggestion}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.suggestion ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="अपना सुझाव दर्ज करें"
                />
                {errors.suggestion && (
                  <p className="mt-1 text-sm text-red-600">{errors.suggestion}</p>
                )}
              </div>

              {/* Security Code */}
              <div>
                <label htmlFor="securityCode" className="block text-sm font-medium text-gray-700 mb-1">
                  सुरक्षा कोड: <span className="font-bold text-red-600">{generatedCode}</span>
                </label>
                <input
                  type="text"
                  id="securityCode"
                  name="securityCode"
                  value={formData.securityCode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.securityCode ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="सुरक्षा कोड दर्ज करें"
                />
                {errors.securityCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.securityCode}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  जमा करें
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestion; 