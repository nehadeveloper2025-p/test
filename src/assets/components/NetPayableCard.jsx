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
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
    "seventeen", "eighteen", "nineteen",
  ];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  const two = (n) => {
    if (n < 20) return ones[n];
    const t = Math.floor(n / 10), o = n % 10;
    return [tens[t], ones[o]].filter(Boolean).join(" ");
  };
  const three = (n) => {
    const h = Math.floor(n / 100), r = n % 100;
    return [h ? ones[h] + " hundred" : "", r ? two(r) : ""].filter(Boolean).join(" ");
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
  const totalEarnings   = earnings.reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalDeductions = deductions.reduce((s, d) => s + Number(d.amount || 0), 0);
  const net = Math.max(0, totalEarnings - totalDeductions);

  return (
    <div className="rounded-xl border p-4 md:p-5 text-[#0f2a44] shadow-sm mt-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[20px] md:text-[22px] font-semibold leading-snug">
            Total Net Payable
          </div>
          <div className="text-sm text-slate-600">
            (Gross Earning–Total Deduction)
          </div>
        </div>

        <div className="text-right">
          <div className="text-[18px] md:text-[20px] font-extrabold tabular-nums">
            {inr.format(net)}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#10324F]/30 flex items-baseline justify-between">
        <span className="text-slate-600">Amount in words:</span>
        <span className="text-sm md:text-base font-medium text-[#0f2a44]">
          {inrToWords(net).replace(/^./, (c) => c.toUpperCase())}
        </span>
      </div>
    </div>
  );
}
