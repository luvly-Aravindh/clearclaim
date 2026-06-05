import { useEffect, useRef, useState } from "react";

const activities = [
  { name: "Anjali S.", city: "Mumbai, MH", action: "Just requested a free valuation", time: "2 min ago" },
  { name: "Vikram R.", city: "Pune, MH", action: "Just submitted old certificate details", time: "6 min ago" },
  { name: "Sneha P.", city: "Bengaluru, KA", action: "Just booked a recovery call", time: "11 min ago" },
  { name: "Harish K.", city: "Chennai, TN", action: "Just requested a free valuation", time: "17 min ago" },
  { name: "Deepa N.", city: "Hyderabad, TS", action: "Just started a share recovery case", time: "24 min ago" },
  { name: "Rohit A.", city: "New Delhi, DL", action: "Just requested a free valuation", time: "33 min ago" },
  { name: "Kavita M.", city: "Ahmedabad, GJ", action: "Just submitted old certificate details", time: "41 min ago" },
  { name: "Naveen T.", city: "Kolkata, WB", action: "Just booked a recovery call", time: "52 min ago" },
  { name: "Lakshmi V.", city: "Coimbatore, TN", action: "Just requested a free valuation", time: "1 hr ago" },
  { name: "Manoj S.", city: "Jaipur, RJ", action: "Just started a share recovery case", time: "2 hr ago" },
];

const VISIBLE_MS = 6000;
const INTERVAL_MS = 11000;
const START_MS = 4000;

const ProofTicker = () => {
  const [dismissed, setDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * activities.length)
  );

  const intervalRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  /* check sessionStorage on mount for previously dismissed */
  useEffect(() => {
    try {
      if (sessionStorage.getItem("ccPtClosed") === "1") {
        setDismissed(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  /* run the rotating display */
  useEffect(() => {
    if (dismissed) return;

    const show = () => {
      setIsVisible(true);
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        setIndex((i) => (i + 1) % activities.length);
      }, VISIBLE_MS);
    };

    const startTimeout = setTimeout(() => {
      show();
      intervalRef.current = setInterval(show, INTERVAL_MS);
    }, START_MS);

    return () => {
      clearTimeout(startTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [dismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setDismissed(true);
      try {
        sessionStorage.setItem("ccPtClosed", "1");
      } catch (e) {
        // ignore
      }
    }, 450);
  };

  if (dismissed) return null;

  const item = activities[index];

  return (
    <div
      className={`cc-pt ${isVisible ? "is-visible" : ""}`}
      role="status"
      aria-live="polite"
    >
      <button
        className="cc-pt__x"
        type="button"
        aria-label="Dismiss"
        onClick={handleDismiss}
      >
        ×
      </button>

      <div className="cc-pt__thumb">
        <svg
          className="cc-pt__pin"
          viewBox="0 0 22 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 0C4.925 0 0 4.925 0 11c0 7.5 11 17 11 17s11-9.5 11-17c0-6.075-4.925-11-11-11z"
            fill="#3b5afe"
          />
          <circle cx="11" cy="11" r="4" fill="#ffffff" />
        </svg>
      </div>

      <div className="cc-pt__body">
        <div className="cc-pt__l1">
          <span>{item.name}</span>
          <span className="from"> from </span>
          <span>{item.city}</span>
        </div>

        <div className="cc-pt__l2">{item.action}</div>

        <div className="cc-pt__l3">
          <span className="cc-pt__dot"></span>
          <span className="cc-pt__time">{item.time}</span>

          <svg
            className="cc-pt__badge"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Z"
              fill="#3b5afe"
            />
            <path
              d="M8 12.5l2.7 2.7L16.5 9"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>

          <span className="cc-pt__vf">Verified by ClearClaim</span>
        </div>
      </div>
    </div>
  );
};

export default ProofTicker;
