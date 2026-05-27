const Footer = ({ onOpenModal }) => {
  return (
    <footer className="bg-navy text-white/60 py-12 pb-8 border-t border-white/5">
      <div className="max-w-[1180px] mx-auto px-6">

        <div className="flex justify-between gap-8 flex-wrap items-start mb-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 text-white mb-2">
              <img
                src="https://www.clearclaim.in/_next/static/media/logo.0..s._s9yl8ut.png"
                alt="ClearClaim"
                className="h-16 w-auto object-contain"
              />
            </div>

            <div className="text-[13px] mt-2 max-w-[300px] leading-relaxed">
              Share recovery specialists for Indian families recovering forgotten share certificates and unclaimed equity from deceased relatives.
            </div>
          </div>

          {/* Services */}
          <div>
            <h5 className="font-mono text-[11px] tracking-[0.14em] uppercase text-green-light font-medium mb-3.5">
              ◆ Services
            </h5>

            <button
              type="button"
              onClick={onOpenModal}
              className="block text-left text-white/70 text-[14px] mb-2 hover:text-green transition-colors cursor-pointer bg-transparent border-0 p-0"
            >
              Free Valuation
            </button>
            <a
              href="#"
              className="block text-white/70 text-[14px] mb-2 hover:text-green transition-colors"
            >
              How It Works
            </a>
            <a
              href="#"
              className="block text-white/70 text-[14px] mb-2 hover:text-green transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="block text-white/70 text-[14px] mb-2 hover:text-green transition-colors"
            >
              Refund Assurance
            </a>
          </div>

          {/* Resources */}
          <div>
            <h5 className="font-mono text-[11px] tracking-[0.14em] uppercase text-green-light font-medium mb-3.5">
              ◆ Resources
            </h5>

            <a
              href="#"
              className="block text-white/70 text-[14px] mb-2 hover:text-green transition-colors"
            >
              IEPF Guide
            </a>
            <a
              href="#"
              className="block text-white/70 text-[14px] mb-2 hover:text-green transition-colors"
            >
              RTA Process
            </a>
            <a
              href="#"
              className="block text-white/70 text-[14px] mb-2 hover:text-green transition-colors"
            >
              Legal Heir vs Succession
            </a>
            <a
              href="#"
              className="block text-white/70 text-[14px] mb-2 hover:text-green transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Company */}
          <div>
            <h5 className="font-mono text-[11px] tracking-[0.14em] uppercase text-green-light font-medium mb-3.5">
              ◆ Company
            </h5>

            <a
              href="#"
              className="block text-white/70 text-[14px] mb-2 hover:text-green transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="block text-white/70 text-[14px] mb-2 hover:text-green transition-colors"
            >
              Contact
            </a>
            <a
              href="#"
              className="block text-white/70 text-[14px] mb-2 hover:text-green transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="block text-white/70 text-[14px] mb-2 hover:text-green transition-colors"
            >
              Terms
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 border-t border-white/10 font-mono text-[12px] tracking-[0.06em] flex justify-between flex-wrap gap-4">
          <div>© 2026 ClearClaim Ventures Private Limited. All rights reserved.</div>
          <div>clearclaim.in · hello@clearclaim.in · +91 98765 43210</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
