const TopBar = ({ onOpenModal }) => {
  return (
    <div className="bg-navy text-white px-6 py-3.5 flex items-center justify-between gap-6 sticky top-0 z-50 border-b border-white/5 backdrop-blur-sm">
      
      <a
        href="#top"
        className="flex items-center gap-2.5 no-underline flex-shrink-0"
      >
        <img
          src="https://www.clearclaim.in/_next/static/media/logo.0..s._s9yl8ut.png"
          alt="ClearClaim logo"
          className="w-36"
        />
      </a>

      <div className="hidden md:block font-mono text-[11px] tracking-widest uppercase text-white/70 text-center flex-1">
        Share recovery specialists for Indian families with old share
        certificates ·{" "}
        <b className="text-green-light font-medium">
          1,250 families served
        </b>{" "}
        ·{" "}
        <b className="text-green-light font-medium">
          ₹150 Cr recovered
        </b>
      </div>

      <button
        type="button"
        onClick={onOpenModal}
        className="text-white px-5 py-2.5 rounded-full font-bold text-sm tracking-wide whitespace-nowrap transition-all hover:-translate-y-px flex-shrink-0"
        style={{
          background:
            "linear-gradient(180deg,#3D6FF0 0%,#2450C4 100%)",
          boxShadow:
            "0 6px 16px rgba(61,111,240,0.34),0 2px 4px rgba(36,80,196,0.30)",
        }}
      >
        Get Free Valuation
      </button>
    </div>
  );
};

export default TopBar;