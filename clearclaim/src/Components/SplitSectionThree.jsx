const SplitSectionThree = () => {
  return (
    <section className="bg-green-soft py-24">
      <div className="max-w-[1180px] mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div>

            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-green-dark font-medium inline-block mb-3.5">
              ◆ Step Three · Decide On Your Terms
            </span>

            <h2 className="font-archivo font-black text-[clamp(30px,4vw,48px)] tracking-tight text-navy mb-5 mt-3.5">
              You Move Forward <em className="italic">Only</em> When You Choose To
            </h2>

            <p className="text-[17px] text-slate leading-relaxed mb-3.5">
              This is not a sales call. There is no follow-up sequence designed to pressure you. There is no countdown timer.
            </p>

            <p className="text-[17px] text-slate leading-relaxed mb-3.5">
              <b className="text-navy font-semibold">You can sit on it.</b> The certificates are not going anywhere. Some families take 6 months to decide. That is fine.
            </p>

            <p className="text-[17px] text-slate leading-relaxed mb-3.5">
              <b className="text-navy font-semibold">You can do it yourself.</b> We give you the category and the path. If you have the time, the patience, and a tolerant lawyer, do it. We are not insulted.
            </p>

            <p className="text-[17px] text-slate leading-relaxed mb-6">
              <b className="text-navy font-semibold">You can engage ClearClaim for the full recovery.</b> Fixed fee in writing. Milestone payments. Refund assurance. No pressure to decide today.
            </p>

            <p className="text-[17px] text-slate leading-relaxed">
              <b className="text-navy font-semibold">Your money. Your timeline. Your call.</b>
            </p>

            {/* Testimonial */}
            <div className="mt-7 p-[18px] bg-white border-l-[3px] border-green rounded-lg shadow-sm">

              <div className="text-green text-[13px] tracking-[2px] mb-1.5">
                ★ ★ ★ ★ ★
              </div>

              <p className="text-[15px] italic text-navy-2 mb-2 leading-relaxed">
                "I sat on the recovery report for 4 months before deciding. They never once chased. When I came back, the case was open and they picked up exactly where it ended."
              </p>

              <div className="flex items-center gap-2.5 text-[13px] text-slate">

                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-light to-green-soft flex items-center justify-center font-black text-[14px] text-green-dark">
                  V
                </div>

                <div>
                  <b>Sandeep Nair</b> · Dubai, UAE
                </div>
              </div>
            </div>
          </div>

          {/* Right Browser Card */}
          <div>

            <div className="bg-white border border-black/10 rounded-[18px] p-3.5 shadow-md">

              <div className="bg-white rounded-[10px] overflow-hidden border border-black/10">

                {/* Top Bar */}
                <div className="bg-navy px-3.5 py-2.5 flex items-center gap-2">

                  <div className="flex gap-1.5">
                    <span className="w-[9px] h-[9px] rounded-full bg-red"></span>
                    <span className="w-[9px] h-[9px] rounded-full bg-yellow"></span>
                    <span className="w-[9px] h-[9px] rounded-full bg-green"></span>
                  </div>

                  <div className="flex-1 bg-white/10 text-green-light font-mono text-[10px] px-2.5 py-1.5 rounded-md tracking-[0.06em]">
                    clearclaim.in/your-options
                  </div>
                </div>

                {/* Content */}
                <div className="p-[18px]">

                  <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-green-dark font-medium inline-block mb-3">
                    ◆ Your Three Options
                  </span>

                  <div className="bg-blue-light p-3.5 px-4 rounded-[10px] mb-2.5 border-l-[3px] border-blue">
                    <div className="font-bold text-navy mb-1 text-[14px]">
                      A. Wait. No deadline.
                    </div>
                    <div className="text-[13px] text-slate">
                      Your case stays open in our system.
                    </div>
                  </div>

                  <div className="bg-yellow-light p-3.5 px-4 rounded-[10px] mb-2.5 border-l-[3px] border-yellow">
                    <div className="font-bold text-navy mb-1 text-[14px]">
                      B. DIY With Our Roadmap.
                    </div>
                    <div className="text-[13px] text-slate">
                      We send the category + steps. You file.
                    </div>
                  </div>

                  <div
                    className="p-3.5 px-4 rounded-[10px] border-l-[3px] border-green"
                    style={{
                      background:
                        "linear-gradient(135deg,#D4EFD5,#EAF7E9)",
                    }}
                  >
                    <div className="font-bold text-navy mb-1 text-[14px]">
                      C. ClearClaim Full Recovery.
                    </div>
                    <div className="text-[13px] text-slate">
                      Fixed fee. Refund assurance. Milestone-based.
                    </div>
                  </div>

                  <div className="mt-[18px] pt-3.5 border-t border-black/5 text-center font-archivo font-black text-[20px] text-green-dark">
                    No pressure to decide today.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SplitSectionThree;
