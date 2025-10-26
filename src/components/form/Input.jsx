export default function Input({ label, onChange, value, type='text', placeholder='' }){
return (
<label className="block text-sm">
<span className="text-slate-600">{label}</span>
<input type={type} placeholder={placeholder}
className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-slate-900/20" value={value}
onChange={e=>onChange(e.target.value)} />
</label>
)
}