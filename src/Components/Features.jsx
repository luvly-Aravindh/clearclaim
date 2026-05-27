const features = [
  {
    title: "2-Minute Submission",
    description:
      "Share certificate details from a phone or laptop. No appointments. No paperwork.",
    icon: (
      <svg
        className="w-[30px] h-[30px] stroke-green-dark fill-none"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: "No Originals Required",
    description:
      "Originals stay in your safe. Our team works from a clear photo or scan at this stage.",
    icon: (
      <svg
        className="w-[30px] h-[30px] stroke-green-dark fill-none"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M4 7h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        <path d="M9 4h6v3H9z" />
        <circle cx="12" cy="14" r="2" />
      </svg>
    ),
  },
  {
    title: "Verified Market Valuation",
    description:
      "Today's market price across NSE and BSE. Bonus and split history factored in. Not a guess.",
    icon: (
      <svg
        className="w-[30px] h-[30px] stroke-green-dark fill-none"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M14 7h7v7" />
      </svg>
    ),
  },
  {
    title: "Zero Commitment",
    description:
      "You see your number, your category, your path. Then you decide. No call required.",
    icon: (
      <svg
        className="w-[30px] h-[30px] stroke-green-dark fill-none"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "WhatsApp Updates",
    description:
      "Plain-language status messages. No portal logins. No jargon. No ghosting.",
    icon: (
      <svg
        className="w-[30px] h-[30px] stroke-green-dark fill-none"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M21 11.5a8.4 8.4 0 0 1-1 4 8.5 8.5 0 0 1-7.6 4.5 8.4 8.4 0 0 1-4-1L3 21l2-5.4a8.4 8.4 0 0 1-1-4 8.5 8.5 0 0 1 4.5-7.6 8.4 8.4 0 0 1 4-1 8.5 8.5 0 0 1 8 8z" />
      </svg>
    ),
  },
  {
    title: "Fixed Fee Quote",
    description:
      "If you choose to proceed, you get a fixed price in writing. Never a percentage of recovery.",
    icon: (
      <svg
        className="w-[30px] h-[30px] stroke-green-dark fill-none"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M3 12h4l3 9 4-18 3 9h4" />
      </svg>
    ),
  },
];

const Features = () => {
  return (
    <section className="py-[88px] bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-4">

          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-green-dark font-medium inline-block mb-3.5">
            ◆ What Our Recovery Team Does
          </span>

          <h2 className="font-archivo font-black text-[clamp(30px,4vw,48px)] tracking-tight text-navy mb-3.5">
            Everything Is Just You Need To Find Your Number,{" "}
            <em className="italic">Before</em>You Commit To Anything
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 mt-12">

          {features.map((f, i) => (
            <div key={i} className="text-center px-2">

              <div className="w-[72px] h-[72px] mx-auto mb-[18px] bg-gradient-to-b from-green-soft to-green-light rounded-[18px] flex items-center justify-center border border-green/20 shadow-[0_6px_16px_rgba(0,190,93,0.10)]">
                {f.icon}
              </div>

              <h4 className="font-archivo font-bold text-[16px] text-navy mb-1.5">
                {f.title}
              </h4>

              <p className="text-[14px] text-mute leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Features;
