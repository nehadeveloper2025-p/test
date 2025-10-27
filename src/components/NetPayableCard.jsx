// ---- utils: INR formatting + words (up to 99,99,99,999) ----
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function inrToWords(num) {
  num = Math.round(Number(num) || 0);
  if (num === 0) return "zero rupees";

  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const two = (n) => {
    if (n < 20) return ones[n];
    const t = Math.floor(n / 10),
      o = n % 10;
    return [tens[t], ones[o]].filter(Boolean).join(" ");
  };
  const three = (n) => {
    const h = Math.floor(n / 100),
      r = n % 100;
    return [h ? ones[h] + " hundred" : "", r ? two(r) : ""]
      .filter(Boolean)
      .join(" ");
  };

  // Indian system: crore, lakh, thousand, hundred
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = num % 1000;

  const parts = [];
  if (crore) parts.push(three(crore) + " crore");
  if (lakh) parts.push(three(lakh) + " lakh");
  if (thousand) parts.push(three(thousand) + " thousand");
  if (hundred) parts.push(three(hundred));

  return parts.join(" ").trim() + " rupees";
}

// ---- Card component ----
export function NetPayableCard({ earnings = [], deductions = [] }) {
  const totalEarnings = earnings.reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalDeductions = deductions.reduce(
    (s, d) => s + Number(d.amount || 0),
    0
  );
  const net = Math.max(0, totalEarnings - totalDeductions);

  return (
    <>
      <div className="rounded-lg border border-[#10324F]/40 p-3 sm:p-4 shadow-sm mt-2">
        {/* 2-col layout: left grows, right stays as tight as needed */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
          {/* LEFT: title + hint (title never shrinks, hint truncates on mobile) */}
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="shrink-0 text-[14px] sm:text-[16px] font-semibold leading-snug text-[#0f2a44]">
                Total Net Payable
              </span>
              {/* Hide the hint on very small screens; show from sm and up */}
              <span
                className="hidden sm:inline truncate text-[12px] sm:text-[13px] text-slate-600"
                title="(Gross Earning – Total Deduction)"
              >
                (Gross Earning – Total Deduction)
              </span>
            </div>
          </div>

          {/* RIGHT: amount + words (no wrap for amount, clamp words) */}
          <div className="text-right shrink-0">
            <div className="text-sm sm:text-base font-extrabold tabular-nums text-[#0f2a44] whitespace-nowrap">
              {inr.format(net)}
            </div>

            {/* Constrain width on mobile so it doesn't push layout; expand on sm+ */}
            <span className="block text-[11px] sm:text-sm font-medium text-[#0f2a44] whitespace-nowrap overflow-hidden text-ellipsis max-w-[55vw] sm:max-w-none">
              {inrToWords(net).replace(/^./, (c) => c.toUpperCase())}
            </span>
          </div>
        </div>
      </div>

      {/* <div className="rounded-lg border border-[#10324F]/40 p-2 md:p-2 shadow-sm mt-2">
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-baseline gap-2 min-w-0">
  <span className="shrink-0 text-[15px] sm:text-[16px] font-semibold leading-snug text-[#0f2a44]">
    Total Net Payable
  </span>
  <span
    className="flex-1 truncate text-xs sm:text-[13px] text-slate-600"
    title="(Gross Earning – Total Deduction)"
  >
    (Gross Earning – Total Deduction)
  </span>
</div>


    //  RIGHT: amount + words (no wrap) 
    <div className="text-right shrink-0 max-w-[55%] sm:max-w-none">
      <div className="text-sm sm:text-base font-extrabold tabular-nums text-[#0f2a44] whitespace-nowrap">
        {inr.format(net)}
      </div>
      <span className="block text-[11px] sm:text-sm font-medium text-[#0f2a44] whitespace-nowrap overflow-hidden text-ellipsis">
        {inrToWords(net).replace(/^./, (c) => c.toUpperCase())}
      </span>
    </div>
  </div>
</div> */}
    </>
  );
}
