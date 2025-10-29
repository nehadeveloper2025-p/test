import React, { useState } from "react";
import f8 from "../assets/bluecircle.png";
import { FaChevronDown } from "react-icons/fa";

const FAQ = () => {
const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const data = [
    {
      title: "Ed Ut Perspiciatis, Unde Omnis Iste Natus Error Sit Voluptatem ?",
      content:
        "Estate Vitae Dicta Sunt, Explicabo. Nemo Enim Ipsam Voluptatem, Quia Voluptas Sit, Aspernatur Aut Odit Aut Fugit, Sed Quia Consequuntur Magni Doe Vitae Dicta Sunt, Explicabo. Nemo Enim Ipsam Voluptatem, Quia Voluptas Sit, Aspernatur Aut Odit Aut Fugit, Sed Quia Consequuntur Magni Do.",
    },
    {
      title: "Ed Ut Perspiciatis, Unde Omnis Iste Natus Error Sit Voluptatem ?",
      content:
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.",
    },
    {
      title: "Ed Ut Perspiciatis, Unde Omnis Iste Natus Error Sit Voluptatem ?",
      content:
        "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    },
    {
      title: "Ed Ut Perspiciatis, Unde Omnis Iste Natus Error Sit Voluptatem ?",
      content:
        "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur.",
    },
  ];

  return (
    <>
    <div className="max-w-2xl mx-auto space-y-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl shadow-md overflow-hidden transition-all duration-300"
        >
          {/* Header */}
          <button
            onClick={() => toggle(index)}
            className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 font-medium hover:bg-white/60"
          >
            <span>{item.title}</span>
            <FaChevronDown
              className={`text-gray-600 transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Body */}
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              openIndex === index
                ? "grid-rows-[1fr] opacity-100 px-6 pb-4"
                : "grid-rows-[0fr] opacity-0 px-6"
            }`}
          >
            <div className="overflow-hidden text-gray-600 text-sm">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};
{/* //     <div className="max-w-2xl mx-auto p-6">
//       <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>

//       <div className="space-y-4">
//         {faqs.map((faq, index) => (
//           <div
//             key={index}
//             className="border border-gray-200 rounded-lg p-4 shadow-sm"
//           >
//             <button
//               onClick={() => toggleFAQ(index)}
//               className="flex justify-between w-full text-left font-semibold text-gray-800"
//             >
//               {faq.question}
//               <span>{openIndex === index ? "−" : "+"}</span>
//             </button>

//             {openIndex === index && (
//               <p className="mt-2 text-gray-600">{faq.answer}</p>
//             )}
//           </div>
//         ))}
//       </div>
//   <div className="relative p-12 overflow-hidden bg-gray-100 rounded-lg">     
//       <div
//         className="
//           before:content-['']
//           before:absolute before:inset-0
//           before:bg-[url('../assets/bluecircle.png')]
//           before:bg-cover before:bg-center
//           before:-z-10
//         "
//       >
//         <h1 className="text-3xl font-bold text-black mb-4 drop-shadow-md">
//           Image Behind Div
//         </h1>
//         <p className="text-lg text-black">
//           This text is placed on top of the background image. The content is positioned
//           relative to the parent `div` and has a higher stacking order.
//         </p>
//       </div>
//     </div>

//     <div class="flex flex-col gap-12">
//   <div class="relative">
//     <div class="p-6 bg-white shadow rounded">Step 1 content</div>
//   </div>

//   <div class="relative">
//     <img
//       src={f8}
//       alt=""
//       class="pointer-events-none select-none absolute z-0 top-3 right-1 w-16 h-16 object-contain opacity-90 drop-shadow-[0_12px_30px_rgba(16,50,79,0.35)]"
//     />
//     <div class=" text-6xl relative z-10 p-6 bg-transparent  rounded">Frequent Asked</div>
//   </div>

//   <div class="relative">
//     <div class="p-6 bg-white shadow rounded">Step 3 content</div>
//   </div>

//   <div class="relative">
//     <img
//       src="bg-image.png"
//       alt=""
//       class="pointer-events-none select-none absolute z-0 -top-3 -left-4 w-10 h-10 object-contain opacity-90 drop-shadow-[0_12px_30px_rgba(16,50,79,0.35)]"
//     />
//     <div class="relative z-10 p-6 bg-white shadow rounded">Step 4 content</div>
//   </div>

//   <div class="relative">
//     <div class="p-6 bg-white shadow rounded">Step 5 content</div>
//   </div>
// </div>

//     </div> */}

 
export default FAQ;
