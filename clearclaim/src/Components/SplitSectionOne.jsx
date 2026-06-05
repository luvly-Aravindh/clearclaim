const SplitSectionOne = () => {
  return (
    <section className="bg-green-soft py-24">
      <div className="max-w-[1180px] mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div>

            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-green-dark font-medium inline-block mb-3.5">
              ◆ Step One · Find Your Number
            </span>

            <h2 className="font-archivo font-black text-[clamp(30px,4vw,48px)] tracking-tight text-navy mb-5 mt-3.5">
              Discover What Your Certificates Are{" "}
              <em className="italic">Actually</em> Worth Today
            </h2>

            <p className="text-[17px] text-slate leading-relaxed mb-3.5">
              Most families have no idea. Some are sitting on{" "}
              <b className="text-navy font-semibold">₹4 lakh</b>. Some are
              sitting on{" "}
              <b className="text-navy font-semibold">₹41 lakh</b>. We have
              seen both in the same week.
            </p>

            <p className="text-[17px] text-slate leading-relaxed mb-3.5">
              Our valuation team pulls live market data, factors in 30
              years of bonus issues, splits, and amalgamations, and gives
              you the actual current value of what your father bought in
              1991. Or 1987. Or 1995.
            </p>

            <p className="text-[17px] text-slate leading-relaxed mb-3.5">
              You see one clean number. Plus the underlying companies.
              Plus what kind of claim category your case falls into
              (IEPF, RTA-only, or legal heir).
            </p>

            <p className="text-[17px] text-slate leading-relaxed">
              <b className="text-navy font-semibold">
                Free. Before you agree to anything.
              </b>
            </p>
          </div>

          {/* Right Card */}
          <div>

            <div className="bg-white border border-black/10 rounded-[18px] p-3.5 shadow-md -rotate-[1.2deg]">

              <div className="bg-gradient-to-br from-[#FAFFF6] to-[#E9F8E7] border-2 border-green-dark rounded-[10px] p-7 relative cert-inner">

                {/* Badge */}
                <div className="absolute top-[18px] right-[18px] w-[80px] h-[80px] border-[2.5px] border-green-dark text-green-dark rounded-full flex items-center justify-center flex-col font-mono text-[9px] tracking-[0.1em] -rotate-12 bg-white/60 text-center leading-tight font-bold">
                  UNCLAIMED
                  <br />
                  FOUND
                </div>

                {/* Title */}
                <div className="text-center mb-3.5">

                  <div className="text-[22px] text-navy tracking-[0.08em] font-archivo font-bold">
                    RELIANCE INDUSTRIES
                  </div>

                  <div className="font-mono text-[9px] tracking-[0.2em] text-green-dark uppercase mt-1 font-semibold">
                    Equity Share Certificate · 1991
                  </div>
                </div>

                {/* Rows */}
                <div className="flex justify-between font-mono text-[11px] text-navy-2 py-2 border-b border-dashed border-green-dark/30">
                  <span>Folio Number</span>
                  <span className="font-bold">R-04719</span>
                </div>

                <div className="flex justify-between font-mono text-[11px] text-navy-2 py-2 border-b border-dashed border-green-dark/30">
                  <span>Original Holding</span>
                  <span className="font-bold">100 Shares</span>
                </div>

                <div className="flex justify-between font-mono text-[11px] text-navy-2 py-2 border-b border-dashed border-green-dark/30">
                  <span>After 35 Years Of Splits & Bonus</span>
                  <span className="font-bold">2,560 Shares</span>
                </div>

                <div className="flex justify-between font-mono text-[11px] text-navy-2 py-2">
                  <span>Today's Market Value</span>

                  <span className="font-bold text-green-dark">
                    ₹32,84,800
                  </span>
                </div>

                {/* Footer */}
                <div className="text-center mt-3.5 italic text-[14px] text-green-dark">
                  Sample valuation report
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SplitSectionOne;