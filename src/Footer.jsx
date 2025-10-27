import React from "react";
import {
  FaTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="py-10 px-6 relative bg-(--color-dark)">
      <div className="mx-auto custom-container">
        <div className="relative rounded-xl p-8 md:p-10 backdrop-blur-[35px] bg-[#FFFFFF1A] border border-white/20">
          {/* Top Row */}
          <div className="flex flex-col md:flex-row gap-8 md:items-start border-b border-gray-500 pb-6 ">
            {/* Logo */}
            <div className="w-full md:w-1/5 flex justify-center md:justify-start">
              <img
                src="/epaysliplogo.png"
                alt="ePay Slip Logo"
                className="w-32 object-contain"
              />
            </div>

            {/* Paragraph */}
            <div className="w-full md:w-3/5 text-center md:text-left">
              <p className="text-gray-300 max-w-80 mx-auto md:mx-0 text-sm">
                Designed for companies and professionals to streamline salary
                processing and access records anytime, anywhere.
              </p>
            </div>

            {/* Social Icons */}
            <div className="w-full md:w-1/5 flex justify-center md:justify-start mt-4 md:mt-0">
              <div className="flex gap-3">
                <a
                  href="#"
                  className="bg-white text-[#10324f] p-2 rounded-full hover:bg-blue-600 hover:text-white transition"
                >
                  <FaTwitter size={12} />
                </a>
                <a
                  href="#"
                  className="bg-white text-[#10324f] p-2 rounded-full hover:bg-blue-600 hover:text-white transition"
                >
                  <FaLinkedinIn size={12} />
                </a>
                <a
                  href="#"
                  className="bg-white text-[#10324f] p-2 rounded-full hover:bg-blue-600 hover:text-white transition"
                >
                  <FaFacebookF size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row mt-8 gap-8">
            {/* Empty space for alignment (on desktop) */}
            <div className="hidden md:block w-1/5"></div>

            {/* Quick Links + Support */}
            <div className="w-full md:w-3/5 text-center md:text-left">
              <div className="flex flex-col sm:flex-row justify-between gap-8">
                {/* Quick Links */}
                <div className="sm:w-1/2">
                  <h3 className="text-white font-semibold mb-3">Quick Links</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>
                      <a href="#" className="hover:underline">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:underline">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:underline">
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:underline">
                        Features
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div className="sm:w-1/2">
                  <h3 className="text-white font-semibold mb-3">Support</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>
                      <a href="#" className="hover:underline">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:underline">
                        Cookies Policy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:underline">
                        Terms & Conditions
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:underline">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="w-full md:w-1/5">
              <div className="space-y-4 text-sm text-gray-300">
                {/* Email */}
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="bg-white p-2 rounded-full text-[#10324f] group-hover:bg-blue-600 group-hover:text-white transition">
                    <FaEnvelope size={12} />
                  </div>
                  <span className="group-hover:text-white transition">
                    Email: Epayslip@gmail.com
                  </span>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="bg-white p-2 rounded-full text-[#10324f] group-hover:bg-blue-600 group-hover:text-white transition">
                    <FaPhone size={12} />
                  </div>
                  <span className="group-hover:text-white transition">
                    Phone: 656494890
                  </span>
                </div>

                {/* Address */}
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="bg-white p-2 rounded-full text-[#10324f] group-hover:bg-blue-600 group-hover:text-white transition">
                    <FaMapMarkerAlt size={12} />
                  </div>
                  <span className="group-hover:text-white transition">
                    Ajit Singh Nagar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>

    //   <footer className="py-10 px-12 lg:px-16 relative bg-[#294965]">
    //     {/* ✅ Blue Background with pattern image on right */}
    //     {/* <div className="absolute inset-0 -z-10 bg-[#143E72]">
    //       <img
    //         src="/footer-pattern.png" // <-- Replace with your right-side curved background image
    //         alt="Footer Background Pattern"
    //         className="w-32 object-contain shrink-0"
    //       />
    //     </div> */}

    //     {/* ✅ Footer content box with border and rounded corners */}
    //     <div className="relative rounded-xl p-8 md:p-12 backdrop-blur-[35px] bg-[#FFFFFF1A] border border-white/20">
    //       {/* Top Section */}
    //       <div className="flex flex-col md:flex-row md:items-center md:justify-between text-center md:text-left border-[#FFFFFF] pb-6">
    //         {/* Logo + Text */}
    //         <div className="flex flex-col items-center md:items-start space-y-3">
    //           <img
    //             src="/epaysliplogo.png" // ✅ Ensure correct file name
    //             alt="ePay Slip Logo"
    //             className="w-32 object-contain"
    //           />
    //           <p className="text-gray-200 text-sm text-right">
    //             Designed for companies and professionals to streamline salary
    //             processing and access records anytime, anywhere.
    //           </p>
    //         </div>

    //         {/* Social Icons */}
    //         <div className="flex justify-end md:justify-end mt-6 md:mt-0">
    //           <a href="#" className="hover:text-blue-400 transition">
    //             <FaTwitter size={20} />
    //           </a>
    //           <a href="#" className="hover:text-blue-400 transition">
    //             <FaLinkedinIn size={20} />
    //           </a>
    //           <a href="#" className="hover:text-blue-400 transition">
    //             <FaFacebookF size={20} />
    //           </a>
    //         </div>
    //       </div>

    //       {/* Bottom Section */}
    //       <div className="flex justify-end mt-8 pl-10">
    //       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-left justify-end  md:ml-auto md:mr-0">
    // {/* Quick Links */}
    // <div>
    //   <h3 className="font-semibold mb-3">Quick Links</h3>
    //   <ul className="space-y-2 text-sm text-gray-300">
    //     <li><a href="#" className="hover:underline">About Us</a></li>
    //     <li><a href="#" className="hover:underline">Blog</a></li>
    //     <li><a href="#" className="hover:underline">Pricing</a></li>
    //     <li><a href="#" className="hover:underline">Features</a></li>
    //   </ul>
    // </div>

    // {/* Support */}
    // <div>
    //   <h3 className="font-semibold mb-3">Support</h3>
    //   <ul className="space-y-3 text-sm text-gray-300">
    //     <li><a href="#" className="hover:underline">Privacy Policy</a></li>
    //     <li><a href="#" className="hover:underline">Cookies Policy</a></li>
    //     <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
    //     <li><a href="#" className="hover:underline">Contact Us</a></li>
    //   </ul>
    // </div>

    // {/* Contact */}
    // <div className="space-y-4 text-sm text-gray-300">
    //   <div className="flex items-center space-x-3">
    //     <FaEnvelope className="text-blue-400" />
    //     <span>Email: Epayslip@gmail.com</span>
    //   </div>
    //   <div className="flex items-center space-x-3">
    //     <FaPhone className="text-blue-400" />
    //     <span>Phone Number: 656494890</span>
    //   </div>
    //   <div className="flex items-center space-x-3">
    //     <FaMapMarkerAlt className="text-blue-400" />
    //     <span>Office Address: Ajit Singh Nagar</span>
    //   </div>
    // </div>
    //       </div>
    //       </div>

    //     </div>
    //   </footer>
  );
}
