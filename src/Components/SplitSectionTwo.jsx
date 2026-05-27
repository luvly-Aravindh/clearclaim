const SplitSectionTwo = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-[1180px] mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left Card */}
          <div className="order-2 md:order-1">

            <div className="bg-white border border-black/10 rounded-[18px] p-3.5 shadow-md rotate-[1.2deg]">

              <div className="bg-white rounded-[10px] overflow-hidden border border-black/10">

                {/* Top Bar */}
                <div className="bg-navy px-3.5 py-2.5 flex items-center gap-2">

                  <div className="flex gap-1.5">
                    <span className="w-[9px] h-[9px] rounded-full bg-red"></span>
                    <span className="w-[9px] h-[9px] rounded-full bg-yellow"></span>
                    <span className="w-[9px] h-[9px] rounded-full bg-green"></span>
                  </div>

                  <div className="flex-1 bg-white/10 text-green-light font-mono text-[10px] px-2.5 py-1.5 rounded-md tracking-[0.06em]">
                    clearclaim.in/case/CC-04829
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">

                  <div className="flex justify-between items-center py-3 border-b border-black/5">
                    <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-mute font-medium">
                      Case ID
                    </span>

                    <span className="font-archivo font-black text-[20px] text-navy">
                      CC-04829
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-black/5">
                    <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-mute font-medium">
                      Companies Identified
                    </span>

                    <span className="font-archivo font-black text-[20px] text-navy">
                      3 of 3
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-black/5">
                    <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-mute font-medium">
                      Estimated Value
                    </span>

                    <span className="font-archivo font-semibold text-[20px] text-green-dark">
                      ₹14,73,200
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-black/5">

                    <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-mute font-medium">
                      Claim Category
                    </span>

                    <span className="bg-blue-light text-navy-2 px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.1em] uppercase font-bold">
                      RTA-Only
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3">

                    <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-mute font-medium">
                      Originals Needed Now?
                    </span>

                    <span className="bg-green-light text-green-deep px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.1em] uppercase font-bold">
                      No
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mt-4.5">

                    <div className="bg-green-light rounded-full h-2.5 overflow-hidden relative mt-[18px]">

                      <div
                        className="h-full progress-shimmer relative rounded-full"
                        style={{
                          width: "62%",
                          background:
                            "linear-gradient(90deg,#00984A,#00BE5D)",
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between mt-2 font-mono text-[10px] tracking-[0.1em] uppercase text-mute">
                      <span>Claim Review</span>
                      <span>62% · 14 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="order-1 md:order-2">

            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-green-dark font-medium inline-block mb-3.5">
              ◆ Step Two · Skip The Maze
            </span>

            <h2 className="font-archivo font-black text-[clamp(30px,4vw,48px)] tracking-tight text-navy mb-5 mt-3.5">
              Skip The IEPF-5 Form, The RTA Loops, And The Legal Heir
              Confusion
            </h2>

            <p className="text-[17px] text-slate leading-relaxed mb-3.5">
              You already tried.{" "}
              <b className="text-navy font-semibold">
                DP ID. Client ID. Folio number.
              </b>{" "}
              The IEPF helpline that nobody answers. The company that
              bounces you back to the RTA. The RTA that bounces you back
              to the company.
            </p>

            <p className="text-[17px] text-slate leading-relaxed mb-3.5">
              Our recovery team tells you exactly which of three
              categories your case falls into:
            </p>

            {/* List */}
            <div className="pl-[18px] border-l-[3px] border-green text-[15px] text-navy-2 my-[18px]">

              <p>
                <b className="font-semibold">1. RTA-only.</b> Cleanest
                path. Often closes in 60 to 90 days.
              </p>

              <p>
                <b className="font-semibold">2. IEPF claim.</b>{" "}
                Government-side filing. Documented timeline.
              </p>

              <p>
                <b className="font-semibold">3. Legal heir route.</b>{" "}
                Succession or transmission needed first.
              </p>
            </div>

            <p className="text-[17px] text-slate leading-relaxed">
              You walk away knowing what you have, what it is worth, and
              what it takes.{" "}
              <b className="text-navy font-semibold">
                That clarity alone is worth the 2 minutes.
              </b>
            </p>

            {/* Testimonial */}
            <div className="mt-7 p-[18px] bg-green-soft border-l-[3px] border-green rounded-lg">

              <div className="text-green text-[13px] tracking-[2px] mb-1.5">
                ★ ★ ★ ★ ★
              </div>

              <p className="text-[15px] italic text-navy-2 mb-2 leading-relaxed">
                "Eight months I spent confused between CA and lawyer.
                The ClearClaim team told me in one message it was a
                transmission case, not succession. Saved me ₹25,000 in
                wrong filings."
              </p>

              <div className="flex items-center gap-2.5 text-[13px] text-slate">

                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-light to-green-soft flex items-center justify-center font-black text-[14px] text-green-dark">
                  A
                </div>

                <div>
                  <b>Ananya R.</b> · Austin, TX
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SplitSectionTwo;