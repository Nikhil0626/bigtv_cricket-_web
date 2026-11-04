import React from 'react';

/**
 * Team Crest / Logo component with custom SVGs inspired by Apple Sports app badges
 */
export default function TeamLogo({ shortName = '', name = '', size = 52, className = '' }) {
  const code = (shortName || name || '').toUpperCase().trim();

  // UAE (United Arab Emirates)
  if (code.includes('UAE') || code.includes('EMIRATES')) {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`relative rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-[#00732f] via-[#111111] to-[#ff0000] p-1 border border-emerald-400/40 ${className}`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#00732f" strokeWidth="4" />
          <rect x="20" y="24" width="60" height="17" fill="#00732f" rx="3" />
          <rect x="20" y="41" width="60" height="18" fill="#ffffff" />
          <rect x="20" y="59" width="60" height="17" fill="#000000" rx="3" />
          <rect x="18" y="24" width="18" height="52" fill="#ff0000" rx="3" />
          <circle cx="50" cy="50" r="16" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
          <text x="50" y="55" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif">UAE</text>
        </svg>
      </div>
    );
  }

  // OMAN
  if (code.includes('OMA') || code.includes('OMAN')) {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`relative rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-[#c8102e] via-[#008000] to-[#111111] p-1 border border-red-400/40 ${className}`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#c8102e" strokeWidth="4" />
          <rect x="20" y="24" width="60" height="17" fill="#ffffff" rx="3" />
          <rect x="20" y="41" width="60" height="18" fill="#c8102e" />
          <rect x="20" y="59" width="60" height="17" fill="#008000" rx="3" />
          <rect x="18" y="24" width="18" height="52" fill="#c8102e" rx="3" />
          <circle cx="50" cy="50" r="16" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
          <text x="50" y="55" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900" fontFamily="sans-serif">OMA</text>
        </svg>
      </div>
    );
  }

  // Color schemes and badge styles per team
  if (code.includes('NZ') || code.includes('NEW ZEALAND')) {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`relative rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-[#111111] via-[#222222] to-[#444444] p-1 border border-stone-400/40 ${className}`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#0c0c0c" stroke="#FFFFFF" strokeWidth="3" />
          {/* Silver Fern stylized */}
          <path d="M48 76 C46 55 58 40 68 28 C64 36 58 44 54 56 C50 64 48 72 48 76 Z" fill="#E5E7EB" />
          <path d="M48 64 C40 56 34 48 36 38 C39 44 44 52 48 58 Z" fill="#E5E7EB" opacity="0.9" />
          <path d="M54 52 C60 46 64 38 62 32 C58 38 56 46 54 52 Z" fill="#E5E7EB" opacity="0.8" />
          <text x="50" y="86" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif">NZ</text>
        </svg>
      </div>
    );
  }

  if (code.includes('SA') || code.includes('SOUTH AFRICA')) {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`relative rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-[#007749] via-[#055737] to-[#ffb612] p-1 border border-emerald-400/30 ${className}`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#006633" stroke="#FFB612" strokeWidth="4" />
          <path d="M50 20 C40 35 30 50 35 70 C45 80 55 80 65 70 C70 50 60 35 50 20 Z" fill="#FFB612" opacity="0.9" />
          <path d="M50 28 C45 38 38 48 42 62 C47 68 53 68 58 62 C62 48 55 38 50 28 Z" fill="#006633" />
          <circle cx="50" cy="50" r="7" fill="#E03C31" />
          <text x="50" y="86" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800" fontFamily="sans-serif">SA</text>
        </svg>
      </div>
    );
  }

  if (code.includes('ENG') || code.includes('ENGLAND')) {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`relative rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-[#0b2447] via-[#19376d] to-[#ce1124] p-1 border border-blue-400/30 ${className}`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#0b2447" stroke="#ce1124" strokeWidth="4" />
          <path d="M28 36 L50 24 L72 36 L72 62 C72 74 50 84 50 84 C50 84 28 74 28 62 Z" fill="#FFFFFF" opacity="0.95" />
          <rect x="46" y="32" width="8" height="42" fill="#ce1124" />
          <rect x="34" y="46" width="32" height="8" fill="#ce1124" />
          <text x="50" y="68" textAnchor="middle" fill="#0b2447" fontSize="11" fontWeight="900" fontFamily="sans-serif">ENG</text>
        </svg>
      </div>
    );
  }

  if (code.includes('IND') || code.includes('INDIA')) {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`relative rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-[#FF9933] via-[#003380] to-[#138808] p-1 border border-cyan-400/40 ${className}`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#003380" stroke="#FF9933" strokeWidth="4" />
          <circle cx="50" cy="50" r="30" fill="#0040A0" />
          <circle cx="50" cy="50" r="24" fill="#FFFFFF" />
          <circle cx="50" cy="50" r="18" fill="#003380" />
          {[0, 45, 90, 135].map((angle, i) => (
            <line
              key={i}
              x1="50"
              y1="32"
              x2="50"
              y2="68"
              stroke="#0080FF"
              strokeWidth="2.5"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="7" fill="#FF9933" />
          <text x="50" y="86" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800" fontFamily="sans-serif">IND</text>
        </svg>
      </div>
    );
  }

  if (code.includes('AUS') || code.includes('AUSTRALIA')) {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`relative rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-[#004f2d] via-[#02331c] to-[#ffcd00] p-1 border border-yellow-400/40 ${className}`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#004020" stroke="#FFCD00" strokeWidth="4" />
          <path d="M30 65 Q45 35 60 40 Q75 35 70 65 Q50 68 30 65 Z" fill="#FFCD00" />
          <circle cx="50" cy="30" r="4.5" fill="#FFFFFF" />
          <circle cx="65" cy="40" r="3.5" fill="#FFFFFF" />
          <circle cx="35" cy="42" r="3.5" fill="#FFFFFF" />
          <circle cx="50" cy="52" r="4" fill="#FFFFFF" />
          <text x="50" y="85" textAnchor="middle" fill="#FFCD00" fontSize="12" fontWeight="800" fontFamily="sans-serif">AUS</text>
        </svg>
      </div>
    );
  }

  // Fallback generic elegant badge with initials
  const initials = (code.slice(0, 3) || 'CRK').toUpperCase();
  return (
    <div 
      style={{ width: size, height: size }}
      className={`relative rounded-full flex items-center justify-center shadow-lg bg-gradient-to-tr from-stone-900 via-stone-800 to-amber-900 border border-white/20 ${className}`}
    >
      <span className="text-white font-extrabold tracking-wider text-xs">
        {initials}
      </span>
    </div>
  );
}
