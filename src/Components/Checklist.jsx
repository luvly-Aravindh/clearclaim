const checklistItems = [
  {
    title: "Real Numbers Before You Spend Anything",
    description:
      'Most "DIY" families spend ₹40,000+ on stamps, notary, and consultants before knowing if recovery is even worth it. ClearClaim gives you the value first, free.',
  },
  {
    title: "Originals Stay In Your Safe Until A Signed Agreement",
    description:
      "You never courier originals based on a phone call. Documents move only after a written, signed service agreement is in your hands. Period.",
  },
  {
    title: "Fixed Fee, Not A Percentage Of Your Family's Wealth",
    description:
      "Most recovery agents take 15% to 30% of what they recover. On ₹41 lakh, that is ₹6 to 12 lakh. Our quote is a fixed number in writing. You decide if it is fair.",
  },
  {
    title: "Plain-Language Checklists, Not Legal Jargon",
    description:
      "You get a one-page checklist in English (or Hindi if requested) of exactly what is needed at each stage. No CA glossary. No surprise stamp paper trips.",
  },
  {
    title: "Most Recovery Cases Need Under 5 Hours Of Your Time",
    description:
      "Across the entire recovery, end to end. Mostly WhatsApp messages, document signatures, and one or two video calls if the case needs them.",
  },
  {
    title: "One Specialised Team. Not A Generalist Lawyer Or CA.",
    description:
      "The IEPF and RTA process was designed for full-time professionals. We are full-time professionals. We file these every day. Generalists were never built for this.",
  },
];

const Checklist = () => {
  return (
    <section className="bg-green-soft py-24">
      <div className="max-w-[880px] mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-4">

          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-green-dark font-medium inline-block mb-3.5">
            ◆ The Old Way · The ClearClaim Way
          </span>

          <h2 className="font-archivo font-black text-[clamp(30px,4vw,48px)] tracking-tight text-navy">
            Recovering Forgotten Shares Has Never Been This{" "}
            <em className="italic">Clear</em>
          </h2>
        </div>

        {/* Cards */}
        <div className="mt-12 flex flex-col gap-3.5">

          {checklistItems.map((item, i) => (
            <div
              key={i}
              className="check-card bg-white border border-black/10 rounded-[14px] p-[22px] px-[26px] flex gap-[18px] items-start shadow-sm hover:shadow-md"
            >

              <div className="flex-shrink-0 w-[34px] h-[34px] bg-gradient-to-b from-green to-green-dark rounded-full flex items-center justify-center text-white font-black text-[16px] mt-0.5 shadow-[0_4px_10px_rgba(0,190,93,0.30)]">
                ✓
              </div>

              <div>
                <h4 className="font-archivo font-bold text-[17px] text-navy mb-1.5">
                  {item.title}
                </h4>

                <p className="text-[15px] text-slate leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Checklist;
