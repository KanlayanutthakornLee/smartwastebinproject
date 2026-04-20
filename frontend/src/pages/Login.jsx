import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/api'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await login(form)
      loginUser(data.token, data.user)
      navigate(data.user.role === 'admin' ? '/admin/home' : '/emp/home')
    } catch (err) {
      setError(err.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.grid} aria-hidden />
      <div style={{ ...s.orb, top: '10%', left: '65%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(0,229,160,0.06) 0%, transparent 70%)' }} />
      <div style={{ ...s.orb, top: '65%', left: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,80,255,0.05) 0%, transparent 70%)' }} />

      <div style={s.card}>
        <div style={s.iconWrap}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </div>

        <h1 style={s.title}>Smart<span style={{ color: 'var(--accent)' }}>Bin</span></h1>
        <p style={s.sub}>ระบบจัดการถังขยะอัจฉริยะ</p>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>ชื่อผู้ใช้</label>
            <div style={s.inputWrap}>
              <svg style={s.ico} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <input style={s.input} type="text" value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="username" required autoComplete="username" />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>รหัสผ่าน</label>
            <div style={s.inputWrap}>
              <svg style={s.ico} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input style={s.input} type="password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" required autoComplete="current-password" />
            </div>
          </div>

          {error && (
            <div style={s.errBox}>⚠ {error}</div>
          )}

          <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.75 : 1 }}>
            {loading
              ? <span style={s.spinner} />
              : <>เข้าสู่ระบบ <span style={{ marginLeft: 4 }}>→</span></>
            }
          </button>
        </form>

        <p style={s.footer}>Smart Waste Bin System · v2.0</p>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden' },
  grid: {
    position: 'absolute', inset: 0,
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)',
    backgroundSize: '52px 52px', pointerEvents: 'none',
  },
  orb: { position: 'absolute', borderRadius: '50%', pointerEvents: 'none' },

  card: {
    position: 'relative',
    background: 'var(--bg2)', border: '1px solid var(--border2)',
    borderRadius: 22, padding: '44px 40px 36px', width: 400, maxWidth: '95vw',
    boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
    animation: 'fadeUp 0.45s ease', textAlign: 'center',
  },

  iconWrap: {
    width: 56, height: 56, borderRadius: 15, margin: '0 auto 20px',
    background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  title:  { fontSize: 30, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' },
  sub:    { color: 'var(--text3)', fontSize: 13, marginTop: 7, marginBottom: 32 },

  form:  { display: 'flex', flexDirection: 'column', gap: 18, textAlign: 'left' },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' },

  inputWrap: { position: 'relative' },
  ico: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' },
  input: {
    width: '100%', padding: '12px 14px 12px 40px',
    background: 'var(--bg3)', border: '1px solid var(--border2)',
    borderRadius: 10, fontSize: 14, color: 'var(--text)',
    outline: 'none', fontFamily: 'inherit',
  },

  errBox: {
    padding: '10px 14px', background: 'rgba(255,90,90,0.08)',
    border: '1px solid rgba(255,90,90,0.22)', borderRadius: 9,
    color: 'var(--danger)', fontSize: 13, textAlign: 'center',
  },

  btn: {
    padding: 13, background: 'var(--accent)', color: '#0d0f12',
    border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
    cursor: 'pointer', marginTop: 4, display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 4, fontFamily: 'inherit', transition: 'opacity 0.2s',
  },
  spinner: { width: 18, height: 18, border: '2.5px solid rgba(0,0,0,0.15)', borderTopColor: '#0d0f12', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' },

  footer: { marginTop: 28, fontSize: 11, color: 'var(--text3)', letterSpacing: '0.04em' },
}