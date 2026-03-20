import React from "react";

const ARCCLogo = ({ size = 56, showWordmark = true }) => {
  return (
    <div className="arcc-logo" aria-label="ARCC logo">
      <svg
        className="arcc-logo__mark"
        width={size}
        height={size}
        viewBox="0 0 88 88"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="arccLogoGradient" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#48c6ef" />
            <stop offset="100%" stopColor="#1f5eff" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="72" height="72" rx="22" fill="url(#arccLogoGradient)" />
        <path
          d="M27 26h24c6.6 0 12 5.4 12 12v18c0 3.3-2.7 6-6 6H39c-6.6 0-12-5.4-12-12V26Z"
          fill="#f8fbff"
          opacity="0.96"
        />
        <path d="M51 26v8c0 3.3 2.7 6 6 6h6" fill="none" stroke="#cfe3ff" strokeWidth="4" />
        <path d="M34 41h20" stroke="#1f5eff" strokeWidth="4" strokeLinecap="round" />
        <path d="M34 49h16" stroke="#18a999" strokeWidth="4" strokeLinecap="round" />
        <path d="M34 57h12" stroke="#f3b63f" strokeWidth="4" strokeLinecap="round" />
        <path
          d="M63 57c0 8.3-6.7 15-15 15"
          fill="none"
          stroke="#062c66"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M66 45c7.2 0 13 5.8 13 13S73.2 71 66 71"
          fill="none"
          stroke="#062c66"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="65" cy="24" r="5" fill="#f3b63f" />
        <path
          d="M65 15v5M65 28v5M56 24h5M69 24h5"
          stroke="#f3b63f"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {showWordmark ? (
        <div className="arcc-logo__wordmark">
          <span className="arcc-logo__title">ARCC</span>
          <span className="arcc-logo__tagline">AI Resume and Career Coach</span>
        </div>
      ) : null}
    </div>
  );
};

export default ARCCLogo;
