import React, { useEffect, useState } from "react";

export default function Header() {
   const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full py-4 px-6 lg:px-16 flex justify-between items-center bg-transparent  relative top-0 left-0 z-50">
         <div className="flex items-center gap-2">
      <img
        src="/epaysliplogo.png"
        alt="ePay Slip Logo"
        className="w-32 object-contain shrink-0"  /* 2rem x 2rem = button height */
      />
    </div>

      <nav className="hidden md:flex gap-8 text-(--color-dark) font-medium">
        <a href="/" className="hover:text-(--color-cta)">
          Home
        </a>
        <a href="/features" className="hover:text-(--color-cta)">
          Features
        </a>
        <a href="/contact" className="hover:text-(--color-cta)">
          Contact
        </a>
      </nav>

      <div className="flex gap-3">
        <button className="px-5 py-2 rounded-full border border-(--color-dark) hover:bg-(--color-dark) hover:text-white transition">
          Sign Up
        </button>
        <button className="px-5 py-2 rounded-full bg-(--color-dark) text-white hover:bg-(--color-cta) transition">
          Login
        </button>
      </div>
    </header>
  );
}
