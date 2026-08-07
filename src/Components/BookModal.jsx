import { useEffect, useRef, useState } from "react";
import "./BookModal.css";
import { ensureIntlTelInput, ITI_OPTIONS } from "./phoneField";

/* =====================================================================
   BOOKING URL. Single source of truth.
   The funnel ends here: optin page -> landing page -> TidyCal.
   TidyCal prefills the booking form from URL query params (name, email,
   etc.), so the visitor never re-types what they already gave.
   ===================================================================== */
const TIDYCAL_BOOKING_URL = "https://tidycal.com/meetclearclaim/strategy-call";

/* =====================================================================
   GETNOS DESK
   The only backend. Replaces getnos.io/clearclaim-lp/main.php.

   THE PHP USED TO BLOCK REPEAT EMAILS. It answered status:"exists" and
   the modal showed "You already used this email". Desk has no equivalent.
   Its duplicate:true only means the identical lead was posted again
   inside roughly 15 minutes, which is a double click guard, not a
   permanent uniqueness rule. That gate is therefore gone.

   THE KEY IS ORIGIN LOCKED. Desk returns 403 "Origin not allowed" for
   anything outside the allowlist for this key.
   Verified allowed:  http://localhost:5173, http://localhost:3000
   Verified blocked:  https://getnos.io, https://meetclearclaim.com,
                      https://www.meetclearclaim.com, https://clearclaim.in
   Add the live domain in Desk before launch, or every production lead
   403s while local testing keeps passing.

   SECURITY: this key ships in the public bundle and is readable with
   devtools. The origin lock is what keeps that survivable.
   ===================================================================== */
const DESK_URL = "https://deskbackend.getnos.io/v1/lead";
const DESK_API_KEY = "lh_7a-fckZfKIe9xXyO7pdnv2JT0yvVF8tDGrKWZ-R6lI4";
const LEAD_SOURCE = "clearclaim-lp";

/* In a dev build the redirect is held and the real Desk error is shown,
   so a misconfiguration is impossible to miss. In production the visitor
   always reaches TidyCal. Vite sets import.meta.env.DEV. */
let IS_DEV = false;
try {
  IS_DEV = Boolean(import.meta.env && import.meta.env.DEV);
} catch {
  IS_DEV = false;
}

/* Sheet readability: send the label a human picked, not the option code. */
const CASE_LABELS = {
  old_certificates: "I have old physical share certificates",
  deceased_family: "A family member passed away with shares",
  unsure: "I am unsure of the category",
};

const initialFormState = {
  website: "", // honeypot
  name: "",
  email: "",
  case: "",
  company: "",
};

const initialErrors = {
  name: "",
  phone: "",
  email: "",
  case: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ---------------------------------------------------------------------
   POST TO DESK
   Resolves rather than throws, so the caller can race it against a timer
   without an unhandled rejection.

   Desk signals failure two ways, so both are checked:
     401  Invalid API key      config problem, a retry fails identically
     403  Origin not allowed   config problem, a retry fails identically
     5xx / 429 / network       transient, worth one retry
   A 200 carrying status:"error" counts as a failure too, because testing
   res.ok alone would let it through as a success.
   --------------------------------------------------------------------- */
const postToDesk = async (fields) => {
  const attempt = async () => {
    const res = await fetch(DESK_URL, {
      method: "POST",
      keepalive: true, // finishes even after the redirect fires
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DESK_API_KEY}`,
      },
      body: JSON.stringify(fields),
    });

    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (data.duplicate) return { ok: true, data };
    if (res.ok && data.status !== "error") return { ok: true, data };

    return {
      ok: false,
      status: res.status,
      message: data.message || `Desk responded ${res.status}`,
      payload: data,
      retryable: res.status === 429 || res.status >= 500,
    };
  };

  let result;
  try {
    result = await attempt();
  } catch (networkErr) {
    result = {
      ok: false,
      status: 0,
      message: networkErr.message || "Network error",
      retryable: true,
    };
  }

  if (!result.ok && result.retryable) {
    console.warn("[desk] transient failure, retrying once:", result.message);
    await sleep(1200);
    try {
      result = await attempt();
    } catch (networkErr) {
      result = {
        ok: false,
        status: 0,
        message: networkErr.message || "Network error",
        retryable: true,
      };
    }
  }

  if (!result.ok) {
    console.error(
      `[desk] LEAD NOT SAVED. HTTP ${result.status}: ${result.message}`,
      result.payload
    );
  } else if (IS_DEV) {
    console.info("[desk] lead accepted:", result.data);
  }

  return result;
};

const BookModal = ({ isOpen, onClose, prefill }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const itiRef = useRef(null);
  const submittingRef = useRef(false); // survives re-renders, blocks double posts
  const [phoneValid, setPhoneValid] = useState(false);

  /* =========================================
     HANDLE PHONE INPUT - 7 TO 14 DIGITS, ANY COUNTRY
  ========================================= */
  const handlePhoneInput = (e) => {
    const input = e.target;
    // Remove all non-digit characters
    let value = input.value.replace(/\D/g, "");

    // Limit to 14 digits (max national significant number length)
    if (value.length > 14) {
      value = value.slice(0, 14);
    }

    // Update the input value
    input.value = value;

    // Trigger validation
    recheckPhone();
  };

  /* Re-evaluate the phone field - country agnostic, 7 to 14 digits */
  const recheckPhone = () => {
    const iti = itiRef.current;
    const input = phoneInputRef.current;

    if (!iti || !input) {
      setPhoneValid(false);
      return;
    }

    // Get the raw number (digits only)
    const rawNumber = input.value.replace(/\D/g, "");

    // Get the country data
    const countryData = iti.getSelectedCountryData ? iti.getSelectedCountryData() : null;
    const dialCode = countryData?.dialCode || "";

    // Remove the country code from the raw number if present
    let nationalNumber = rawNumber;
    if (dialCode && rawNumber.startsWith(dialCode)) {
      nationalNumber = rawNumber.slice(dialCode.length);
    }

    // 7 to 14 digits, any country
    const isValid = /^\d{7,14}$/.test(nationalNumber);
    setPhoneValid(isValid);

    // Update error message
    if (nationalNumber.length === 0) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    } else if (!isValid) {
      setErrors((prev) => ({
        ...prev,
        phone: "Please enter a valid number (7 to 14 digits)",
      }));
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  /* =========================================
     LOCK BODY SCROLL + FOCUS FIRST FIELD
  ========================================= */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      // focus the first field after open animation
      const t = setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 200);

      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";
  }, [isOpen]);

  /* =========================================
     ESC KEY CLOSE
  ========================================= */
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  /* =========================================
     INTL-TEL-INPUT (same field/UI as the opt-in gate)
     All countries selectable. India is the default flag.
  ========================================= */
  useEffect(() => {
    if (!isOpen) return;

    const initIti = () => {
      const el = phoneInputRef.current;
      if (!el || !window.intlTelInput || itiRef.current) return;
      try {
        itiRef.current = window.intlTelInput(el, {
          ...ITI_OPTIONS,
          initialCountry: "in",
        });
        // Bind directly to the element so validity updates on every change,
        // independent of React's synthetic events on the plugin-managed node.
        el.addEventListener("input", handlePhoneInput);
        el.addEventListener("blur", recheckPhone);
        el.addEventListener("countrychange", recheckPhone);
        if (prefill?.whatsapp) {
          try { itiRef.current.setNumber(prefill.whatsapp); } catch { /* ignore */ }
        }
      } catch {
        itiRef.current = null;
      }
      recheckPhone();
      // setNumber / utils can populate a tick later - re-check then too.
      window.setTimeout(recheckPhone, 300);
    };

    const detachLoader = ensureIntlTelInput(initIti);

    return () => {
      if (typeof detachLoader === "function") detachLoader();
      const el = phoneInputRef.current;
      if (el) {
        el.removeEventListener("input", handlePhoneInput);
        el.removeEventListener("blur", recheckPhone);
        el.removeEventListener("countrychange", recheckPhone);
      }
      if (itiRef.current && typeof itiRef.current.destroy === "function") {
        try { itiRef.current.destroy(); } catch { /* ignore */ }
      }
      itiRef.current = null;
      setPhoneValid(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, prefill]);

  /* =========================================
     RESET FORM EACH TIME MODAL OPENS
  ========================================= */
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...initialFormState,
        email: prefill?.email || "",
      });
      setErrors(initialErrors);
      setStatusMessage("");
      setIsSubmitting(false);
      submittingRef.current = false;

      // Reset phone input value if it exists
      if (phoneInputRef.current) {
        phoneInputRef.current.value = "";
      }
    }
  }, [isOpen, prefill]);

  /* =========================================
     INPUT CHANGE
  ========================================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================================
     LIVE BUTTON ENABLEMENT
  ========================================= */
  const isFormValid =
    formData.name.trim().length >= 2 &&
    phoneValid &&
    emailRegex.test(formData.email.trim()) &&
    formData.case !== "";

  /* =========================================
     VALIDATION
  ========================================= */
  const validateForm = () => {
    const newErrors = { ...initialErrors };
    let valid = true;

    if (formData.name.trim().length < 2) {
      newErrors.name = "Please enter your full name";
      valid = false;
    }

    if (!phoneValid) {
      const phoneInput = phoneInputRef.current;
      const rawNumber = phoneInput ? phoneInput.value.replace(/\D/g, "") : "";
      if (rawNumber.length === 0) {
        newErrors.phone = "Please enter your phone number";
      } else {
        newErrors.phone = "Please enter a valid number (7 to 14 digits)";
      }
      valid = false;
    }

    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter valid email address";
      valid = false;
    }

    if (formData.case === "") {
      newErrors.case = "Please select your situation";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  /* =========================================
     SUBMIT
  ========================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || submittingRef.current) return;

    setStatusMessage("");

    if (!validateForm()) {
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    // Derive both forms of the number from the phone field:
    //  • phoneNational  -> national significant digits (country agnostic).
    //  • phoneIntl      -> full international number (E.164, e.g. +919876543210),
    //    forwarded to TidyCal so the booking keeps the country code.
    const iti = itiRef.current;
    const e164 =
      iti && typeof iti.getNumber === "function" && iti.getNumber()
        ? iti.getNumber()
        : "";
    const dial =
      iti && typeof iti.getSelectedCountryData === "function"
        ? iti.getSelectedCountryData().dialCode || ""
        : "";
    const rawNational = (phoneInputRef.current?.value || "").replace(/\D/g, "");

    let phoneNational = rawNational;
    if (e164) {
      const allDigits = e164.replace(/\D/g, "");
      phoneNational =
        dial && allDigits.startsWith(dial) ? allDigits.slice(dial.length) : allDigits;
    }
    const phoneIntl = e164 || rawNational;

    // Validate one more time: 7 to 14 national digits
    if (!/^\d{7,14}$/.test(phoneNational)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Please enter a valid number (7 to 14 digits)",
      }));
      setIsSubmitting(false);
      submittingRef.current = false;
      return;
    }

    // Honeypot. A bot fills every input it finds. Look booked, save nothing.
    if (formData.website.trim()) {
      window.location.href = TIDYCAL_BOOKING_URL;
      return;
    }

    // Flat fields, one Sheet column each.
    const deskFields = {
      form: "contact",
      source: LEAD_SOURCE,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: phoneIntl,                 // E.164, keeps the country code
      phone_national: phoneNational,    // local digits, easier to dial
      case: CASE_LABELS[formData.case] || formData.case,
      company: formData.company.trim(),
      honeypot: formData.website,
    };

    // TidyCal prefills its booking form from URL query params
    const tidyCalUrl =
      TIDYCAL_BOOKING_URL +
      (TIDYCAL_BOOKING_URL.includes("?") ? "&" : "?") +
      new URLSearchParams({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        no_phone: phoneIntl,
        phone: phoneIntl,
        whatsapp: phoneIntl,
      }).toString();

    // ---------------------------------------------------------------------
    // ULTRA-FAST REDIRECT
    // keepalive means the request completes even after navigation, so the
    // visitor never waits on Desk. In a dev build we wait for the real
    // answer instead, so a 401 or 403 cannot hide behind a redirect.
    // ---------------------------------------------------------------------
    const capture = postToDesk(deskFields);

    if (IS_DEV) {
      const result = await capture;
      if (!result.ok) {
        setStatusMessage(
          `Desk rejected this lead. HTTP ${result.status}: ${result.message}. ` +
          `Origin ${window.location.origin} may not be on the allowlist for this key. ` +
          `This notice only appears in a dev build.`
        );
        setIsSubmitting(false);
        submittingRef.current = false;
        return;
      }
    } else {
      await Promise.race([capture, sleep(1000)]);
    }

    window.location.href = tidyCalUrl;
  };

  /* =========================================
     BACKDROP CLICK
  ========================================= */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const inputBase =
    "w-full border rounded-xl px-5 py-4 outline-none focus:border-[#00BE5D] focus:ring-4 focus:ring-green-100 transition-all";

  return (
    /* OVERLAY is the scroll container. On short viewports (100% zoom, small
       laptop windows) the entire overlay scrolls so nothing gets clipped. */
    <div
      id="bookModal"
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md overflow-y-auto"
      aria-hidden={!isOpen}
    >
      {/* min-h-full flex wrapper: centers the card when it fits, and grows
          past the viewport (letting the overlay scroll) when it does not.
          This is the pattern that survives any zoom level. Backdrop click
          lives here so taps on the padding around the card close it. */}
      <div
        className="flex min-h-full items-center justify-center p-4"
        onClick={handleBackdropClick}
      >

        {/* Modal Card - natural height, no inner scroll needed */}
        <div className="relative bg-white w-full max-w-[540px] rounded-[24px] p-5 md:p-5 shadow-2xl my-4">

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-2 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-[24px] flex items-center justify-center transition-all z-10"
          >
            ×
          </button>

          {/* Title */}
          <h2 className="text-[30px] leading-tight font-black text-[#161d34] mb-2 pr-12">
            Book Your Free Valuation Call
          </h2>

          <p className="text-[15px] text-gray-500 mb-7">
            No original documents required to get started.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="hp-field"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
            />

            {/* Name */}
            <div>
              <label
                htmlFor="vName"
                className="block mb-2 text-[12px] font-black uppercase tracking-[0.06em] text-[#161d34]"
              >
                Your Name
              </label>

              <input
                ref={nameInputRef}
                type="text"
                id="vName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                maxLength={80}
                className={`${inputBase} ${
                  errors.name
                    ? "border-red-500 field-error"
                    : "border-gray-300"
                }`}
              />

              {errors.name && (
                <p className="mt-2 text-red-500 text-sm font-semibold">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="vPhone"
                className="block mb-2 text-[12px] font-black uppercase tracking-[0.06em] text-[#161d34]"
              >
                Phone Number
              </label>

              <div className={`cc-phone-field ${errors.phone ? "has-error" : ""}`}>
                <input
                  type="tel"
                  id="vPhone"
                  name="phone"
                  ref={phoneInputRef}
                  onInput={handlePhoneInput}
                  onBlur={recheckPhone}
                  autoComplete="tel"
                  inputMode="numeric"
                  placeholder="Enter your phone number"
                  pattern="\d{7,14}"
                  maxLength={14}
                />
              </div>

              {errors.phone && (
                <p className="mt-2 text-red-500 text-sm font-semibold">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="vEmail"
                className="block mb-2 text-[12px] font-black uppercase tracking-[0.06em] text-[#161d34]"
              >
                Email Address
              </label>

              <input
                type="email"
                id="vEmail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                maxLength={120}
                className={`${inputBase} ${
                  errors.email
                    ? "border-red-500 field-error"
                    : "border-gray-300"
                }`}
              />

              {errors.email && (
                <p className="mt-2 text-red-500 text-sm font-semibold">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Case */}
            <div>
              <label
                htmlFor="vCase"
                className="block mb-2 text-[12px] font-black uppercase tracking-[0.06em] text-[#161d34]"
              >
                Case Type
              </label>

              <select
                id="vCase"
                name="case"
                value={formData.case}
                onChange={handleChange}
                className={`${inputBase} bg-white ${
                  errors.case
                    ? "border-red-500 field-error"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select your situation</option>
                <option value="old_certificates">
                  I have old physical share certificates
                </option>
                <option value="deceased_family">
                  A family member passed away with shares
                </option>
                <option value="unsure">
                  I am unsure of the category
                </option>
              </select>

              {errors.case && (
                <p className="mt-2 text-red-500 text-sm font-semibold">
                  {errors.case}
                </p>
              )}
            </div>

            {/* Company */}
            <div>
              <label
                htmlFor="vCompany"
                className="block mb-2 text-[12px] font-black uppercase tracking-[0.06em] text-[#161d34]"
              >
                Company Name
              </label>

              <input
                type="text"
                id="vCompany"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Reliance Industries"
                maxLength={100}
                className={`${inputBase} border-gray-300`}
              />
            </div>

            {/* Status message */}
            {statusMessage && (
              <div className="text-center text-sm font-bold rounded-xl py-3 px-4 text-red-500 bg-red-50 border border-red-200 leading-relaxed">
                {statusMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-4 rounded-xl text-white font-black transition-all ${
                !isFormValid || isSubmitting
                  ? "opacity-40 pointer-events-none"
                  : ""
              }`}
              style={{
                background:
                  "linear-gradient(180deg,#3D6FF0 0%,#2450C4 100%)",
              }}
            >
              {isSubmitting
                ? "Submitting..."
                : "Book Free Valuation Call →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookModal;