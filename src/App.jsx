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
export default function App() {
  return (
    <>
      <Router>
      {/* Header component */}

      <Header />

      {/* Main content */}
      <main className="min-h-screen mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<WhyChooseUs />} />
        </Routes>
      </main>
      <Footer />
    </Router>
    {/* <Home /> */}
    
    {/* <AppBackground>
      <Features /> */}
     {/* <div className="mx-auto max-w-5xl px-4 py-10 bg-(--color-light)"> */}
      {/* <WhyChooseUs /> */}
      {/* </div> */}
         {/* <Header />   */}
         {/* <HeroSection /> */}
         {/* <PayPage /> */}
         {/* <Footer/> */}
    {/* </AppBackground> */}

    </>
  );
}
