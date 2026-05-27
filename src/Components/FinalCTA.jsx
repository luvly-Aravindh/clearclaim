const FinalCTA = ({ onOpenModal }) => {
  return (
    <section id="valuation" className="bg-navy py-24 relative overflow-hidden">

      <div
        className="absolute -top-[200px] -right-[200px] w-[560px] h-[560px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(0,190,93,0.18),transparent 60%)",
        }}
      ></div>

      <div
        className="absolute -bottom-[200px] -left-[200px] w-[560px] h-[560px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(103,142,240,0.14),transparent 60%)",
        }}
      ></div>

      <div className="max-w-[1180px] mx-auto px-6 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left content */}
          <div>

            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-green-light font-medium inline-block mb-3.5">
              ◆ ClearClaim · Free Valuation
            </span>

            <h2 className="font-archivo font-black text-[clamp(32px,4vw,48px)] tracking-tight text-white mt-3.5 mb-[18px]">
              Find Out What Your Family's Forgotten Shares Are Worth Today
            </h2>

            <p className="text-white/75 text-[17px] leading-relaxed mb-3.5">
              Your valuation report arrives within 24 hours on WhatsApp. Current market value. Claim category. Step-by-step path forward.{" "}
              <b className="text-white font-semibold">
                Free. No documents. No commitment.
              </b>
            </p>

            <p className="font-archivo font-black text-[24px] text-green-light mt-[18px]">
              Most families are surprised by the wealth hidden in old shares.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mt-9 flex-wrap">

              <div>
                <div className="font-archivo font-black text-[34px] text-green-light">
                  1,250+
                </div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/50">
                  Families Served
                </div>
              </div>

              <div>
                <div className="font-archivo font-black text-[34px] text-green-light">
                  ₹150 Cr
                </div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/50">
                  Recovered
                </div>
              </div>

              <div>
                <div className="font-archivo font-black text-[34px] text-green-light">
                  24 hrs
                </div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/50">
                  Response Time
                </div>
              </div>

            </div>
          </div>

          {/* Right card */}
          <div className="bg-white text-navy rounded-[18px] p-8 shadow-lg border border-white/10 text-center">

            {/* Logo */}
            <svg
              className="w-16 h-16 mx-auto mb-[18px]"
              viewBox="0 0 64 64"
              fill="none"
            >
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="#EAF7E9"
                stroke="#00BE5D"
                strokeWidth="2.5"
              />
              <path
                d="M22 32 L29 39 L43 25"
                stroke="#00984A"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>

            <h3 className="font-archivo font-black text-[24px] text-navy mb-2">
              Book Your Free Valuation Call
            </h3>

            <p className="text-[14px] text-mute mb-7">
              Takes about 2 minutes to submit. We respond on WhatsApp within 24 hours with your verified valuation report.
            </p>

            <button
              type="button"
              onClick={onOpenModal}
              className="btn-shine inline-flex items-center justify-center gap-2.5 w-full text-white font-black text-[17px] px-9 py-[18px] rounded-full transition-all hover:-translate-y-0.5 font-archivo"
              style={{
                background:
                  "linear-gradient(180deg, #3D6FF0 0%, #2450C4 100%)",
                boxShadow:
                  "0 4px 0 #173A8F, 0 8px 24px rgba(61,111,240,0.42), inset 0 1px 0 rgba(255,255,255,0.28)",
              }}
            >
              Book My Free Valuation Call
            </button>

            <div className="flex gap-3.5 justify-center mt-[22px] flex-wrap">

              <div className="flex items-center gap-1.5 font-mono text-[12px] tracking-[0.06em] uppercase text-mute">
                <span className="text-green font-bold">✓</span> 2 min
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[12px] tracking-[0.06em] uppercase text-mute">
                <span className="text-green font-bold">✓</span> No originals
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[12px] tracking-[0.06em] uppercase text-mute">
                <span className="text-green font-bold">✓</span> No commitment
              </div>
            </div>

            <p className="text-[12px] text-mute mt-[18px] leading-relaxed">
              Only 3 valuation slots remaining for today. Confidential and secure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
