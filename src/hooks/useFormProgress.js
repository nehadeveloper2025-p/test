import { useMemo } from "react";

export default function useFormProgress({
  company,
  employee,
  period,
  earnings,
  deductions,
  totals,
}) {
  return useMemo(() => {
    const companyComplete = !!(
      company.name &&
      company.email &&
      company.address &&
      company.logoUrl
    );
    const employeeComplete = !!(
      employee.name &&
      employee.code &&
      employee.designation
    );
    const periodComplete = !!(period.month && period.year && period.payDate);
    const earningsComplete = earnings.some(
      (e) => e.label && Number(e.amount) > 0
    );
    const deductionsComplete = deductions.some(
      (d) => d.label && String(d.amount).length > 0
    ); // optional contribution

    const sections = [
      companyComplete,
      employeeComplete,
      periodComplete,
      earningsComplete,
      deductionsComplete,
    ];
    const done = sections.filter(Boolean).length;
    const total = sections.length;
    const percent = Math.round((done / total) * 100);

    return {
      percent,
      checklist: [
        { title: "Company Details", done: companyComplete },
        { title: "Employee Details", done: employeeComplete },
        { title: "Pay Period", done: periodComplete },
        { title: "Earnings", done: earningsComplete },
        { title: "Deductions", done: deductionsComplete },
      ],
      net: totals.net,
    };
  }, [company, employee, period, earnings, deductions, totals]);
}
