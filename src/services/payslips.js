const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function parseJsonSafe(resp) {
  try {
    return await resp.json();
  } catch {
    return null;
  }
}

/** createPayslip expects a FormData already built by the caller */
export async function createPayslip(formData, { signal } = {}) {
  let resp;
  try {
    resp = await fetch(`${API_BASE}/payslips`, {
      method: "POST",
      body: formData,
      signal,
    });
  } catch (err) {
    err.friendlyMessage =
      err.name === "AbortError"
        ? "Request was canceled."
        : "Network error — check your connection or server.";
    throw err;
  }
  const data = await parseJsonSafe(resp);
  if (!resp.ok) {
    const e = new Error(
      (data && (data.message || data.error)) ||
        `HTTP ${resp.status} ${resp.statusText}`
    );
    e.status = resp.status;
    e.data = data;
    throw e;
  }
  return data || { message: "OK" };
}
