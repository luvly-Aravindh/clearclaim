import { useEffect } from "react";

const HeroSection = ({ onOpenModal }) => {
  useEffect(() => {
    const playerScript = document.createElement("script");
    playerScript.src = "https://fast.wistia.com/player.js";
    playerScript.async = true;

    const embedScript = document.createElement("script");
    embedScript.src = "https://fast.wistia.com/embed/s242w29jyn.js";
    embedScript.async = true;
    embedScript.type = "module";

    document.body.appendChild(playerScript);
    document.body.appendChild(embedScript);

    return () => {
      document.body.removeChild(playerScript);
      document.body.removeChild(embedScript);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative overflow-hidden sm:py-20 py-12 pb-16"
      style={{
        background: `
          radial-gradient(ellipse at top right, rgba(0,190,93,0.10), transparent 55%),
          radial-gradient(ellipse at bottom left, rgba(103,142,240,0.06), transparent 55%),
          #fff
        `,
      }}
    >
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="text-center">

          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2.5 mb-6 sm:px-[18px] px-4 py-[9px] rounded-full font-mono sm:text-[11px] text-[8px] tracking-[0.14em] uppercase font-semibold"
            style={{
              background: "#FDECEE",
              color: "#C42330",
              border: "1px solid rgba(217,45,58,0.22)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full pulse-dot-red flex-shrink-0"
              style={{ background: "#D92D3A" }}
            ></span>

            Share Recovery Specialists For Forgotten Share Certificates
          </div>

          {/* Heading */}
          <h1 className="font-archivo font-black tracking-tight leading-none text-navy text-[clamp(36px,5.5vw,64px)] mb-5 max-w-[1000px] mx-auto">
            Your Parents' Old Share Certificates Could Be{" "}
            <em className="text-green-dark not-italic">
              Worth Lakhs Today
            </em>
            . Find Out In 2 Minutes, Free.
          </h1>

          {/* Description */}
          <p className="text-[19px] text-slate max-w-[700px] mx-auto mb-9 leading-relaxed">
            Submit your old certificate details to the ClearClaim team.
            We tell you the current market value, what kind of claim
            applies, and the path forward.{" "}
            <b className="text-navy font-semibold">
              No original documents required. No commitment.
            </b>
          </p>

          {/* Video Wrapper */}
          <div
            className="max-w-[920px] mx-auto relative p-3.5 rounded-[20px] shadow-lg border border-green/20 vsl-glow"
            style={{
              background:
                "linear-gradient(180deg, #D4EFD5, #EAF7E9)",
            }}
          >

{/* Watch This */}
<div className="hidden md:flex flex-col items-start absolute -top-[58px] left-[3%] z-20 pointer-events-none select-none -rotate-[7deg]">

  <span
    className="handwrite font-bold text-green-dark leading-none ml-1 text-[40px]"
    style={{
      textShadow: "0 1px 0 rgba(255,255,255,0.7)",
    }}
  >
    watch this
  </span>

  <svg
    width="92"
    height="66"
    viewBox="0 0 92 66"
    fill="none"
    className="-mt-1"
  >
    <path
      d="M12 8 C 46 2, 86 16, 70 60"
      stroke="#00984A"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    />

    <path
      d="M52 50 L71 62 L82 42"
      stroke="#00984A"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
</div>

            {/* Video */}
            <div className="relative rounded-xl overflow-hidden bg-navy aspect-video shadow-[0_8px_24px_rgba(22,29,52,0.22)]">

              <style>
                {`
                  wistia-player[media-id='s242w29jyn']:not(:defined) {
                    background:
                      center / cover no-repeat
                      url('https://fast.wistia.com/embed/medias/s242w29jyn/swatch');

                    display: block;
                    filter: blur(5px);
                    padding-top: 56.25%;
                  }
                `}
              </style>

              <wistia-player
                media-id="s242w29jyn"
                aspect="1.7777777777777777"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3.5 mt-9">

            <button
              type="button"
              onClick={onOpenModal}
              className="btn-shine inline-flex items-center gap-2.5 text-white font-black text-[17px] px-9 py-[18px] rounded-full transition-all hover:-translate-y-0.5 active:translate-y-0.5 font-archivo"
              style={{
                background:
                  "linear-gradient(180deg, #3D6FF0 0%, #2450C4 100%)",
                boxShadow:
                  "0 4px 0 #173A8F, 0 8px 24px rgba(61,111,240,0.42), inset 0 1px 0 rgba(255,255,255,0.28)",
              }}
            >
              Get My Free Valuation
            </button>

            <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-mute">
              <span className="text-green font-bold mr-1">✓</span>
              No documents required &nbsp;

              <span className="text-green font-bold mr-1">✓</span>
              No commitment &nbsp;

              <span className="text-green font-bold mr-1">✓</span>
              2-minute submission
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;