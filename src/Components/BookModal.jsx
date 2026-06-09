import { useEffect, useRef, useState } from "react";
import { last10 } from "./ccLead";

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
  phone: "",
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
     RESET FORM EACH TIME MODAL OPENS
     Email + WhatsApp are pre-filled from the opt-in lead (sessionStorage),
     so the visitor never re-types what they already gave at the gate. The
     opt-in captures a full WhatsApp number with country code; the phone
     field here is a 10 digit Indian mobile, so we seed it with the last 10
     digits. Name / case / company stay blank for the visitor to complete.
  ========================================= */
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...initialFormState,
        email: prefill?.email || "",
        phone: last10(prefill?.whatsapp || ""),
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

    // phone -> digits only, max 10
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: cleaned }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================================
     LIVE BUTTON ENABLEMENT
  ========================================= */
  const isFormValid =
    formData.name.trim().length >= 2 &&
    formData.phone.length === 10 &&
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

    if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
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

    // build FormData to match https://getnos.io/clearclaim-lp/main.php fields
    const payload = new FormData();
    payload.append("website", formData.website); // honeypot
    payload.append("name", formData.name.trim());
    payload.append("phone", formData.phone);
    payload.append("email", formData.email.trim());
    payload.append("case", formData.case);
    payload.append("company", formData.company.trim());

    // TidyCal prefills its booking form from URL query params. We pass the
    // visitor's name + email and also forward the phone/WhatsApp number. We
    // keep the full string from the opt-in when the visitor has not edited the
    // phone, otherwise we use what they typed here. The number is also captured
    // server-side by main.php (the `phone` field), so it is stored regardless
    // of what TidyCal consumes.
    const fullWhatsapp = (prefill?.whatsapp || "").trim();
    const whatsappForTidyCal =
      fullWhatsapp && last10(fullWhatsapp) === formData.phone
        ? fullWhatsapp
        : formData.phone;

    const tidyCalUrl =
      TIDYCAL_BOOKING_URL +
      (TIDYCAL_BOOKING_URL.includes("?") ? "&" : "?") +
      new URLSearchParams({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        // TidyCal prefills its booking phone field from `no_phone`, not
        // `phone`. We send the visitor's number under every likely key so it
        // lands regardless of how the booking page is configured.
        no_phone: whatsappForTidyCal,
        phone: whatsappForTidyCal,
        whatsapp: whatsappForTidyCal,
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

            <input
              type="tel"
              id="vPhone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              inputMode="numeric"
              placeholder="10 digit mobile number"
              className={`${inputBase} ${
                errors.phone
                  ? "border-red-500 field-error"
                  : "border-gray-300"
              }`}
            />

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
