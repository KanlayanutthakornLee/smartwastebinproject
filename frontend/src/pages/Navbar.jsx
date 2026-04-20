// Shared top navigation bar — ใช้ร่วมกันทุกหน้า
export default function Navbar({ role, locationName, onLogout }) {
  return (
    <header style={s.bar}>
      {/* left */}
      <div style={s.left}>
        <div style={s.logoBox}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
          </svg>
        </div>
        <span style={s.brand}>SmartBin</span>
        <div style={s.divider} />
        <span style={s.rolePill}>{role === 'admin' ? 'ADMIN' : 'USER'}</span>
        {locationName && (
          <span style={s.locPill}>{locationName}</span>
        )}
      </div>

      {/* right */}
      <div style={s.right}>
        <button style={s.alertBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span style={s.alertDot} />
        </button>
        <button style={s.logoutBtn} onClick={onLogout}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          ออกจากระบบ
        </button>
      </div>
    </header>
  )
}

const s = {
  bar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(13,15,18,0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
    padding: '0 28px',
    height: 60,
  },
  left:   { display: 'flex', alignItems: 'center', gap: 12 },
  right:  { display: 'flex', alignItems: 'center', gap: 10 },

  logoBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: 'rgba(0,229,160,0.1)',
    border: '1px solid rgba(0,229,160,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand:   { fontSize: 16, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' },
  divider: { width: 1, height: 20, background: 'var(--border2)' },

  rolePill: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--accent)',
    background: 'rgba(0,229,160,0.1)',
    border: '1px solid rgba(0,229,160,0.2)',
    borderRadius: 6,
    padding: '3px 10px',
  },
  locPill: {
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--text2)',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '3px 10px',
  },

  alertBtn: {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 9,
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    color: 'var(--text2)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: 'var(--warn)',
    border: '1.5px solid var(--bg)',
  },

  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '7px 14px',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 9,
    color: 'var(--text2)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}