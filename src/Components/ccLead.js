// Shared lead-handoff contract used by ClearClaimOptin -> App -> BookModal.
// Keeping the keys in one place stops the opt-in page, the landing page and
// the booking modal from ever disagreeing about where the lead lives.

export const LEAD_KEY = "cc_optin_lead";
export const VIEW_KEY = "cc_view";

export function saveLead(lead) {
  try {
    sessionStorage.setItem(LEAD_KEY, JSON.stringify(lead));
    sessionStorage.setItem(VIEW_KEY, "landing");
  } catch {
    /* sessionStorage unavailable (private mode / SSR): fail soft */
  }
}

export function loadLead() {
  try {
    const raw = sessionStorage.getItem(LEAD_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// True once the visitor has cleared the opt-in gate this session, so a refresh
// on the landing page does not bounce them back to the gate.
export function hasOptedIn() {
  try {
    return sessionStorage.getItem(VIEW_KEY) === "landing";
  } catch {
    return false;
  }
}

// The opt-in collects a full WhatsApp number with country code (e.g.
// "+91 98765 43210"). The booking modal's phone field is a 10 digit Indian
// mobile, so we take the last 10 digits for that field while the full string
// is preserved separately for the TidyCal handoff.
export function last10(value) {
  return (value || "").replace(/\D/g, "").slice(-10);
}
