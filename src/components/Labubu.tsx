import './Labubu.css'

export type LabubuProps = {
  size?: number
  className?: string
  /** Soft bounce — used on the welcome hero */
  float?: boolean
  title?: string
}

/** Scientist Labubu as pure SVG — no image file. */
export function Labubu({
  size = 280,
  className = '',
  float = false,
  title = 'Scientist Labubu',
}: LabubuProps) {
  return (
    <div
      className={`labubu ${float ? 'labubu--float' : ''} ${className}`.trim()}
      style={{ width: size, height: size * 1.15 }}
      role="img"
      aria-label={title}
    >
      <svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        {/* ears */}
        <ellipse cx="58" cy="42" rx="18" ry="48" fill="#d8d2c8" stroke="#9a948a" strokeWidth="1.5" />
        <ellipse cx="142" cy="42" rx="18" ry="48" fill="#d8d2c8" stroke="#9a948a" strokeWidth="1.5" />
        <ellipse cx="58" cy="48" rx="8" ry="28" fill="#bdb6aa" opacity="0.55" />
        <ellipse cx="142" cy="48" rx="8" ry="28" fill="#bdb6aa" opacity="0.55" />

        {/* hair spikes */}
        <path
          d="M48 78 C40 50 55 28 72 38 C78 22 95 18 105 32 C118 16 140 22 145 42 C160 30 172 52 162 72 Z"
          fill="#c8c4bc"
        />
        <path d="M55 70 L48 42 L68 62 Z" fill="#b8b4ac" />
        <path d="M90 58 L95 30 L110 55 Z" fill="#b8b4ac" />
        <path d="M130 62 L145 34 L150 68 Z" fill="#b8b4ac" />

        {/* head */}
        <ellipse cx="100" cy="95" rx="52" ry="48" fill="#f3e6d4" stroke="#d4b89a" strokeWidth="1.2" />

        {/* blush */}
        <ellipse cx="68" cy="105" rx="10" ry="6" fill="#f5a8b8" opacity="0.55" />
        <ellipse cx="132" cy="105" rx="10" ry="6" fill="#f5a8b8" opacity="0.55" />

        {/* eyes */}
        <ellipse cx="78" cy="88" rx="14" ry="16" fill="#3ecf5a" />
        <ellipse cx="122" cy="88" rx="14" ry="16" fill="#3ecf5a" />
        <ellipse cx="78" cy="88" rx="5" ry="9" fill="#102018" />
        <ellipse cx="122" cy="88" rx="5" ry="9" fill="#102018" />
        <circle cx="74" cy="82" r="3" fill="#fff" opacity="0.85" />
        <circle cx="118" cy="82" r="3" fill="#fff" opacity="0.85" />

        {/* brows */}
        <path d="M64 72 Q78 66 90 72" fill="none" stroke="#9a948a" strokeWidth="3" strokeLinecap="round" />
        <path d="M110 72 Q122 66 136 72" fill="none" stroke="#9a948a" strokeWidth="3" strokeLinecap="round" />

        {/* nose */}
        <ellipse cx="100" cy="104" rx="5" ry="3.5" fill="#e8894a" />

        {/* mustache */}
        <path
          d="M78 112 Q100 122 122 112 Q112 128 100 126 Q88 128 78 112 Z"
          fill="#b8b4ac"
        />

        {/* grin + teeth */}
        <path
          d="M70 118 Q100 148 130 118"
          fill="#2a1a14"
          stroke="#2a1a14"
          strokeWidth="2"
        />
        <path d="M76 120 L82 132 L88 121 Z" fill="#fff" />
        <path d="M90 122 L96 136 L102 122 Z" fill="#fff" />
        <path d="M104 122 L110 136 L116 122 Z" fill="#fff" />
        <path d="M118 120 L124 132 L130 121 Z" fill="#fff" />

        {/* body / lab coat */}
        <path
          d="M62 148 Q58 210 70 218 L130 218 Q142 210 138 148 Q120 158 100 156 Q80 158 62 148 Z"
          fill="#8eb8e8"
          stroke="#6a96c8"
          strokeWidth="1.2"
        />
        {/* collar */}
        <path d="M86 152 L100 168 L114 152 L100 158 Z" fill="#1a2430" />
        {/* buttons */}
        <circle cx="100" cy="178" r="4" fill="#3a6aa8" />
        <circle cx="100" cy="196" r="4" fill="#3a6aa8" />
        {/* badge */}
        <circle cx="126" cy="172" r="8" fill="#e8b820" stroke="#c49a10" strokeWidth="1" />
        <circle cx="126" cy="172" r="5.5" fill="#d62828" />
        <path
          d="M126 168 L127.2 170.8 L130.2 171.2 L128 173.2 L128.6 176.2 L126 174.6 L123.4 176.2 L124 173.2 L121.8 171.2 L124.8 170.8 Z"
          fill="#ffd84a"
        />

        {/* pants + shoes */}
        <path d="M78 210 L78 218 L94 218 L94 210 Z" fill="#2a2e38" />
        <path d="M106 210 L106 218 L122 218 L122 210 Z" fill="#2a2e38" />
        <ellipse cx="86" cy="220" rx="12" ry="5" fill="#6b2e24" />
        <ellipse cx="114" cy="220" rx="12" ry="5" fill="#6b2e24" />

        {/* right arm + gadget */}
        <path
          d="M62 160 Q40 168 38 190"
          fill="none"
          stroke="#8eb8e8"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <ellipse cx="36" cy="196" rx="8" ry="6" fill="#f3e6d4" />
        <rect x="22" y="188" width="16" height="22" rx="3" fill="#7a8088" stroke="#555" strokeWidth="1" />
        <rect x="25" y="192" width="10" height="6" rx="1" fill="#a8b0b8" />
        <line x1="30" y1="188" x2="30" y2="178" stroke="#4a90d9" strokeWidth="2" />
        <circle cx="30" cy="176" r="2.5" fill="#5cb8ff" />

        {/* left arm */}
        <path
          d="M138 160 Q160 170 158 198"
          fill="none"
          stroke="#8eb8e8"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <ellipse cx="156" cy="204" rx="8" ry="6" fill="#f3e6d4" />
      </svg>
    </div>
  )
}
