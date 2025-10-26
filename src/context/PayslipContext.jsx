import React, { createContext, useContext, useMemo, useState } from 'react'


const PayslipCtx = createContext(null)
export const usePayslip = () => useContext(PayslipCtx)


export default function PayslipProvider({ children }){
const [company, setCompany] = useState({ name:'', email:'', address:'', logoUrl:'' })
const [employee, setEmployee] = useState({ name:'', code:'', designation:'' })
const [period, setPeriod] = useState({ month:'', year:'', payDate:'' })
const [earnings, setEarnings] = useState([{ label:'Basic', amount:'' }])
const [deductions, setDeductions] = useState([{ label:'PF', amount:'' }])


const totals = useMemo(()=>{
const te = earnings.reduce((s,e)=>s+(parseFloat(e.amount)||0),0)
const td = deductions.reduce((s,d)=>s+(parseFloat(d.amount)||0),0)
return { totalEarnings: te, totalDeductions: td, net: te-td }
}, [earnings, deductions])


const value = {
company, setCompany,
employee, setEmployee,
period, setPeriod,
earnings, setEarnings,
deductions, setDeductions,
totals,
}
return <PayslipCtx.Provider value={value}>{children}</PayslipCtx.Provider>
}