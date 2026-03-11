// Custom thick-stroke, duo-tone icons with hand-drawn style

interface IconProps {
  className?: string;
  size?: number;
}

export function MorningIcon({ className = "", size = 120 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sun with hand-drawn feel */}
      <circle cx="60" cy="60" r="22" fill="#FDB63F" stroke="#FDB63F" strokeWidth="6" />
      {/* Rays */}
      <path d="M60 15 L60 25" stroke="#FDB63F" strokeWidth="7" strokeLinecap="round" />
      <path d="M60 95 L60 105" stroke="#FDB63F" strokeWidth="7" strokeLinecap="round" />
      <path d="M15 60 L25 60" stroke="#FDB63F" strokeWidth="7" strokeLinecap="round" />
      <path d="M95 60 L105 60" stroke="#FDB63F" strokeWidth="7" strokeLinecap="round" />
      <path d="M28 28 L35 35" stroke="#FDB63F" strokeWidth="7" strokeLinecap="round" />
      <path d="M85 85 L92 92" stroke="#FDB63F" strokeWidth="7" strokeLinecap="round" />
      <path d="M28 92 L35 85" stroke="#FDB63F" strokeWidth="7" strokeLinecap="round" />
      <path d="M85 35 L92 28" stroke="#FDB63F" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

export function NoonIcon({ className = "", size = 120 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sun higher in sky with warm glow */}
      <circle cx="60" cy="45" r="20" fill="#FF9B54" stroke="#FF9B54" strokeWidth="6" />
      <circle cx="60" cy="45" r="28" fill="#FF9B54" opacity="0.2" />
      {/* Rays */}
      <path d="M60 10 L60 20" stroke="#FF9B54" strokeWidth="7" strokeLinecap="round" />
      <path d="M60 70 L60 80" stroke="#FF9B54" strokeWidth="7" strokeLinecap="round" />
      <path d="M25 45 L35 45" stroke="#FF9B54" strokeWidth="7" strokeLinecap="round" />
      <path d="M85 45 L95 45" stroke="#FF9B54" strokeWidth="7" strokeLinecap="round" />
      <path d="M35 20 L42 27" stroke="#FF9B54" strokeWidth="7" strokeLinecap="round" />
      <path d="M78 63 L85 70" stroke="#FF9B54" strokeWidth="7" strokeLinecap="round" />
      {/* Ground line */}
      <path d="M10 95 L110 95" stroke="#1B3022" strokeWidth="5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function NightIcon({ className = "", size = 120 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Crescent moon */}
      <path
        d="M70 25 C70 45, 50 60, 50 80 C50 60, 70 45, 90 45 C80 35, 75 25, 70 25 Z"
        fill="#6B7FD7"
        stroke="#6B7FD7"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Stars */}
      <circle cx="30" cy="35" r="3" fill="#6B7FD7" />
      <circle cx="45" cy="25" r="2.5" fill="#6B7FD7" />
      <circle cx="85" cy="70" r="3" fill="#6B7FD7" />
      <circle cx="95" cy="55" r="2" fill="#6B7FD7" />
      <circle cx="35" cy="70" r="2.5" fill="#6B7FD7" />
    </svg>
  );
}

export function PillIcon({ className = "", size = 140 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Pill/Capsule shape */}
      <rect
        x="30"
        y="45"
        width="80"
        height="50"
        rx="25"
        fill="#1B3022"
        stroke="#1B3022"
        strokeWidth="7"
      />
      {/* Division line */}
      <path d="M70 45 L70 95" stroke="#F5F2ED" strokeWidth="6" strokeLinecap="round" />
      {/* Accent dots */}
      <circle cx="50" cy="70" r="4" fill="#F5F2ED" />
      <circle cx="90" cy="70" r="4" fill="#F5F2ED" />
    </svg>
  );
}

export function FoodIcon({ className = "", size = 120 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Plate */}
      <circle cx="60" cy="65" r="35" fill="none" stroke="#2D5F3F" strokeWidth="7" />
      <ellipse cx="60" cy="65" rx="35" ry="8" fill="#2D5F3F" opacity="0.2" />
      {/* Fork */}
      <path d="M35 30 L35 55" stroke="#2D5F3F" strokeWidth="6" strokeLinecap="round" />
      <path d="M30 30 L30 45" stroke="#2D5F3F" strokeWidth="5" strokeLinecap="round" />
      <path d="M40 30 L40 45" stroke="#2D5F3F" strokeWidth="5" strokeLinecap="round" />
      {/* Knife */}
      <path d="M85 30 L85 55" stroke="#2D5F3F" strokeWidth="7" strokeLinecap="round" />
      <path d="M80 30 L90 30 L85 25 Z" fill="#2D5F3F" />
    </svg>
  );
}

export function NoFoodIcon({ className = "", size = 120 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Plate - faded */}
      <circle cx="60" cy="60" r="35" fill="none" stroke="#D37B5C" strokeWidth="7" opacity="0.4" />
      {/* Big X through it */}
      <path d="M35 35 L85 85" stroke="#D37B5C" strokeWidth="10" strokeLinecap="round" />
      <path d="M85 35 L35 85" stroke="#D37B5C" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}
