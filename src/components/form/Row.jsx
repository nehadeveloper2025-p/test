import Input from './Input'
export default function Row({ row, onChange, onRemove }){
return (
<div className="grid grid-cols-[1fr_160px_40px] gap-3 items-end">
<Input label="Label" value={row.label} onChange={v=>onChange('label',v)} />
<Input label="Amount" type="number" value={row.amount} onChange={v=>onChange('amount',v)} />
<button type="button" className="h-10 rounded-xl border" onClick={onRemove}>✕</button>
</div>
)
}