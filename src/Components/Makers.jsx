import Hardik from "../assets/hardik.jpg";
import Shrikant from "../assets/shrikant.jpg";

const Makers = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-12 items-center">
          {/* Left - Profile Cards */}
          <div className="flex md:block justify-center">
            <div className="flex relative">
              <div className="flex items-end justify-center">
                {/* Hardik Card */}
                <div className="w-[clamp(128px,42vw,200px)] bg-white border border-black/10 rounded-[14px] p-3.5 shadow-md -rotate-3 z-10 mr-2">
                  <div className="aspect-square rounded-[10px] overflow-hidden mb-2.5 border border-green-200">
                    <img
                      src={Hardik}
                      alt="Hardik Manek"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="font-bold text-[14px] text-slate-900">
                    Hardik Manek
                  </div>

                  <div className="text-[12px] text-slate-500">
                    Co-Founder &amp; COO
                  </div>
                </div>

                {/* Shrikant Card */}
                <div className="w-[clamp(128px,42vw,200px)] bg-white border border-black/10 rounded-[14px] p-3.5 shadow-md rotate-3 mt-7">
                  <div className="aspect-square rounded-[10px] overflow-hidden mb-2.5 border border-green-200">
                    <img
                      src={Shrikant}
                      alt="Shrikant Pandore"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="font-bold text-[14px] text-slate-900">
                    Shrikant Pandore
                  </div>

                  <div className="text-[12px] text-slate-500">
                    Co-Founder &amp; CEO
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div>
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-green-700 font-medium inline-block mb-3.5">
              ◆ Built By Specialists
            </span>

            <h2 className="font-black text-[clamp(30px,4vw,48px)] tracking-tight text-slate-900 mb-[18px] mt-3.5">
              Made By Recovery Specialists,
              <br />
              <em className="italic">
                For Indian Families
              </em>
            </h2>

            <p className="text-slate-600 mb-3.5 leading-relaxed">
              The IEPF and RTA process was not built for a busy IT manager in
              Bengaluru handling his late father's affairs from his phone on a
              Sunday. It was built for full-time specialists who file these
              claims every week.
            </p>

            <p className="text-slate-600 leading-relaxed">
              That is exactly what we are.{" "}
              <b className="text-slate-900 font-semibold">
                The ClearClaim team has filed claims for 1,250 families across
                22 states
              </b>
              , navigating IEPF, RTA, succession, transmission, and legal heir
              routes daily.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mt-8 flex-wrap">
              <div>
                <div className="font-black text-[38px] text-green-700 leading-none">
                  1,250+
                </div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-slate-500 mt-1 font-semibold">
                  Families Served
                </div>
              </div>

              <div>
                <div className="font-black text-[38px] text-green-700 leading-none">
                  ₹150 Cr
                </div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-slate-500 mt-1 font-semibold">
                  Recovered To Date
                </div>
              </div>

              <div>
                <div className="font-black text-[38px] text-green-700 leading-none">
                  22
                </div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-slate-500 mt-1 font-semibold">
                  States Covered
                </div>
              </div>

              <div>
                <div className="font-black text-[38px] text-green-700 leading-none">
                  98.4%
                </div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-slate-500 mt-1 font-semibold">
                  Client Response Rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Makers;