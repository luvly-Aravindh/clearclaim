import { useEffect, useMemo, useRef, useState } from "react";
import "./ClearClaimLanding.css";
import markImg from "../assets/clearclaim-mark.png";
import wordmarkImg from "../assets/clearclaim-wordmark.png";
import reportPdf from "../clearclaim_optin.pdf";
import { ensureIntlTelInput, ITI_OPTIONS, isValidPhone } from "./phoneField";

/* =====================================================================
   ClearClaimLanding — the opt-in GATE (entry point of the funnel).
   Flow:  Opt-in gate (this) -> Landing page -> Book a Call (TidyCal)
   The page advances IN-APP via the onComplete(lead) callback (no
   window.location redirect), exactly like the previous gate, so App
   swaps to the full landing page and opens the prefilled BookModal.
   The lead object carries `email` + `whatsapp`, which BookModal reads.
   ===================================================================== */

const CONFIG = {
  // Optional fire-and-forget lead capture (leave "" to disable, as before).
  WEBHOOK_URL: "",
  // Kept for reference only — the SPA advances via onComplete(), not a redirect.
  REDIRECT_URL: "/landing",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------- tiny inline icons ---------- */
const Arrow = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const Check = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const Lock = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const Download = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const Close = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const BULLETS = [
  "47 Indian companies. One page per company. Real recovery math.",
  "HDFC merger math. Infosys 1993 IPO bonus history. Reliance + Jio Financial demerger.",
  "Documents required for recovery, by case type.",
  "The 4-question decision tree. Which certificates to pursue. Which to leave alone.",
];

const downloadReportPdf = () => {
  const link = document.createElement("a");
  link.href = reportPdf;
  link.download = "clearclaim-forgotten-crorepati-report.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const ClearClaimLanding = ({ onComplete }) => {
  const [email, setEmail] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const phoneInputRef = useRef(null);
  const itiRef = useRef(null);
  const openBtnRef = useRef(null);

  const emailValid = useMemo(
    () => EMAIL_REGEX.test(email.trim()) && email.trim().length >= 6,
    [email]
  );
  const ready = emailValid && phoneValid;

  /* Re-evaluate the phone field using the shared validation rules
     (India = exactly 10 starting 6-9; others 7-14; dummy numbers rejected). */
  const recheckPhone = () => {
    setPhoneValid(isValidPhone(itiRef.current, phoneInputRef.current?.value));
  };

  /* Load intl-tel-input (flag picker, India default) via the shared loader —
     the same non-blocking CDN injection the old gate used for its video
     scripts. Hooks live INSIDE the component body (module-level hooks cause
     "Invalid hook call"). */
  useEffect(() => {
    let cancelled = false;

    const initIti = () => {
      if (cancelled) return;
      const el = phoneInputRef.current;
      if (!el || !window.intlTelInput || itiRef.current) return;
      try {
        itiRef.current = window.intlTelInput(el, ITI_OPTIONS);
        el.addEventListener("input", recheckPhone);
        el.addEventListener("blur", recheckPhone);
        el.addEventListener("countrychange", recheckPhone);
      } catch {
        itiRef.current = null;
      }
      recheckPhone();
      window.setTimeout(recheckPhone, 300);
    };

    const detachLoader = ensureIntlTelInput(initIti);

    return () => {
      cancelled = true;
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Lock background scroll + focus email while the modal is open. */
  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      document.getElementById("cc-email")?.focus();
    }, 120);

    const onKey = (e) => {
      if (e.key !== "Escape") return;
      // If the country picker is open, let it handle Escape first.
      if (document.querySelector('.iti__selected-country[aria-expanded="true"]')) return;
      closeModal();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    openBtnRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ready) return;

    const iti = itiRef.current;
    const rawPhone = phoneInputRef.current?.value?.trim() || "";

    const lead = {
      email: email.trim(),
      // Full international number with country code (e.g. "+91 98765 43210").
      // BookModal seeds its 10-digit field from last10(lead.whatsapp).
      whatsapp: iti && typeof iti.getNumber === "function" && iti.getNumber()
        ? iti.getNumber()
        : rawPhone,
      whatsapp_country:
        iti && typeof iti.getSelectedCountryData === "function"
          ? iti.getSelectedCountryData().iso2
          : "",
      source: "clearclaim_optin_gate_react",
      edition: "edition_01",
      report: "forgotten_crorepati",
      submitted_at: new Date().toISOString(),
      user_agent: navigator.userAgent.slice(0, 200),
    };

    // Optional fire-and-forget capture (disabled unless WEBHOOK_URL is set).
    if (CONFIG.WEBHOOK_URL) {
      try {
        fetch(CONFIG.WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
          mode: "no-cors",
          keepalive: true,
        }).catch(() => {});
      } catch { /* ignore */ }
    }

    setSubmitted(true);
    downloadReportPdf();

    // Advance the funnel IN-APP: optin -> landing (App opens prefilled BookModal).
    window.setTimeout(() => {
      onComplete?.(lead);
    }, 1100);
  };

  const WRAP = "max-w-[1280px] mx-auto px-5 md:px-8";

  return (
    <div className="cc-optin">
      {/* ============ NAV ============ */}
      <nav className="sticky top-0 z-50 bg-[rgba(250,250,247,0.94)] backdrop-blur-[12px] border-b border-[#D8E5DC] py-4">
        <div className={WRAP + " flex items-center justify-between gap-4"}>
          <a href="#" className="inline-flex items-center gap-[10px] font-extrabold text-[#00BE5E] text-[19px]">
<img src={wordmarkImg} alt="ClearClaim" className="w-[100px] mx-auto block opacity-95" />          </a>
          <div className="hidden sm:inline-flex items-center gap-[14px] font-[JetBrains_Mono,monospace] text-[11px] font-bold tracking-[0.16em] text-[#5F6E66] uppercase mono">
            <span className="w-[5px] h-[5px] rounded-full bg-[#00BE5E]" />
            <span>Free Download</span>
            <span>·</span>
            <span>Edition 01</span>
          </div>
        </div>
      </nav>

      {/* ============ HERO / GATE ============ */}
      <section className="hero-bg flex items-center py-8 md:py-14 lg:min-h-[calc(100vh-72px)]">
        <div className={WRAP + " w-full"}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-[72px] items-center">

            {/* LEFT: copy + form trigger */}
            <div className="max-w-[580px]">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#008B45] border border-[#D8E5DC] rounded-full mb-[22px] shadow-[var(--shadow-sm)]">
                <span className="eyebrow-dot" />
                <span className="mono">Free 31-Page Report · Edition 01</span>
              </span>

              <h1 className="font-extrabold leading-[1.04] tracking-[-0.025em] text-[#00301A] mb-[18px] text-[clamp(30px,4.6vw,56px)]">
                The <span className="serif-i text-[#008B45] text-[1.05em]">Forgotten Crorepati</span> Report. Yours in 30 seconds.
              </h1>

              <p className="text-[17px] md:text-[19px] text-[#5F6E66] leading-[1.6] mb-7 md:mb-[30px]">
                Tap the button below. Drop your <strong className="text-[#0F1F14] font-bold">email</strong> and <strong className="text-[#0F1F14] font-bold">WhatsApp number</strong> in the box that opens, and the PDF lands in your inbox within 30 seconds.
              </p>

              <ul className="list-none mb-8 flex flex-col gap-[10px]">
                {BULLETS.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-[15px] md:text-[15.5px] text-[#1F3027] leading-[1.5]">
                    <span className="tick"><Check /></span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 md:mt-[30px]">
                <button
                  type="button"
                  ref={openBtnRef}
                  className="dl-trigger"
                  aria-haspopup="dialog"
                  aria-controls="cc-form-modal"
                  onClick={openModal}
                >
                  <Download />
                  <span>Download The Free Report</span>
                  <Arrow className="arrow" />
                </button>

                <div className="flex items-center gap-[10px] flex-wrap mt-4 text-[13.5px] text-[#5F6E66]">
                  <span className="inline-flex items-center gap-[6px] font-bold text-[#008B45]">
                    <Check className="w-[14px] h-[14px] text-[#00BE5E]" />31 pages
                  </span>
                  <span className="text-[#95A39B]">·</span>
                  <span>Delivered to your inbox in 30 seconds</span>
                  <span className="text-[#95A39B]">·</span>
                  <span>No spam</span>
                </div>
              </div>
            </div>

            {/* RIGHT: big 3D book mockup */}
            <div className="book-stage order-first lg:order-none relative flex items-center justify-center min-h-[420px] md:min-h-[480px] lg:min-h-[600px]">
              <div className="book-float-tag top">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6v6H9z" /></svg>
                47 companies covered
              </div>
              <div className="book-float-tag bottom yellow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 2" /><circle cx="12" cy="12" r="10" /></svg>
                14-minute read
              </div>

              <div className="book">
                <div className="book-spine" />
                <div className="book-pages" />
                <div className="book-cover">
                  <div className="book-top-row">
                    <div className="book-logo-mark"><img src={markImg} alt="ClearClaim" /></div>
                    <div className="book-stamp">
                      <span className="book-stamp-line1">Edition</span>
                      <span className="book-stamp-line2">01</span>
                    </div>
                  </div>

                  <div className="book-title-wrap">
                    <div className="book-brand-strip"><strong>CLEARCLAIM</strong> · RECOVERY SPECIALISTS</div>
                    <div className="book-title-the" style={{ marginTop: "18px" }}>THE</div>
                    <div className="book-title-main">FORGOTTEN</div>
                    <div className="book-title-accent">Crorepati</div>
                    <div className="book-title-report">REPORT</div>
                  </div>

                  <div className="book-bottom">
                    <div className="book-sub">
                      What 47 Indian share certificates from 1985 to 1995 are actually worth in 2026. With real recovery math.
                    </div>
                    <div className="book-companies">
                      HDFC · INFOSYS · RELIANCE · WIPRO · ITC<br />
                      TCS · L&amp;T · TATA STEEL · ASIAN PAINTS<br />
                      + 38 OTHER INDIAN COMPANIES
                    </div>
                  </div>
                </div>
                <div className="book-shadow" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <div className="bg-white border-y border-[#D8E5DC] py-[18px] md:py-[22px]">
        <div className={WRAP}>
          <div className="flex items-center justify-center gap-3 md:gap-[18px] flex-wrap text-[14px] md:text-[15.5px] text-[#1F3027] font-medium text-center">
            <span className="text-[#F4B400] text-[17px] tracking-[1.5px]">★★★★★</span>
            <span><strong className="text-[#0F1F14] font-extrabold">1,250+ Indian families</strong> served</span>
            <span className="text-[#95A39B] font-normal">·</span>
            <span><strong className="text-[#0F1F14] font-extrabold">₹150 Cr</strong> recovered</span>
            <span className="text-[#95A39B] font-normal">·</span>
            <span><strong className="text-[#0F1F14] font-extrabold">98.4%</strong> case completion</span>
            <span className="hidden sm:inline text-[#95A39B] font-normal">·</span>
            <span className="hidden sm:inline"><strong className="text-[#0F1F14] font-extrabold">22</strong> recovery specialists</span>
          </div>
        </div>
      </div>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#00301A] text-[#95A39B] py-9 text-center text-[13px]">
        <div className={WRAP}>
          <img src={wordmarkImg} alt="ClearClaim" className="w-[130px] mx-auto mb-[18px] block opacity-95" />
          <div className="flex justify-center gap-6 mb-2 flex-wrap">
            <span><strong className="text-white font-bold">Recovery Specialists for Indian Families</strong></span>
            <span>sales@clearclaim.in</span>
          </div>
          <div>
            Edition 01 · 2026 · Compiled in Bengaluru · Valuations are illustrative and based on publicly available BSE and NSE corporate action data.
          </div>
        </div>
      </footer>

      {/* ============ DOWNLOAD FORM MODAL ============ */}
      <div
        id="cc-form-modal"
        className={`cc-optin-modal ${modalOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Download the free report"
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className="modal-card">
          <button type="button" className="modal-close" aria-label="Close" onClick={closeModal}>
            <Close />
          </button>
          <div className="modal-mark"><img src={markImg} alt="ClearClaim" /></div>

          <form onSubmit={handleSubmit} noValidate className="text-[#0F1F14]">
            {!submitted ? (
              <div>
                <div className="mono flex items-center gap-2 !text-[11px] !tracking-[0.18em] text-[#008B45] mb-1">
                  <Lock className="w-[14px] h-[14px]" />
                  Two fields. Then the download is yours.
                </div>
                <p className="text-[14px] text-[#5F6E66] mb-[18px]">Both fields must be valid to activate the button.</p>

                {/* Email */}
                <div className={`field mb-[14px] ${emailValid ? "valid" : ""}`}>
                  <label htmlFor="cc-email" className="block text-[13px] font-bold text-[#1F3027] mb-[6px]">Your email</label>
                  <input
                    type="email"
                    id="cc-email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    autoComplete="email"
                    required
                  />
                  <span className="field-check"><Check className="stroke-white" /></span>
                </div>

                {/* WhatsApp — international (intl-tel-input, India default) */}
                <div className={`field mb-[14px] ${phoneValid ? "valid" : ""}`}>
                  <label htmlFor="cc-phone" className="block text-[13px] font-bold text-[#1F3027] mb-[6px]">Your WhatsApp number</label>
                  <input
                    type="tel"
                    id="cc-phone"
                    name="whatsapp"
                    ref={phoneInputRef}
                    onInput={recheckPhone}
                    onBlur={recheckPhone}
                    autoComplete="tel"
                    inputMode="tel"
                    required
                  />
                  <span className="field-check"><Check className="stroke-white" /></span>
                </div>

                <button type="submit" className={`unlock-btn ${ready ? "unlocked" : ""}`} disabled={!ready}>
                  <Lock className="lock" />
                  <span>{ready ? "Download The Free Report" : "Fill both fields to continue"}</span>
                  <Arrow className="arrow" />
                </button>

                <p className="text-[12px] text-[#5F6E66] mt-[14px] text-center leading-[1.55]">
                  <strong className="text-[#1F3027] font-bold">No spam. No surprise sales calls.</strong> Unsubscribe anytime. We never share your information with third parties.
                </p>
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="success-icon"><Check /></div>
                <div className="text-[22px] font-extrabold text-[#00582C] mb-2">Check your inbox.</div>
                <p className="text-[15px] text-[#5F6E66] leading-[1.6]">Your copy of the report is on its way to your email and WhatsApp. Taking you to ClearClaim now…</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClearClaimLanding;
