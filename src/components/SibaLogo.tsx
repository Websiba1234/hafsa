import React from 'react';

interface SibaLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SibaLogo({ className, size = "100%", ...props }: SibaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`luxury-logo ${className || ''}`}
      {...props}
    >
      <defs>
        {/* Shiny metallic gold gradient */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3D6" />
          <stop offset="20%" stopColor="#FCE0AD" />
          <stop offset="40%" stopColor="#DFAC6C" />
          <stop offset="60%" stopColor="#C68B45" />
          <stop offset="80%" stopColor="#FCE0AD" />
          <stop offset="100%" stopColor="#8A5A1C" />
        </linearGradient>

        {/* 3D Sheen Gradient for letter S */}
        <linearGradient id="goldSheen" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A5A1C" />
          <stop offset="25%" stopColor="#E2B777" />
          <stop offset="50%" stopColor="#FFF3D6" />
          <stop offset="75%" stopColor="#DFAC6C" />
          <stop offset="100%" stopColor="#A8742A" />
        </linearGradient>

        {/* Subtle drop shadow filter */}
        <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
        </filter>

        {/* Outer Glow filter for flares */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feColorMatrix type="matrix" values="1 0 0 0 0.98  0 1 0 0 0.88  0 0 1 0 0.68  0 0 0 1 0" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Solid luxurious black circle inside */}
      <circle cx="250" cy="250" r="235" fill="#0c0a09" />

      {/* Double gold rings */}
      <circle cx="250" cy="250" r="225" fill="none" stroke="url(#goldGrad)" strokeWidth="6" />
      <circle cx="250" cy="250" r="215" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" opacity="0.8" />

      {/* Sparkling Flare/Glint on top right of the ring (at 410, 90) */}
      <g transform="translate(410, 90)">
        <ellipse cx="0" cy="0" rx="3" ry="22" fill="#ffffff" filter="url(#glow)" />
        <ellipse cx="0" cy="0" rx="22" ry="3" fill="#ffffff" filter="url(#glow)" />
        <circle cx="0" cy="0" r="4.5" fill="#ffffff" />
        <circle cx="0" cy="0" r="6" fill="url(#goldGrad)" opacity="0.6" filter="url(#glow)" />
      </g>

      {/* The majestic gold serif "S" */}
      <text
        x="250"
        y="235"
        fontFamily="'Cinzel', 'Playfair Display', 'Didot', 'Georgia', serif"
        fontSize="195"
        fontWeight="700"
        fill="url(#goldSheen)"
        textAnchor="middle"
        filter="url(#logoShadow)"
        style={{ letterSpacing: '0px' }}
      >
        S
      </text>

      {/* Ornaments under S: Scrollwork filigree */}
      {/* Central horizontal dividing line with star/diamond in center */}
      <line x1="120" y1="272" x2="380" y2="272" stroke="url(#goldGrad)" strokeWidth="2.5" />
      <polygon points="250,263 256,272 250,281 244,272" fill="url(#goldSheen)" stroke="#ffffff" strokeWidth="0.5" />

      {/* Filigree curls/flourishes left */}
      <path
        d="M 180,272 C 180,250 205,245 220,262 C 228,270 216,277 208,269 C 204,265 208,261 212,263"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 140,272 C 140,240 170,240 185,264"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Filigree curls/flourishes right */}
      <path
        d="M 320,272 C 320,250 295,245 280,262 C 272,270 284,277 292,269 C 296,265 292,261 288,263"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 360,272 C 360,240 330,240 315,264"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* "COLLECTION" text */}
      <text
        x="250"
        y="326"
        dx="7"
        fontFamily="'Cinzel', 'Playfair Display', 'Didot', 'Georgia', serif"
        fontSize="38"
        fontWeight="700"
        fill="url(#goldSheen)"
        textAnchor="middle"
        letterSpacing="14"
        filter="url(#logoShadow)"
      >
        COLLECTION
      </text>

      {/* Ornaments under COLLECTION */}
      <line x1="140" y1="354" x2="360" y2="354" stroke="url(#goldGrad)" strokeWidth="1.5" />
      <polygon points="250,348 254,354 250,360 246,354" fill="url(#goldSheen)" />

      {/* Mirrored curls underneath */}
      <path
        d="M 210,354 C 220,366 240,366 250,354"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 290,354 C 280,366 260,366 250,354"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 170,354 C 190,372 230,372 250,354"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M 330,354 C 310,372 270,372 250,354"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}
