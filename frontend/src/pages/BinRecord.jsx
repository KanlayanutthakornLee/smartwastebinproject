import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recordBin, getBinHistory } from '../services/api'
import { useAuth } from '../context/AuthContext'

const STATUS_OPTIONS = [
  { value: 'empty', label: 'ว่าง',  color: '#5a9e6f', bg: '#eaf5ee' },
  { value: 'half',  label: 'ครึ่ง', color: '#d4924a', bg: '#fdf3e7' },
  { value: 'full',  label: 'เต็ม',  color: '#c25c5c', bg: '#fceaea' },
]

export default function BinRecord() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [status, setStatus]   = useState('')
  const [note, setNote]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [binInfo, setBinInfo] = useState(null)

  // load bin info for display
  useEffect(() => {
    getBinHistory(id).then(r => {
      if (r.data.length > 0) setBinInfo(r.data[0])
    })
  }, [id])

  const handleSubmit = async () => {
    if (!status) { setError('กรุณาเลือกสถานะถัง'); return }
    setLoading(true)
    setError('')
    try {
      await recordBin(id, { status, note })
      navigate(-1)
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  const chosen = STATUS_OPTIONS.find(o => o.value === status)

  return (
    <div style={s.page}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.logo}>logo</div>
          <span style={s.headerTitle}>EMP: {user?.username}</span>
        </div>
        <div style={s.headerRight}>
          <button style={s.logoutBtn} onClick={() => navigate(-1)}>← กลับ</button>
        </div>
      </header>

      <div style={s.body}>
        {/* Bin info card */}
        {binInfo && (
          <div style={s.infoCard}>
            <span style={s.infoLoc}>{binInfo.location_name}</span>
            <span style={s.infoBin}>{binInfo.label}</span>
            {binInfo.status && (
              <span style={{ ...s.infoPrev, color: '#888' }}>
                สถานะล่าสุด: {binInfo.status === 'empty' ? 'ว่าง' : binInfo.status === 'half' ? 'ครึ่ง' : 'เต็ม'}
              </span>
            )}
          </div>
        )}

        {/* Form card */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>บันทึกข้อมูลถัง</h2>

          {/* Status selector */}
          <p style={s.fieldLabel}>สถานะถังขยะ <span style={s.required}>*</span></p>
          <div style={s.statusGroup}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                style={{
                  ...s.statusBtn,
                  background:   status === opt.value ? opt.color : '#fff',
                  color:        status === opt.value ? '#fff'    : opt.color,
                  borderColor:  opt.color,
                  transform:    status === opt.value ? 'scale(1.04)' : 'scale(1)',
                  boxShadow:    status === opt.value ? `0 4px 16px ${opt.color}55` : '0 1px 4px rgba(0,0,0,0.08)',
                }}
              >
                <span style={s.statusIcon}>
                  {opt.value === 'empty' ? '🟢' : opt.value === 'half' ? '🟡' : '🔴'}
                </span>
                {opt.label}
              </button>
            ))}
          </div>

          {/* Note */}
          <div style={s.field}>
            <label style={s.fieldLabel}>หมายเหตุ</label>
            <textarea
              style={s.textarea}
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="ระบุหมายเหตุเพิ่มเติม เช่น มีกลิ่น, ฝาชำรุด..."
            />
          </div>

          {/* Preview */}
          {chosen && (
            <div style={{ ...s.preview, background: chosen.bg, borderColor: chosen.color }}>
              <span style={{ color: chosen.color, fontWeight: 700 }}>จะบันทึก: {chosen.label}</span>
              {note && <span style={{ fontSize: 13, color: '#777', marginLeft: 8 }}>· {note}</span>}
            </div>
          )}

          {error && <p style={s.error}>{error}</p>}

          {/* Buttons */}
          <div style={s.btnRow}>
            <button style={s.cancelBtn} onClick={() => navigate(-1)}>ยกเลิก</button>
            <button
              style={{ ...s.saveBtn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? 'กำลังบันทึก...' : '✓ บันทึกข้อมูล'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#e8e4df', fontFamily: "'Sarabun', sans-serif" },

  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#d6cfc6', padding: '10px 20px', borderBottom: '1px solid #c5bdb4' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  logo: { width: 40, height: 40, borderRadius: '50%', background: '#a09080', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 600 },
  headerTitle: { fontWeight: 700, fontSize: 15, color: '#4a3f35' },
  headerRight: {},
  logoutBtn: { padding: '6px 16px', background: '#7a6a5a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' },

  body: { padding: '24px 28px', maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 },

  // info card
  infoCard: { background: '#8B7355', color: '#fff', borderRadius: 10, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 },
  infoLoc: { fontWeight: 700, fontSize: 15 },
  infoBin: { fontSize: 14, opacity: 0.85 },
  infoPrev: { marginLeft: 'auto', fontSize: 12, opacity: 0.8 },

  // form card
  card: { background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.09)', display: 'flex', flexDirection: 'column', gap: 18 },
  cardTitle: { fontSize: 18, fontWeight: 700, color: '#4a3f35', margin: 0 },

  fieldLabel: { fontSize: 14, fontWeight: 600, color: '#5a4f46', margin: 0 },
  required: { color: '#c25c5c' },

  statusGroup: { display: 'flex', gap: 12 },
  statusBtn: { flex: 1, padding: '14px 8px', border: '2px solid', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.15s' },
  statusIcon: { fontSize: 20 },

  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  textarea: { padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.6 },

  preview: { padding: '10px 16px', borderRadius: 8, border: '1.5px solid', fontSize: 14 },

  error: { color: '#c25c5c', fontSize: 13, margin: 0 },

  btnRow: { display: 'flex', gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, padding: 12, background: '#f0ede8', color: '#7a6a5a', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  saveBtn: { flex: 2, padding: 12, background: '#8B7355', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.15s' },
}