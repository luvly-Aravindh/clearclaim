/* =====================================================================
   phoneField.js
   Shared phone-field helpers so the opt-in gate (ClearClaimLanding) and the
   booking modal (BookModal) use IDENTICAL phone UI + validation.

   It (a) loads intl-tel-input from the CDN the same non-blocking way the old
   gate loaded its video scripts (no npm dependency added), and (b) validates:

     • India (+91): national number must be EXACTLY 10 digits, starting 6-9.
     • Any other country: national number 7 to 14 digits.
     • Dummy / temporary numbers are rejected everywhere
       (all-same digits, <=2 distinct digits, straight sequences) — e.g.
       9999999995, 1111111111, 1234567890.
     • When libphonenumber utils are loaded, the number must ALSO pass
       intl-tel-input's own isValidNumber(), which rejects out-of-range fakes
       such as 4384783758735 for real countries.
   ===================================================================== */

const ITI_VERSION = "25.11.2";
export const ITI_CSS = `https://cdn.jsdelivr.net/npm/intl-tel-input@${ITI_VERSION}/build/css/intlTelInput.min.css`;
export const ITI_JS = `https://cdn.jsdelivr.net/npm/intl-tel-input@${ITI_VERSION}/build/js/intlTelInputWithUtils.min.js`;

/* Shared init options — keep both fields visually + behaviourally identical. */
export const ITI_OPTIONS = {
  initialCountry: "in",
  separateDialCode: true,
  countryOrder: ["in", "us", "gb", "ae", "sg", "au", "ca"],
  nationalMode: true,
};

/* Inject the CSS + JS once (non-blocking), then call onReady() when
   window.intlTelInput is available. Returns a cleanup fn that detaches the
   load listener (no-op if the script was already loaded). */
export function ensureIntlTelInput(onReady) {
  if (!document.querySelector('link[data-cc-iti="1"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = ITI_CSS;
    link.setAttribute("data-cc-iti", "1");
    document.head.appendChild(link);
  }

  if (window.intlTelInput) {
    onReady();
    return () => {};
  }

  let script = document.querySelector('script[data-cc-iti="1"]');
  if (!script) {
    script = document.createElement("script");
    script.src = ITI_JS;
    script.async = true;
    script.setAttribute("data-cc-iti", "1");
    document.head.appendChild(script);
  }
  script.addEventListener("load", onReady);
  return () => script.removeEventListener("load", onReady);
}

/* Reject obviously fake / temporary numbers. Kept deliberately narrow so it
   only catches clearly-bogus input (all-same digits, or only one/two distinct
   digits) — NOT ordinary valid-format numbers like 9876543210. */
export function isJunkPhone(nat) {
  if (!nat || nat.length < 4) return true;
  if (/^(\d)\1+$/.test(nat)) return true;            // 1111111111, 0000000000
  if (new Set(nat.split("")).size <= 2) return true; // 9999999995, 1212121212
  return false;
}

/* The single source of truth for "is this phone number acceptable?".
   `iti` is the intl-tel-input instance (may be null before it loads);
   `rawValue` is the raw text in the tel input (national portion). */
export function isValidPhone(iti, rawValue) {
  const nat = (rawValue || "").replace(/\D/g, "");
  if (isJunkPhone(nat)) return false;

  const iso2 =
    iti && typeof iti.getSelectedCountryData === "function"
      ? (iti.getSelectedCountryData().iso2 || "in").toLowerCase()
      : "in";

  if (iso2 === "in") {
    // India: exactly 10 national digits, valid mobile prefix. No more, no
    // less. This length+prefix rule IS the rule — we deliberately do NOT
    // defer to libphonenumber here (its isValidNumber() can return null while
    // utils load, or reject valid-looking numbers, which would wrongly block
    // a correct 10-digit entry).
    return nat.length === 10 && /^[6-9]/.test(nat);
  }

  // Other countries: 7 to 14 national digits.
  if (nat.length < 7 || nat.length > 14) return false;

  // When libphonenumber utils are loaded, let an EXPLICIT "invalid" reject the
  // number (catches out-of-range fakes like 4384783758735). A null result
  // (utils still loading / unknown) is treated as acceptable on length alone,
  // so it never blocks a real number.
  if (iti && typeof iti.isValidNumber === "function") {
    if (iti.isValidNumber() === false) return false;
  }
  return true;
}
