import nutrasurgeLogo from '../assets/Nurtrasurge-logo.png';

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/nutrasurgelabsusa/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/nutrasurgelabsusa',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

const Footer = () => (
  <footer
    style={{
      borderTop: '1px solid #e5e7eb',
      backgroundColor: '#fafafa',
      padding: '2.5rem 2rem 1.5rem',
      marginTop: '4rem',
    }}
  >
    {/* ── Main row ── */}
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '3rem',
        flexWrap: 'wrap',
        paddingBottom: '2rem',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      {/* LEFT: logo + tagline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: 180 }}>
        <img
          src={nutrasurgeLogo}
          alt="NutraSurge Labs"
          style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
        />
        <p style={{ fontSize: '0.8rem', color: '#777', margin: 0, lineHeight: 1.5 }}>
          Premium supplements for everyday strength.
        </p>
      </div>

      {/* CENTER: contact info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 220 }}>
        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111', marginBottom: '0.25rem' }}>
          Nutrasurge Labs
        </span>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.55 }}>
            📍 11247 Jamison Rd, East Aurora,<br />NY 14052, USA
          </span>
        </div>
        <a
          href="mailto:nutrasurgelabsusa@gmail.com"
          style={{
            fontSize: '0.85rem',
            color: '#1a6fde',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          ✉️ nutrasurgelabsusa@gmail.com
        </a>
      </div>

      {/* RIGHT: social icons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111' }}>Follow Us</span>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {SOCIAL_LINKS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: '1px solid #e0e0e0',
                backgroundColor: '#fff',
                color: '#333',
                textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s, box-shadow 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#111';
                e.currentTarget.style.color = '#111';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.14)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.color = '#333';
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
              }}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </div>

    {/* ── Bottom bar ── */}
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        paddingTop: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}
    >
      <p style={{ fontSize: '0.78rem', color: '#999', margin: 0 }}>
        © 2024 Nutrasurge Labs. All Rights Reserved.
      </p>
      <p style={{ fontSize: '0.78rem', color: '#bbb', margin: 0 }}>
        Made with ❤️ for fitness enthusiasts
      </p>
    </div>
  </footer>
);

export default Footer;
