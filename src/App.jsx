import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Registration from "./components/custom/Registration";
import Login from "./components/custom/Login";
import PrivacyPolicy from "./components/custom/PrivacyPolicy";
import SocialFlagSong from "./components/custom/SocialFlagSong";
import Contact from "./components/custom/Contact";
import AboutUs from "./components/custom/AboutUs";
import Video from "./components/custom/VideoPage";
import { CowSeva } from "./components/cow-seva";
import ScrollToTop from "./utils/components/ScrollToTop";
import GotraAankna from "./components/custom/GotraAankna";
import AllAssembly from "./components/custom/AllAssembly";
import LatestNews from "./components/custom/LatestNews";
import NotFound from "./components/NotFound";
import CommunityFunds from "./components/custom/CommunityFunds";



function App() {
  return (
    <HelmetProvider>
      <Layout>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/socialflagsong" element={<SocialFlagSong />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/gau-seva" element={<CowSeva />} />
          <Route path="/gotra-aankna" element={<GotraAankna />} />
          <Route path="/all-assembly" element={<AllAssembly />} />
          <Route path="/video" element={<Video />} />
          <Route path="/latestnews" element={<LatestNews />} />
          <Route path="/community-funds" element={<CommunityFunds />} />
          {/* 404 route*/}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </HelmetProvider>
  );
}

export default App;
