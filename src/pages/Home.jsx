import React, { Suspense, lazy, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

const API_URL =
  import.meta.env.VITE_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  </div>
);

// Error Fallback component
const ErrorFallback = ({ error, componentName }) => {
  console.error(`Error in ${componentName}:`, error);
  return (
    <div className="min-h-[200px] flex items-center justify-center p-4 bg-red-50 rounded-lg">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Error loading {componentName}
        </h2>
        <p className="text-gray-600 mb-4">
          {error?.message || "Please try refreshing the page"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`Error in ${this.props.componentName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          componentName={this.props.componentName}
        />
      );
    }
    return this.props.children;
  }
}

// Wrap lazy imports in try-catch
const lazyImport = (importFn, componentName) => {
  return lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      console.error(`Failed to load ${componentName}:`, error);
      throw error;
    }
  });
};

// Lazy load components with error handling
const HeroSection = lazyImport(
  () => import("../components/sections/HeroSection"),
  "HeroSection"
);
const EventBanner = lazyImport(
  () => import("../components/sections/EventBanner"),
  "EventBanner"
);

const AboutSection = lazyImport(
  () => import("../components/sections/AboutSection"),
  "AboutSection"
);
const SuccessStories = lazyImport(
  () => import("../components/sections/SuccessStories"),
  "SuccessStories"
);

const NewsSubmissionSection = lazyImport(
  () => import("../components/sections/NewsSubmissionSection"),
  "NewsSubmissionSection"
);
const StayConnected = lazyImport(
  () => import("../components/sections/StayConnected"),
  "StayConnected"
);
const LatestNewsSection = lazyImport(
  () => import("../components/sections/LatestNewsSection"),
  "LatestNewsSection"
);
const CowSevaSection = lazyImport(
  () => import("../components/sections/CowSevaSection"),
  "CowSevaSection"
);
const CulturalHeritageSection = lazyImport(
  () => import("../components/sections/CulturalHeritageSection"),
  "CulturalHeritageSection"
);



// Component wrapper for consistent error handling
const SectionWrapper = ({ children, name }) => (
  <ErrorBoundary componentName={name}>
    <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
  </ErrorBoundary>
);

const Home = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    // Fetch news data
    fetch(
      `${API_URL}/api/latest-news-items?populate[0]=Title&populate[1]=Description&populate[2]=Images`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Invalid data structure received");
        }

        const processedNews = result.data.map((item) => {
          const hiTitle = item.Title?.[0]?.hi || "";
          const enTitle = item.Title?.[0]?.en || "";

          const hiDesc =
            item.Description?.[0]?.hi
              ?.map((block) =>
                block.children?.map((child) => child.text).join("")
              )
              .join("\n") || "";

          const enDesc =
            item.Description?.[0]?.en
              ?.map((block) =>
                block.children?.map((child) => child.text).join("")
              )
              .join("\n") || "";

          const dateObj = item.Date ? new Date(item.Date) : new Date(0);

          return {
            id: item.id,
            title: {
              hi: hiTitle,
              en: enTitle || hiTitle,
            },
            excerpt: {
              hi: hiDesc,
              en: enDesc || hiDesc,
            },
            dateObj: dateObj, // Store the date object for sorting
            date: dateObj.toLocaleDateString(),
            image: item.Images?.[0]?.url
              ? item.Images[0].url.startsWith("http")
                ? item.Images[0].url
                : `${API_URL}${item.Images[0].url}`
              : "/news-placeholder.jpg",
          };
        });

        // Sort by date in descending order (newest first)
        const sortedNews = processedNews.sort((a, b) => b.dateObj - a.dateObj);

        setNewsData(sortedNews);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        setNewsData([]);
      });
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>श्री गहोई शक्ति जन कल्याण समिति</title>
        <meta
          name="description"
          content="श्री गहोई शक्ति जन कल्याण समिति - समाज की सेवा में समर्पित"
        />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      {/* Main Hero Section */}
      <SectionWrapper name="HeroSection">
        <HeroSection />
      </SectionWrapper>

      {/* Important Updates Banner */}
      <SectionWrapper name="EventBanner">
        <EventBanner />
      </SectionWrapper>

      {/* About Our Community */}
      <SectionWrapper name="AboutSection">
        <AboutSection />
      </SectionWrapper>

      {/* Cultural Heritage */}
      <SectionWrapper name="CulturalHeritageSection">
        <CulturalHeritageSection />
      </SectionWrapper>




      {/* Cow Seva Initiatives */}
      <SectionWrapper name="CowSevaSection">
        <CowSevaSection />
      </SectionWrapper>

       {/* Latest News & Events */}
      <SectionWrapper name="LatestNewsSection">
        <LatestNewsSection newsData={newsData} />
      </SectionWrapper>

      {/* Success Stories */}
      <SectionWrapper name="SuccessStories">
        <SuccessStories />
      </SectionWrapper>

      {/* Community Suggestions */}
      <SectionWrapper name="NewsSubmissionSection">
        <NewsSubmissionSection />
      </SectionWrapper>

      {/* Stay Connected */}
      <SectionWrapper name="StayConnected">
        <StayConnected />
      </SectionWrapper>
    </div>
  );
};

export default Home;
