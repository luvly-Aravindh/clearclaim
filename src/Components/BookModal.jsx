import { useEffect, useRef, useState } from "react";
import "./BookModal.css";
import { ensureIntlTelInput, ITI_OPTIONS, isValidPhone } from "./phoneField";

/* =====================================================================
   BOOKING URL. Single source of truth.
   The funnel ends here: optin page -> landing page -> TidyCal.
   TidyCal prefills the booking form from URL query params (name, email,
   etc.), so the visitor never re-types what they already gave.
   ===================================================================== */
const TIDYCAL_BOOKING_URL = "https://tidycal.com/meetclearclaim/strategy-call";

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

const BookModal = ({ isOpen, onClose, prefill }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const itiRef = useRef(null);
  const [phoneValid, setPhoneValid] = useState(false);

  /* Re-evaluate the phone field using the SAME rules as the opt-in gate
     (India = exactly 10 starting 6-9; others 7-14; dummy numbers rejected). */
  const recheckPhone = () => {
    setPhoneValid(isValidPhone(itiRef.current, phoneInputRef.current?.value));
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
     The modal mounts fresh on each open, so init when it opens and
     destroy on close. Seed from the opt-in lead's full WhatsApp number
     (E.164) so the flag + national digits populate automatically.
  ========================================= */
  useEffect(() => {
    if (!isOpen) return;

    const initIti = () => {
      const el = phoneInputRef.current;
      if (!el || !window.intlTelInput || itiRef.current) return;
      try {
        itiRef.current = window.intlTelInput(el, ITI_OPTIONS);
        // Bind directly to the element so validity updates on every change,
        // independent of React's synthetic events on the plugin-managed node.
        el.addEventListener("input", recheckPhone);
        el.addEventListener("blur", recheckPhone);
        el.addEventListener("countrychange", recheckPhone);
        if (prefill?.whatsapp) {
          try { itiRef.current.setNumber(prefill.whatsapp); } catch { /* ignore */ }
        }
      } catch {
        itiRef.current = null;
      }
      recheckPhone();
      // setNumber / utils can populate a tick later — re-check then too.
      window.setTimeout(recheckPhone, 300);
    };

    const detachLoader = ensureIntlTelInput(initIti);

    return () => {
      if (typeof detachLoader === "function") detachLoader();
      const el = phoneInputRef.current;
      if (el) {
        el.removeEventListener("input", recheckPhone);
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
     Email is pre-filled from the opt-in lead so the visitor never re-types
     it. The WhatsApp number is seeded into the intl-tel-input field above.
     Name / case / company stay blank for the visitor to complete.
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
      newErrors.phone = "Please enter a valid phone number";
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

    if (isSubmitting) return;

    setStatusMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Derive both forms of the number from the phone field:
    //  • phoneNational  -> national significant digits (10 for India). This is
    //    what main.php validates/stores, so we MUST send this (not the +91...
    //    international form, which the server rejects as "not 10 digits").
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

    // build FormData to match https://getnos.io/clearclaim-lp/main.php fields
    const payload = new FormData();
    payload.append("website", formData.website); // honeypot
    payload.append("name", formData.name.trim());
    payload.append("phone", phoneNational);
    payload.append("phone_intl", phoneIntl); // full international (with country code)
    payload.append("email", formData.email.trim());
    payload.append("case", formData.case);
    payload.append("company", formData.company.trim());

    // TidyCal prefills its booking form from URL query params. We pass the
    // visitor's name + email and forward the full international number under
    // every likely phone key so it lands regardless of the booking config.
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
    // The slow part is the server's email send (main.php runs mail() before
    // it answers on success). We do NOT wait for that. `keepalive: true` lets
    // the POST finish in the background even after we navigate away, so the
    // lead is still saved + emailed. We only pause for a brief window to catch
    // a "duplicate email" reply (main.php returns that instantly, before any
    // mail()); otherwise we redirect immediately.
    // ---------------------------------------------------------------------
    const capture = fetch("https://getnos.io/clearclaim-lp/main.php", {
      method: "POST",
      body: payload,
      keepalive: true,
    })
      .then((r) => r.json())
      .catch(() => null);

    const result = await Promise.race([
      capture,
      new Promise((resolve) => setTimeout(() => resolve("timeout"), 1000)),
    ]);

    /* EMAIL EXISTS (arrives fast, before redirect) */
    if (result && result.status === "exists") {
      setErrors((prev) => ({
        ...prev,
        email: "You already used this email. Please use another email.",
      }));
      setIsSubmitting(false);
      return;
    }

    /* EXPLICIT VALIDATION ERROR (also fast) */
    if (result && result.status === "error") {
      setStatusMessage(result.message || "Something went wrong");
      setIsSubmitting(false);
      return;
    }

    /* SUCCESS or slow server -> go to TidyCal now (capture continues via keepalive) */
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
    <div
      id="bookModal"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
      aria-hidden={!isOpen}
      onClick={handleBackdropClick}
    >

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-[540px] rounded-[24px] p-5 md:p-5 shadow-2xl max-h-[95vh] sm:overflow-y-hidden overflow-y-auto overflow-x-hidden">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-2 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-[24px] flex items-center justify-center transition-all"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-[30px] leading-tight font-black text-[#161d34] mb-2">
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
                onInput={recheckPhone}
                onBlur={recheckPhone}
                autoComplete="tel"
                inputMode="tel"
                placeholder="WhatsApp number"
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
            <div className="text-center text-sm font-bold rounded-xl py-3 px-4 text-red-500 bg-red-50 border border-red-200">
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
  );
};

export default BookModal;
