import React, { useEffect } from "react";
import FeatureCard from "../components/FeatureCard";
import f1 from "../assets/f1.png";
import f2 from "../assets/f2.png";
import f3 from "../assets/f3.png";
import f4 from "../assets/f4.png";
import f5 from "../assets/f5.png";
import f6 from "../assets/f6.png";
import f7 from "../assets/f7.png";
import f8 from "../assets/f8.png";

const features = [
  {
    title: "Employee Self-Service Portal",
    description: "Employees can view payslips, update details and request leave.",
    icon:f1,
     iconhover:f2,
  },
  {
    title: "CA Dashboard",
    description:
      "Comprehensive accountant dashboard with reports and analytics.",
      icon:f2,
       iconhover:f2,
  },
  {
    title: "Automated Payslip Generation",
    description: "Generate and email payslips automatically every month.",
    icon:f3,
     iconhover:f2,
  },
  {
    title: "Tax & Compliance Management",
    description: "Automate TDS, PF, and other statutory calculations easily.",
    icon:f4,
     iconhover:f2,
  },
  {
    title: "Secure Data Protection",
    description: "Bank-level encryption and role-based access control.",
    icon:f5,
     iconhover:f2,
  },
  {
    title: "Customizable Reports",
    description: "Build payroll reports tailored to your needs.",
    icon:f6,
     iconhover:f2,
  },
  {
    title: "Email & SMS Notifications",
    description:
      "Send automated updates, reminders, and alerts to employees.",
      icon:f7,
       iconhover:f2,
  },
  {
    title: "Cloud-Based Platform",
    description:
      "Access payroll securely from anywhere with 99.9% uptime.",
      icon:f8,
       iconhover:f2,
  },
];

export default function FeaturesPage() {

   useEffect(() => {
    // Add dark class when this page loads
    document.body.classList.add("dark");

    // Cleanup when you leave this page
    return () => {
      document.body.classList.remove("dark");
    };
  }, []);

  return (
<>
      
   <main
  className="mx-auto max-w-auto px-4 py-10 pt-24 min-h-screen"
  style={{
    background: "linear-gradient(180deg, var(--color-dark) 0%, #0a2238 100%)",
  }}
>
  <div className="mx-auto custom-container">
      <section className="text-center pt-8 pb-16">
      <h1
        className="
          font-[Inter]
          font-normal
          capitalize
          leading-[100%]
          tracking-[2%]
          text-[80px]
          text-white
          inline-block
        "
      >
        FEATURES
      </h1>
    </section>
      {/* HERO SECTION */}
      <section className="relative">
              <div className="absolute inset-0 flex flex-col justify-start gap-4 px-2 pt-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-(--color-light)">
            Everything You Need for Seamless Payroll Management
          </h2>
          <p className="text-white/80 max-w-xl">
            Our platform helps you save time, reduce errors, and provide a
            smooth payroll experience for your employees.
          </p>
        </div>
      </section>

      {/* FEATURE CARDS GRID */}
      <section className="mt-48 sm:mt-74 ">
      <div className="flex flex-wrap content-center  justify-center">
          {features.map((f,index) => (
            <div className="w-full sm:w-1/2 lg:w-1/3 p-3" key={index}>
            <FeatureCard 
            // key={f.index}         
              title={f.title}
              description={f.description}
                icon={f.icon}
                iconhover={f.iconhover}
            />
            </div>
          ))}
        </div>
      </section>
      </div>
    </main>
    </>
  );
}
