import { useMemo, useState } from 'react'
import { usePayslip } from '../../context/PayslipContext'
import { savePayslip } from '../../services/api'


// --- Small UI atoms to match your theme ---
const Label = ({ children, required }) => (
<div className="text-[13px] font-medium text-slate-600 mb-1">{children}{required && ' *'}</div>
)


const Field = ({ label, required, ...props }) => (
<label className="block">
<Label required={required}>{label}</Label>
<input {...props} className={`w-full rounded-lg border px-3 py-2 text-[14px] bg-white/90 focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${props.className||''}`} />
</label>
)


const DateField = (p) => <Field type="date" {...p} />
const NumberField = (p) => <Field type="number" inputMode="decimal" {...p} />


function FormSection({ title, required, children }){
return (
<section className="bg-white rounded-2xl border p-4 md:p-5">
<div className="flex items-baseline justify-between mb-3">
<div className="text-sm font-semibold text-slate-800">{title} {required && <span className="text-red-500">*</span>}</div>
</div>
{children}
</section>
)
}


function UploadLogo({ value, onChange }){
return (
<div className="border-2 border-dashed rounded-xl p-4 grid place-items-center text-center min-h-[110px]">
<div className="text-slate-500 text-xs mb-2">Upload Logo<br/>240×240 (PNG) • Max 2MB</div>
<input type="url" placeholder="https://…/logo.png" value={value} onChange={e=>onChange(e.target.value)} className="w-full max-w-[240px] rounded-lg border px-3 py-2 text-[14px]" />
</div>
)
}


function MoneyCell({ value, onChange, placeholder='0' }){
return (
<input type="number" inputMode="decimal" placeholder={placeholder} value={value}
onChange={e=>onChange(e.target.value)}
className="w-full text-right bg-transparent outline-none"/>
)
}


function TableHeader(){
return (
<div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[13px] text-slate-500 border-b pb-2">
<div>Earnings</div>
<div className="text-right md:text-left">Amount</div>
<div className="md:border-l md:pl-4">Deductions</div>
<div className="text-right">Amount</div>
</div>
)
}


// --- The themed PayslipForm ---
export default function PayslipForm(){
const { company, setCompany, employee, setEmployee, period, setPeriod, earnings, setEarnings, deductions, setDeductions, totals } = usePayslip()
const [saving, setSaving] = useState(false)
const [msg, setMsg] = useState('')


const addRow = (setFn) => setFn(prev=>[...prev,{label:'',amount:''}])
const removeRow = (setFn, i) => setFn(prev=> prev.length>1 ? prev.filter((_,idx)=>idx!==i) : prev)
}