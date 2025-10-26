import React, { useMemo, useState } from 'react'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050'
export default function App(){
const [drawerOpen, setDrawerOpen] = useState(true)
const [theme, setTheme] = useState({ hue: 215 })
const hue = theme.hue
const brand = useMemo(() => ({
bg: `hsl(${hue} 100% 98%)`,
fg: `hsl(${hue} 55% 16%)`,
cta: `hsl(${hue} 90% 50%)`,
}), [hue])
return (
<div style={{'--h': hue}} className="min-h-dvh">
<Navbar onOpen={() => setDrawerOpen(false)} />
{/* <Hero brand={brand} onGetStarted={() => {
document.getElementById('form').scrollIntoView({behavior:'smooth'})
}} /> */}
<main className="relative">
<SectionTitle title="FREE PAYSLIP GENERATOR" subtitle="Smart payslips,
every time" />
<div className="mx-auto max-w-6xl px-4 grid md:grid-cols-[1fr_360px]
gap-6">
<PayslipForm />
{/* <StickyInfoPanel /> */}
</div>
</main>
<RightDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
theme={theme} setTheme={setTheme} />
<Footer />
</div>
)
}
function Navbar({ onOpen }){
return (
<header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b
border-slate-200/60">
<div className="mx-auto max-w-6xl flex items-center justify-between px-4
py-2">
<div className="flex items-center gap-2">
<div className="size-8 rounded-full bg-slate-900 grid place-contentcenter text-white text-xs"></div>
<span className="font-semibold tracking-tight">PaySlip</span>
</div>
<nav className="hidden md:flex items-center gap-6 text-sm textslate-600">
<a href="#" className="hover:text-slate-900">Home</a>
<a href="#" className="hover:text-slate-900">Features</a>
<a href="#" className="hover:text-slate-900">Pricing</a>
</nav>
<div className="flex items-center gap-2">
{/* <button className="px-3 py-1.5 text-sm rounded-xl border"
onClick={onOpen}>Customize</button> */}
<button className="px-3 py-1.5 text-sm rounded-xl bg-slate-900 textwhite">Login</button>
</div>
</div>
</header>
)
}

function Hero({ brand, onGetStarted }){
return (
<section className="relative overflow-hidden">
<div className="absolute inset-0 -z-10 opacity-70" style={{
background:`radial-gradient(1200px 500px at 50% -10%, hsl(var(--h) 100% 92%), transparent
50%), radial-gradient(800px 300px at 80% 20%, white, transparent 60%)`
}} />
<div className="mx-auto max-w-6xl px-4 py-12 md:py-20 grid md:grid-cols-2
items-center gap-6">
<div>
<h1 className="text-5xl md:text-6xl font-extrabold tracking-tight
text-slate-900/90 leading-tight">
E<span className="opacity-20">PAYSLIP</span>
</h1>
<p className="mt-3 max-w-prose text-slate-600">
Generate beautiful, accurate payslips in seconds. Save to the
cloud, export PDF, and keep compliant records.
</p>
<div className="mt-6 flex items-center gap-3">
<button onClick={onGetStarted} className="px-5 py-2 rounded-2xl bg-
slate-900 text-white shadow">Get Started</button>
<button className="px-5 py-2 rounded-2xl border">Sign Up</button>
</div>
</div>
<div className="glass rounded-3xl p-4 md:p-6">
<SampleCard />
</div>
</div>
</section>
)
}
function SampleCard(){
return (
<div className="grid grid-cols-[64px_1fr] gap-4 items-center">
<div className="size-16 rounded-2xl bg-slate-900/90 text-white grid place-
content-center">👩💼</div>
<div>
<div className="font-semibold">Florida Health Payroll Sample</div>
<p className="text-xs text-slate-600">Preview of a modern payslip layout
—custom logo, earnings, deductions, totals.</p>
</div>
</div>
)
}
function SectionTitle({ title, subtitle }){
return (
<div className="text-center py-6 md:py-8">
<p className="uppercase text-xs tracking-[0.3em] text-
slate-500">{subtitle}</p>
<h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-2">{title}</h2>
</div>
)
}
function StickyInfoPanel(){
return (
<aside className="hidden md:block sticky top-24 h-fit">
<div className="space-y-3">
{[
['Company Details','Name, address, logo'],
['Employee Details','Name, ID, designation'],
['Earnings / Deductions','Add custom rows'],
['Net Pay','Auto-calculated'],
['Pay Period / Dates','Month, year, pay date'],
].map(([title,desc]) => (
<div key={title} className="glass rounded-2xl p-4">
<div className="font-medium">{title}</div>
<div className="text-xs text-slate-600">{desc}</div>
</div>
))}
</div>
</aside>
)
}
function PayslipForm(){
const [loading, setLoading] = useState(false)
const [msg, setMsg] = useState('')
const [company, setCompany] = useState({ name: '', email:'',phoneno:'', address:'',
logoUrl:'',city:'',state:'',zip:'',Country:'' })
const [employee, setEmployee] = useState({ name:'', code:'', designation:'' })
const [period, setPeriod] = useState({ month:'', year:'', payDate:'' })
const [earnings, setEarnings] = useState([{ label:'Basic', amount:'' }])
const [deductions, setDeductions] = useState([{ label:'PF', amount:'' }])
const totalEarnings = earnings.reduce((s,e)=>s+(parseFloat(e.amount)||0),0)
const totalDeductions = deductions.reduce((s,d)=>s+(parseFloat(d.amount)||0),
0)
const net = totalEarnings - totalDeductions
const addRow = (setFn) => setFn(prev=>[...prev,{label:'',amount:''}])
const removeRow = (setFn, i) => setFn(prev=> prev.length>1 ?
prev.filter((_,idx)=>idx!==i) : prev)
const updateRow = (setFn, i, key, val) => setFn(prev => prev.map((r,idx)=>
idx===i? {...r,[key]:val} : r))
async function handleSubmit(e){
e.preventDefault()
setLoading(true); setMsg('')
try {
const payload = { company, employee, period, earnings, deductions,
totals: { totalEarnings, totalDeductions, net } }
const res = await fetch(`${API_URL}/api/payslips`,{
method:'POST', headers:{'Content-Type':'application/json'}, body:
JSON.stringify(payload)
})
const data = await res.json()
if(!res.ok) throw new Error(data?.message||'Failed')
setMsg('Saved! Payslip ID: '+data._id)
} catch(err){ setMsg(err.message) } finally { setLoading(false) }
}
return (
<form id="form" onSubmit={handleSubmit} className="space-y-4">
<div className="glass rounded-3xl p-5">
<div className="text-sm font-semibold mb-3">Company</div>
<div className="grid md:grid-cols-2 gap-3">

<Input  value={company.name}  placeholder="Companyname"
onChange={v=>setCompany({...company,name:v})} />
<Input placeholder="email" type="email" value={company.email}
onChange={v=>setCompany({...company,email:v})} />
<Input placeholder="phoneno"  value={company.phoneno}
onChange={v=>setCompany({...company,phoneno:v})} />
<Input placeholder="Address" value={company.address}
onChange={v=>setCompany({...company,address:v})} />
<Input label="City" value={company.city}
onChange={v=>setCompany({...company,city:v})} />
<Input label="State" value={company.state}
onChange={v=>setCompany({...company,state:v})} />
<Input label="ZIP Code" value={company.zip}
onChange={v=>setCompany({...company,zip:v})} />
<Input label="Country" value={company.country}
onChange={v=>setCompany({...company,country:v})} />

</div>
</div>
<div className="glass rounded-3xl p-5">
<div className="text-sm font-semibold mb-3">Employee</div>
<div className="grid md:grid-cols-3 gap-3">
<Input label="Name" value={employee.name}
onChange={v=>setEmployee({...employee,name:v})} />
<Input label="Code" value={employee.code}
onChange={v=>setEmployee({...employee,code:v})} />
<Input label="Designation" value={employee.designation}
onChange={v=>setEmployee({...employee,designation:v})} />
</div>
</div>
<div className="glass rounded-3xl p-5">
<div className="text-sm font-semibold mb-3">Pay Period</div>
<div className="grid md:grid-cols-3 gap-3">
<Input label="Month" placeholder="e.g. January" value={period.month}
onChange={v=>setPeriod({...period,month:v})} />
<Input label="Year" type="number" value={period.year}
onChange={v=>setPeriod({...period,year:v})} />
<Input label="Pay Date" type="date" value={period.payDate}
onChange={v=>setPeriod({...period,payDate:v})} />
</div>
</div>
<div className="glass rounded-3xl p-5 space-y-4">
<SectionSub title="Earnings" total={totalEarnings} />
{earnings.map((row,i)=> (
<Row key={i} row={row} onChange={(k,v)=>updateRow(setEarnings,i,k,v)}
onRemove={()=>removeRow(setEarnings,i)} />
))}
<button type="button" className="px-3 py-1.5 rounded-xl border"
onClick={()=>addRow(setEarnings)}>+ Add earning</button>
</div>
<div className="glass rounded-3xl p-5 space-y-4">
<SectionSub title="Deductions" total={totalDeductions} />
{deductions.map((row,i)=> (
<Row key={i} row={row}
onChange={(k,v)=>updateRow(setDeductions,i,k,v)}
onRemove={()=>removeRow(setDeductions,i)} />
))}
<button type="button" className="px-3 py-1.5 rounded-xl border"
onClick={()=>addRow(setDeductions)}>+ Add deduction</button>
</div>
<div className="glass rounded-3xl p-5">
<div className="flex items-center justify-between">
<div className="font-semibold">Net Pay</div>
<div className="text-2xl font-extrabold">₹ {Number.isFinite(net)?
net.toFixed(2):'0.00'}</div>
</div>
</div>
<div className="flex items-center gap-3">
<button disabled={loading}
className="px-5 py-2 rounded-2xl bg-slate-900 text-white
disabled:opacity-60">{loading?'Saving...':'Save to Mongo'}</button>
<span className="text-sm text-slate-600">{msg}</span>
</div>
</form>
)
}
function Input({ label, onChange, value, type='text', placeholder='' }){
return (
<label className="block text-sm">
<span className="text-slate-600">{label}</span>
<input type={type} placeholder={placeholder}
className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-
white/80 focus:outline-none focus:ring-2 focus:ring-slate-900/20" value={value}
onChange={e=>onChange(e.target.value)} />
</label>
)
}
function Row({ row, onChange, onRemove }){
return (
<div className="grid grid-cols-[1fr_160px_40px] gap-3 items-end">
<Input label="Label" value={row.label} onChange={v=>onChange('label',v)} />
<Input label="Amount" type="number" value={row.amount}
onChange={v=>onChange('amount',v)} />
<button type="button" className="h-10 rounded-xl border"
onClick={onRemove}>✕</button>
</div>
)
}
function SectionSub({ title, total }){
return (
<div className="flex items-center justify-between">
<div className="font-semibold">{title}</div>
<div className="text-sm text-slate-500">Total: {Number(total).toFixed(2)}
</div>
</div>
)
}
function Footer(){
return (
<footer className="mt-12 py-8 text-center text-xs text-slate-500">
© {new Date().getFullYear()} Smart Payslip — All rights reserved.
</footer>
)
}
function RightDrawer({ open, onClose, theme, setTheme }){
return (
<div className={`fixed top-0 right-0 h-full w-[360px] bg-white shadow-2xl border-l drawer ${open?'open':'closed'} z-50`}>
<div className="flex items-center justify-between px-4 py-3 border-b">
<div className="font-semibold">Customizer</div>
<button className="rounded-xl border px-3 py-1" onClick={onClose}
>Close</button>
</div>
<div className="p-4 space-y-6">
<div>
<div className="text-sm text-slate-600 mb-2">Brand Hue</div>
<input type="range" min="190" max="260" value={theme.hue}
onChange={e=>setTheme({...theme, hue: Number(e.target.value)})} />
<div className="text-xs text-slate-500">Adjust page accent color.</div>
</div>
<div className="glass rounded-2xl p-4">
<div className="text-sm font-medium">PDF Header/Footer</div>
<p className="text-xs text-slate-600">Store preferences here and
apply when exporting PDFs (hook later).</p>
</div>
</div>
</div>
)
}