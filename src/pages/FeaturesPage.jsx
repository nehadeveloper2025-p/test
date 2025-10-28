import React from "react";
import f1 from "../assets/f1.png";
import f2 from "../assets/f2.png";
import f3 from "../assets/f3.png";
import f4 from "../assets/f4.png";
import f5 from "../assets/f5.png";
import f6 from "../assets/f6.png";
import f7 from "../assets/f7.png";
import f8 from "../assets/f8.png";

export default function FeaturesPage() {
  return (
    <section style={{ minHeight: "100vh", padding: "2rem", background: "#f0f0f0" }}>
      <main
        className="mx-auto max-w-screen-lg px-4 py-10 pt-24 min-h-screen"
       
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

          <section className="relative text-center mb-48">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need for Seamless Payroll Management
            </h2>
            <p className="text-white/80 max-w-xl mx-auto">
              Our platform helps you save time, reduce errors, and provide a smooth payroll experience for your employees.
            </p>
          </section>

          {/* FEATURES GRID */}
          <section className="relative px-4 py-10">
  {/* Ellipse background */}
  <div
    style={{
      position: "absolute",
      width: "1622px",
      height: "486px",
      top: "3008px",
      left: "-120px",
      background: "linear-gradient(180deg, #537086 11.9%, #10324F 68.25%)",
      borderRadius: "50% / 100%", // ellipse horizontally stretched
      opacity: 0.8,
      zIndex: 0,
      transform: "translateY(-3000px)" // Adjust vertical position as needed
    }}
  />

  {/* Content container with relative and higher z-index */}
  <div className="relative z-10 flex flex-wrap justify-center gap-6">
          <section className="flex flex-wrap justify-center gap-6 px-4">
  {/* Each feature card has fixed width for lg and responsive widths */}
  
  {/* Feature 1 */}
  <div className="w-full sm:w-1/2 lg:w-[30%] bg-white p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition cursor-pointer">
    <img src={f1} alt="Employee Self-Service Portal" className="mx-auto mb-4" />
    <h3 className="font-bold mb-2">Employee Self-Service Portal</h3>
    <p>Employees can view payslips, update details and request leave.</p>
  </div>

  {/* Feature 2 */}
  <div className="w-full sm:w-1/2 lg:w-[30%] bg-white p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition cursor-pointer">
    <img src={f2} alt="CA Dashboard" className="mx-auto mb-4" />
    <h3 className="font-bold mb-2">CA Dashboard</h3>
    <p>Comprehensive accountant dashboard with reports and analytics.</p>
  </div>

  {/* Feature 3 */}
  <div className="w-full sm:w-1/2 lg:w-[30%] bg-white p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition cursor-pointer">
    <img src={f3} alt="Automated Payslip Generation" className="mx-auto mb-4" />
    <h3 className="font-bold mb-2">Automated Payslip Generation</h3>
    <p>Generate and email payslips automatically every month.</p>
  </div>

  {/* Feature 4 */}
  <div className="w-full sm:w-1/2 lg:w-[30%] bg-white p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition cursor-pointer">
    <img src={f4} alt="Tax & Compliance Management" className="mx-auto mb-4" />
    <h3 className="font-bold mb-2">Tax & Compliance Management</h3>
    <p>Automate TDS, PF, and other statutory calculations easily.</p>
  </div>

  {/* Feature 5 */}
  <div className="w-full sm:w-1/2 lg:w-[30%] bg-white p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition cursor-pointer">
    <img src={f5} alt="Secure Data Protection" className="mx-auto mb-4" />
    <h3 className="font-bold mb-2">Secure Data Protection</h3>
    <p>Bank-level encryption and role-based access control.</p>
  </div>

  {/* Feature 6 */}
  <div className="w-full sm:w-1/2 lg:w-[30%] bg-white p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition cursor-pointer">
    <img src={f6} alt="Customizable Reports" className="mx-auto mb-4" />
    <h3 className="font-bold mb-2">Customizable Reports</h3>
    <p>Build payroll reports tailored to your needs.</p>
  </div>

  {/* Feature 7 */}
  <div className="w-full sm:w-1/2 lg:w-[30%] bg-white p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition cursor-pointer">
    <img src={f7} alt="Email & SMS Notifications" className="mx-auto mb-4" />
    <h3 className="font-bold mb-2">Email & SMS Notifications</h3>
    <p>Send automated updates, reminders, and alerts to employees.</p>
  </div>

  {/* Feature 8 */}
  <div className="w-full sm:w-1/2 lg:w-[30%] bg-white p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition cursor-pointer">
    <img src={f8} alt="Cloud-Based Platform" className="mx-auto mb-4" />
    <h3 className="font-bold mb-2">Cloud-Based Platform</h3>
    <p>Access payroll securely from anywhere with 99.9% uptime.</p>
  </div>
</section>
</div>
</section>

        </div>
      </main>
    </section>
  );
}
