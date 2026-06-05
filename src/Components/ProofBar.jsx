import Meera from "../assets/Meera.png";
import Rohit from "../assets/Rohit.png";
import Prakash from "../assets/Prakash.png";

const testimonials = [
  {
    id: 1,
    name: "Meera K.",
    location: "Mumbai · Recovered ₹22 lakh",
    image: Meera,
    content: (
      <>
        "Found certificates from{" "}
        <b className="font-semibold text-slate-900">
          1987 in my late father's almirah
        </b>
        . The ClearClaim team valued them in 18 minutes and walked me through
        the IEPF route. I would have given up without them."
      </>
    ),
  },
  {
    id: 2,
    name: "Rohit Agarwal",
    location: "Pune · Recovered ₹11 lakh",
    image: Rohit,
    content: (
      <>
        "I had spent{" "}
        <b className="font-semibold text-slate-900">
          ₹40,000 on stamps and notary fees
        </b>{" "}
        getting nowhere. ClearClaim gave me a fixed quote in writing. No
        percentage commission. That alone made me trust them."
      </>
    ),
  },
  {
    id: 3,
    name: "Prakash Venkatesh",
    location: "Chennai · Recovered ₹19 lakh",
    image: Prakash,
    content: (
      <>
        "My mother kept asking <i>'beta, woh shares ka kya hua?'</i> for 8
        months. ClearClaim closed the case in{" "}
        <b className="font-semibold text-slate-900">
          under 5 hours of my time
        </b>{" "}
        across the entire process. WhatsApp updates at every step."
      </>
    ),
  },
];

const ProofBar = () => {
  return (
    <section className="bg-[#F3FAF6] py-16 border-y border-black/10">
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="text-[22px] text-green-600 tracking-[2px] mb-2">
            ★ ★ ★ ★ ★
          </div>

          <h3 className="font-black text-[24px] tracking-tight text-slate-900">
            See why{" "}
            <span className="text-green-700 font-medium">
              1,250+ Indian families
            </span>{" "}
            trust ClearClaim's recovery specialists to find their number first
          </h3>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-9">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-black/10 rounded-2xl p-6 flex flex-col shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              {/* Stars */}
              <div className="text-green-600 text-sm tracking-[2px] mb-3">
                ★ ★ ★ ★ ★
              </div>

              {/* Content */}
              <p className="text-[15px] text-slate-700 leading-relaxed mb-5 flex-1">
                {item.content}
              </p>

              {/* User */}
              <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-[52px] h-[52px] rounded-full object-cover border-[3px] border-white shadow-lg flex-shrink-0"
                />

                <div>
                  <div className="font-semibold text-sm text-slate-900">
                    {item.name}
                  </div>

                  <div className="text-xs text-slate-500">
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