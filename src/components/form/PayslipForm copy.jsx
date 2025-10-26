function PayslipForm(){
const [loading, setLoading] = useState(false)
const [msg, setMsg] = useState('')
const [company, setCompany] = useState({ name: '', email:'', address:'',
logoUrl:'' })
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
<Input label="Name" value={company.name}
onChange={v=>setCompany({...company,name:v})} />
<Input label="Email" type="email" value={company.email}
onChange={v=>setCompany({...company,email:v})} />
<Input label="Address" value={company.address}
onChange={v=>setCompany({...company,address:v})} />
<Input label="Logo URL" value={company.logoUrl}
onChange={v=>setCompany({...company,logoUrl:v})} />
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