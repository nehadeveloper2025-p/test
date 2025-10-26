function SampleCard(){
return (
<div className="grid grid-cols-[64px_1fr] gap-4 items-center">
<div className="size-16 rounded-2xl bg-slate-900/90 text-white grid place-content-center">👩‍💼</div>
<div>
<div className="font-semibold">Florida Health Payroll Sample</div>
<p className="text-xs text-slate-600">Preview of a modern payslip layout—custom logo, earnings, deductions, totals.</p>
</div>
</div>
)
}


export default function Hero({ onGetStarted }){
return (
    <>
       <section className="hero bg-transparent text-center pt-8 pb-16">
      <h1
        className="
          font-[Inter]
          font-normal
          capitalize
          leading-[100%]
          tracking-[2%]
          text-[80px]
          sm:text-[150px]
          md:text-[250px]
          text-white
          inline-block
        "
        style={{
         WebkitMaskImage: "linear-gradient(to bottom, white 20%, transparent 90%)",
          maskImage:
            "linear-gradient(to bottom, white 30%, rgba(255,255,255,0.7) 60%, transparent 100%)",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      >
        EPAYSLIP
      </h1>
    </section>
       <section className="relative bg-[#D1DFEA] pt-20 pb-40 text-center overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 text-white relative z-10">
        <h1 className="text-5xl font-bold mb-4">SMART PAYSLIPS, EVERY TIME</h1>
        <p className="text-lg">Manage your payroll efficiently and securely.</p>
      </div>

    
    </section>

</>
)
}