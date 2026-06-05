const CtaStrip = ({
  label = "Get My Free Share Valuation",
  bullets = [
    "Most families finish submission in under 2 minutes",
  ],
  bg = "bg-white",
  textColor = "text-mute",
  onOpenModal,
}) => {
  return (
    <div className={`py-12 ${bg} text-center`}>
      <div className="max-w-[1180px] mx-auto px-6 flex flex-col items-center gap-3.5">

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
          {label}
        </button>

        <div className={`font-mono text-[11px] tracking-[0.14em] uppercase ${textColor}`}>
          {bullets.map((b, i) => (
            <span key={i}>
              <span className="text-green font-bold mr-1">✓</span>
              {b}
              {i < bullets.length - 1 && <>&nbsp;&nbsp;</>}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CtaStrip;
