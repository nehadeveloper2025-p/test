import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AppBackground from "./components/AppBackground.jsx";
import PayPage from "./components/PayPage.jsx"  ;
// import './App.css'
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import HeroSection from "./components/HeroSection.jsx";
import WhyChooseUs from "./pages/WhyChooseUs.jsx";
import Home from "./pages/HomePage.jsx";
import Features from "./pages/FeaturesPage.jsx";
import FAQ from "./pages/FAQ.jsx";

export default function App() {
  return (
    <>
     <div className="min-h-screen">
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <WhyChooseUs />
      {/* <FAQ /> */}
    </div>
      {/* <Router>
      <Header />
       Main content  <div className="mx-auto max-w-6xl px-4">
      <main className="min-h-screen mx-auto max-w-[1100px] px-2">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<WhyChooseUs />} />
        </Routes>
      </main>
      <Footer />
    </Router> */}
    </div>

    </>
  );
}