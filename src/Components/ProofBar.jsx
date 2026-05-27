const testimonials = [
  {
    id: 1,
    name: "Meera K.",
    location: "Mumbai · Recovered ₹22 lakh",
    initial: "M",
    content: (
      <>
        "Found certificates from{" "}
        <b className="font-semibold text-navy">
          1987 in my late father's almirah
        </b>
        . The ClearClaim team valued them in 18 minutes and walked me
        through the IEPF route. I would have given up without them."
      </>
    ),
  },
  {
    id: 2,
    name: "Rohit Agarwal",
    location: "Pune · Recovered ₹11 lakh",
    initial: "R",
    content: (
      <>
        "I had spent{" "}
        <b className="font-semibold text-navy">
          ₹40,000 on stamps and notary fees
        </b>{" "}
        getting nowhere. ClearClaim gave me a fixed quote in writing.
        No percentage commission. That alone made me trust them."
      </>
    ),
  },
  {
    id: 3,
    name: "Prakash Venkatesh",
    location: "Chennai · Recovered ₹19 lakh",
    initial: "P",
    content: (
      <>
        "My mother kept asking{" "}
        <i>'beta, woh shares ka kya hua?'</i> for 8 months.
        ClearClaim closed the case in{" "}
        <b className="font-semibold text-navy">
          under 5 hours of my time
        </b>{" "}
        across the entire process. WhatsApp updates at every step."
      </>
    ),
  },
];

const ProofBar = () => {
  return (
    <section className="bg-green-soft py-16 border-y border-black/10">
      <div className="max-w-[1180px] mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-8">
          <div className="text-[22px] text-green tracking-[2px] mb-2">
            ★ ★ ★ ★ ★
          </div>

          <h3 className="font-archivo font-black text-[24px] tracking-tight text-navy">
            See why{" "}
            <em className="not-italic text-green-dark font-normal">
              1,250+ Indian families
            </em>{" "}
            trust ClearClaim's recovery specialists to find their number first
          </h3>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-9">

          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-black/10 rounded-2xl p-6 flex flex-col shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"
            >

              {/* Stars */}
              <div className="text-green text-sm tracking-[2px] mb-3">
                ★ ★ ★ ★ ★
              </div>

              {/* Content */}
              <p className="text-[15px] text-navy-2 leading-relaxed mb-[18px] flex-1">
                {item.content}
              </p>

              {/* User */}
              <div className="flex items-center gap-3 pt-3.5 border-t border-black/5">

                <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-green-light to-green-soft flex items-center justify-center font-black text-[18px] text-green-dark flex-shrink-0 border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
                  {item.initial}
                </div>

                <div>
                  <div className="font-semibold text-sm text-navy">
                    {item.name}
                  </div>

                  <div className="text-xs text-mute">
                    {item.location}
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

export default ProofBar;