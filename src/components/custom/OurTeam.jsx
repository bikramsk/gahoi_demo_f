import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const OurTeam = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('founders');

  // Font class 
  const languageFontClass = i18n.language === "hi" ? "font-hindi" : "font-english";

  // Reusable styles
  const headingStyles = `text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4 ${languageFontClass}`;

  const SectionTitle = ({ title, subtitle }) => (
    <div className="text-center mb-10 md:mb-12">
      <h2 className={headingStyles}>{title}</h2>
      <div className="w-24 h-1 bg-red-700 mx-auto rounded-full mb-4"></div>
      {subtitle && (
        <p className={`text-gray-600 max-w-2xl mx-auto ${languageFontClass}`}>
          {subtitle}
        </p>
      )}
    </div>
  );

  // Team member data
  const founderMembers = [
    {
      name: "Pradeep Pahariya",
      location: "Gwalior",
     image: "/our-team/pradeep_pahariya.jpg",
      
    },
    {
      name: "Sudhir Rawat",
      location: "Gwalior",      
    image: "/our-team/sudhir_rawat.jpg",
     
    },
    {
        name: "Bhanu Capra",
        location: "Gwalior",        
       image: "/our-team/bhanu_capra.jpg",
       
      },
      {
        name: "Bhai Siyasaran Kastwar",
        location: "Gwalior",        
      image: "/our-team/Siyasaran_kastwar.jpg",
        
      },
      {
        name: "Nitesh Seth",
        location: "Noida",       
      image: "/our-team/nitesh_seth.jpg",
        
      },
      
  ];

  const executiveMembers = [
    {
      name: "Chetna Nikhra",
      location: "Murar",     
    image: "/our-team/chetna_nikhra.jpg",
     
    },
    
    {
      name: "Neelam Reza",
      location: "Thatipur",     
    image: "/our-team/neelam_reza.jpg",
      
    },
    {
        name: "Baby Bihari Reza",
        location: "New City Center",        
      image: "/our-team/bihari_riza.jpg",
        
      },
      {
        name: "Shrimati Sarika Reza",
        location: "Deen Dayal Nagar",
        period: "2023-Present",
      image: "/our-team/Sarika_Riza.jpg",
      },
      {
        name: "Shri Rajesh Kumar Gahoi",
        location: "President",
        period: "2023-Present",
      image: "/dummy-profile.webp",
        contact: "+91 98XXXXXXXX",
        email: "president@gahoishakti.in"
      },
      {
        name: "Shri Suresh Kumar Gahoi",
        location: "Secretary",
        period: "2023-Present",
      image: "/dummy-profile.webp",
        contact: "+91 98XXXXXXXX",
        email: "secretary@gahoishakti.in"
      },
      {
        name: "Shri Rajesh Kumar Gahoi",
        location: "President",
        period: "2023-Present",
      image: "/dummy-profile.webp",
        contact: "+91 98XXXXXXXX",
        email: "president@gahoishakti.in"
      },
      {
        name: "Shri Suresh Kumar Gahoi",
        location: "Secretary",
        period: "2023-Present",
      image: "/dummy-profile.webp",
        contact: "+91 98XXXXXXXX",
        email: "secretary@gahoishakti.in"
      },
  ];

  const TeamMemberCard = ({ member, isFounder }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-w-4 aspect-h-3 relative group">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/dummy-profile.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <h3 className={`text-xl font-bold text-gray-800 mb-2 ${languageFontClass}`}>
          {member.name}
        </h3>
        <p className={`text-[#FD7D01] font-medium mb-2 ${languageFontClass}`}>
          {member.location}
        </p>
        <p className={`text-sm text-gray-600 mb-3 ${languageFontClass}`}>
          {member.period}
        </p>
        {isFounder ? (
          <p className={`text-sm text-gray-700 ${languageFontClass}`}>
            <span className="font-medium">{t("team.memberCard.contribution")}: </span>
            {member.contribution}
          </p>
        ) : (
          <div className="space-y-1">
            <p className={`text-sm text-gray-700 ${languageFontClass}`}>
              <span className="font-medium">{t("team.memberCard.contact")}: </span>
              {member.contact}
            </p>
            <p className={`text-sm text-gray-700 ${languageFontClass}`}>
              <span className="font-medium">{t("team.memberCard.email")}: </span>
              {member.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const TabButton = ({ id, label, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        activeTab === id
          ? 'bg-[#FD7D01] text-white shadow-lg'
          : 'bg-white text-gray-600 hover:bg-gray-50'
      } ${languageFontClass}`}
    >
      {label}
      <span className="ml-2 px-2 py-1 rounded-full text-sm bg-white/20">
        {count}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{t("team.meta.title")}</title>
        <meta
          name="description"
          content={t("team.meta.description")}
        />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-800 to-red-900 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/ourteam-bg.webp" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-red-900/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 to-transparent"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: "url('/ourteam-bg.webp')",
            backgroundSize: 'cover',
            backgroundlocation: 'center',
            mixBlendMode: 'overlay',
            opacity: 0.1
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 ${languageFontClass}`}>
              {t("team.hero.title")}
            </h1>
            <p className={`text-xl text-white/90 max-w-3xl mx-auto ${languageFontClass}`}>
              {t("team.hero.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="bg-gray-50 min-h-screen">
        {/* Tab Navigation */}
        <div className="sticky top-0 z-30 bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-4 py-4">
              <TabButton 
                id="founders" 
                label={t("team.tabs.founders")}
                count={founderMembers.length}
              />
              <TabButton 
                id="executive" 
                label={t("team.tabs.executive")}
                count={executiveMembers.length}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Active Tab Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeTab === 'founders' && founderMembers.map((member, index) => (
                <TeamMemberCard key={index} member={member} isFounder={true} />
              ))}
              {activeTab === 'executive' && executiveMembers.map((member, index) => (
                <TeamMemberCard key={index} member={member} isFounder={false} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam; 