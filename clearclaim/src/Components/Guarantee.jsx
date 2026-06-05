const Guarantee = () => {
  return (
    <section className="bg-green-soft py-24 text-center relative overflow-hidden">
      <div className="max-w-[880px] mx-auto px-6">

        {/* Badge */}
        <div
          className="w-[120px] h-[120px] mx-auto mb-6 rounded-[22px] flex items-center justify-center relative -rotate-3"
          style={{
            background:
              "linear-gradient(180deg,#00BE5D 0%,#00984A 100%)",
            boxShadow:
              "0 14px 38px rgba(0,190,93,0.40), inset 0 2px 0 rgba(255,255,255,0.25)",
          }}
        >
          <div className="absolute inset-2 border-2 border-white/40 rounded-[16px]"></div>

          {/* Shield/check logo */}
          <svg
            className="w-[60px] h-[60px] relative z-10"
            viewBox="0 0 64 64"
            fill="none"
          >
            <path
              d="M32 6 L54 14 V32 C54 46 44 56 32 60 C20 56 10 46 10 32 V14 Z"
              fill="#ffffff"
              fillOpacity="0.15"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M22 32 L29 39 L43 25"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-green-dark font-medium inline-block mb-3.5">
          ◆ ClearClaim Promise
        </span>

        <h2 className="font-archivo font-black text-[clamp(30px,4vw,48px)] tracking-tight text-navy mt-3.5 max-w-[780px] mx-auto mb-[18px]">
          The Share Valuation Is Free, Or You Walk Away.{" "}
          <em className="italic">No Questions.</em>
        </h2>

        <p className="text-[18px] text-slate max-w-[680px] mx-auto mb-[18px] leading-relaxed">
          If your valuation report does not give you a clear current market value, a defined claim category, and a written next-step roadmap, you owe us nothing. You walk. We do not chase.
        </p>

        <p className="text-[18px] text-slate max-w-[680px] mx-auto mb-6 leading-relaxed">
          And if you do choose to engage ClearClaim for full recovery and the case fully completes without recovery happening, our written{" "}
          <b className="text-navy font-semibold">refund assurance</b> protects you.
        </p>

        <div className="font-archivo font-black italic text-[26px] text-green-dark mt-6">
          No clauses. No fine print games.
        </div>
      </div>
    </section>
  );
};

export default Guarantee;
