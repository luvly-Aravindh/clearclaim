const reviewBadges = [
  { name: "Google", rating: "4.9 / 5", reviews: "312 reviews" },
  { name: "Trustpilot", rating: "4.8 / 5", reviews: "187 reviews" },
  { name: "Justdial", rating: "4.9 / 5", reviews: "428 reviews" },
];

const testimonials = [
  {
    initial: "S",
    title: "The valuation was the unlock.",
    body:
      "I had no idea my mother's 1994 certificates were worth almost ₹18 lakh. ClearClaim gave me a clear number and the IEPF route in under a day. I would have never started without that report.",
    name: "Suresh V.",
    role: "IT Manager, Delhi",
  },
  {
    initial: "M",
    title: "Fixed fee. No percentage drama.",
    body:
      'Three other "consultants" wanted 22% to 28% of recovery. ClearClaim quoted a fixed ₹28,000 in writing before I shared a single original. That is the only honest pricing I saw in this category.',
    name: "Meenakshi R.",
    role: "Operations Head, Mumbai",
  },
  {
    initial: "K",
    title: "WhatsApp updates kept me sane.",
    body:
      "Three of us siblings, two cities, one in Toronto. ClearClaim used a single WhatsApp group, posted milestone updates, and we always knew where the case was. Closed it in 11 weeks.",
    name: "Kiran Deshpande",
    role: "Jaipur",
  },
  {
    initial: "D",
    title: "They told me I did not need them.",
    body:
      'My case was simple RTA-only. The recovery team said outright: "you can do this yourself, here are the 4 steps." Honest enough that I came back two months later for a more complex IEPF case.',
    name: "Lakshmi Narayanan",
    role: "Pune",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Heading */}
        <div className="text-center max-w-[760px] mx-auto mb-4">

          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-green-dark font-medium inline-block mb-3.5">
            ◆ What Families Say
          </span>

          <h2 className="font-archivo font-black text-[clamp(30px,4vw,48px)] tracking-tight text-navy">
            Hear Why Indian Families Trust <br />
            The <em className="italic">ClearClaim Team</em>
          </h2>
        </div>

        {/* Review badges */}
        <div className="flex justify-center gap-4 flex-wrap mt-4 mb-12">

          {reviewBadges.map((b) => (
            <div
              key={b.name}
              className="bg-white border border-black/10 px-[18px] py-2.5 rounded-full flex items-center gap-2 text-[13px] text-navy shadow-sm"
            >
              <b>{b.name}</b>{" "}
              <span className="text-green text-[11px] tracking-[1.5px]">
                ★★★★★
              </span>{" "}
              {b.rating} from {b.reviews}
            </div>
          ))}

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">

          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-black/10 rounded-[14px] p-[22px] shadow-sm flex flex-col hover:-translate-y-1 hover:shadow-md transition-all"
            >

              <div className="text-green text-[13px] tracking-[2px] mb-2.5">
                ★ ★ ★ ★ ★
              </div>

              <h4 className="font-archivo font-bold text-[15px] text-navy mb-2">
                {t.title}
              </h4>

              <p className="text-[14px] text-slate leading-relaxed flex-1 mb-3.5">
                {t.body}
              </p>

              <div className="flex items-center gap-2.5 pt-3 border-t border-black/5 text-[13px]">

                <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-green-light to-green-soft flex items-center justify-center font-black text-[14px] text-green-dark">
                  {t.initial}
                </div>

                <div>
                  <div className="font-semibold text-navy">
                    {t.name}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-mute">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
