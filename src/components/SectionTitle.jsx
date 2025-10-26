export default function SectionTitle({ title, subtitle }){
return (
<div className="text-center py-6 md:py-8">
<p className="uppercase text-xs tracking-[0.3em] text-slate-500">{subtitle}</p>
<h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-2">{title}</h2>
</div>
)
}