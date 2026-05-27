const steps = [
  {
    num: 1,
    title: "Submit Certificate Details",
    description:
      "Snap a photo or scan. Share folio numbers, company names, holder details. No originals. No couriers. Two minutes total.",
  },
  {
    num: 2,
    title: "Receive Your Valuation Report",
    description:
      "Within 24 hours you get the current market value, the underlying companies, and the claim category your case falls into. In plain English on WhatsApp.",
  },
  {
    num: 3,
    title: "Decide On Your Timeline",
    description:
      "Sit on it. DIY with our roadmap. Or hire ClearClaim full recovery on a fixed fee. Your call. No pressure. No follow-up sequence.",
  },
];

const ThreeSteps = ({ onOpenModal }) => {
  return (
    <section className="bg-navy py-24 relative overflow-hidden">

      <div
        className="absolute -top-[300px] -right-[300px] w-[700px] h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,190,93,0.14), transparent 60%)",
        }}
      ></div>

      <div className="max-w-[1180px] mx-auto px-6 relative z-10">

        {/* Heading */}
        <div className="text-center max-w-[760px] mx-auto mb-4">

          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-green-light font-medium inline-block mb-3.5">
            ◆ How It Works
          </span>

          <h2 className="font-archivo font-black text-[clamp(30px,4vw,48px)] tracking-tight text-white mb-3.5">
            Find Your Number In <em className="italic">3 Simple Steps</em>
          </h2>

          <p className="text-[18px] text-white/70 leading-relaxed">
            From "I have no idea what these certificates are worth" to "I know exactly what I have and what to do next" in under 24 hours.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">

          {steps.map((step) => (
            <div
              key={step.num}
              className="step-card bg-white/5 border border-white/10 rounded-[18px] p-8 relative backdrop-blur-sm"
            >

              <div className="font-archivo font-black text-[80px] leading-none text-green mb-3.5">
                {step.num}
              </div>

              <h4 className="font-archivo font-bold text-[20px] text-white mb-2.5">
                {step.title}
              </h4>

              <p className="text-white/75 text-[15px] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}

        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3.5 mt-12">

          <button
            type="button"
            onClick={onOpenModal}
            className="btn-shine inline-flex items-center gap-2.5 text-white font-black text-[17px] px-9 py-[18px] rounded-full transition-all hover:-translate-y-0.5 font-archivo"
            style={{
              background:
                "linear-gradient(180deg, #3D6FF0 0%, #2450C4 100%)",
              boxShadow:
                "0 4px 0 #173A8F, 0 8px 24px rgba(61,111,240,0.42), inset 0 1px 0 rgba(255,255,255,0.28)",
            }}
          >
            Start Step 1 Now
          </button>

          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/55">
            <span className="text-green font-bold mr-1">✓</span>
            Free &nbsp;
            <span className="text-green font-bold mr-1">✓</span>
            2 minutes &nbsp;
            <span className="text-green font-bold mr-1">✓</span>
            Reply within 24 hrs
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeSteps;
