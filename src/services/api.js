const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

export async function savePayslip(payload) {
  const res = await fetch(`${API_URL}/api/payslips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to save payslip");
  return data;
}
