import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBinHistory } from '../services/api'
import { useAuth } from '../context/AuthContext'

const STATUS_LABEL = { empty: 'ว่าง', half: 'ครึ่ง', full: 'เต็ม' }
const STATUS_COLOR = { empty: '#5a9e6f', half: '#d4924a', full: '#c25c5c' }
const STATUS_BG    = { empty: '#eaf5ee', half: '#fdf3e7', full: '#fceaea' }

export default function BinDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getBinHistory(id)
      .then(r => {
        setRecords(r.data)
        if (r.data.length > 0) setSelected(r.data[0])
      })
      .finally(() => setLoading(false))
  }, [id])

  const latest = records[0]

  // sidebar fields — ดึงค่าจาก record ที่เลือก (ล่าสุด หรือ record ที่ผู้ใช้คลิก)
  const fields = [
    { label: 'bin_id',        value: `#${id}` },
    { label: 'location_name', value: latest?.location_name ?? '—' },
    { label: 'waste_type',    value: latest ? `ถัง ${latest.bin_number ?? id}` : '—' },
    { label: 'timestamp',     value: selected ? new Date(selected.recorded_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }) : '—' },
    { label: 'fill_level',    value: selected ? (STATUS_LABEL[selected.status] ?? '—') : '—' },
    { label: 'gas_level',     value: selected?.gas_level ?? '—' },
    { label: 'capacity',      value: selected?.capacity ?? '—' },
    { label: 'status',        value: selected ? (STATUS_LABEL[selected.status] ?? '—') : '—' },
  ]

  return (
    <div style={s.page}>
      {/* ── Header ── */}
      <header style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.logo}>logo</div>
          <span style={s.headerUser}>{user?.role === 'admin' ? 'ADMIN' : 'USER'}</span>
          {user?.role === 'emp' && (
            <div style={s.locZonePill}>{latest?.location_name ?? 'location / zone'}</div>
          )}
        </div>
        <div style={s.headerRight}>
          <button style={s.alertBtn}>alert</button>
          <button style={s.logoutBtn} onClick={() => navigate(-1)}>Logout</button>
        </div>
      </header>

      {loading ? (
        <div style={s.loadWrap}><p style={s.loadText}>กำลังโหลด...</p></div>

      ) : user?.role === 'admin' ? (
        /* ════════════════════════════════════
           ADMIN VIEW — sidebar + history table
           ════════════════════════════════════ */
        <div style={s.adminBody}>

          {/* sidebar */}
          <aside style={s.sidebar}>
            {fields.map(f => (
              <div key={f.label} style={s.sideItem}>
                <span style={s.sideLabel}>{f.label}</span>
                <span style={{
                  ...s.sideValue,
                  ...(f.label === 'status' || f.label === 'fill_level'
                    ? { color: selected?.status ? STATUS_COLOR[selected.status] : '#888', fontWeight: 700 }
                    : {})
                }}>
                  {f.value}
                </span>
              </div>
            ))}

            <div style={{ flex: 1 }} />

            {/* ปุ่ม back — อันเดียวเท่านั้น */}
            <div style={s.sideFooter}>
              <button style={s.backBtn} onClick={() => navigate(-1)}>back</button>
            </div>
          </aside>

          {/* main panel */}
          <main style={s.adminMain}>
            {/* title pill */}
            <div style={s.titlePillWrap}>
              <div style={s.titlePill}>ประวัติ</div>
            </div>

            {/* table header */}
            <div style={s.tableHead}>
              <span style={s.col1}>date</span>
              <span style={s.col2}>level</span>
              <span style={s.col3}>opentime / lasttime</span>
            </div>

            {/* rows */}
            {records.length === 0 ? (
              <div style={s.emptyRow}>ยังไม่มีการบันทึกข้อมูล</div>
            ) : (
              records.map(r => (
                <div
                  key={r.id}
                  style={{ ...s.tableRow, ...(selected?.id === r.id ? s.tableRowActive : {}) }}
                  onClick={() => setSelected(r)}
                >
                  <span style={s.col1}>
                    {new Date(r.recorded_at).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                  <span style={{ ...s.levelBadge, background: STATUS_BG[r.status], color: STATUS_COLOR[r.status] }}>
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                  <span style={s.col3}>
                    {new Date(r.recorded_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    {r.note && <span style={s.noteInline}> · {r.note}</span>}
                  </span>
                </div>
              ))
            )}
            {/* ไม่มีปุ่ม back ที่นี่ — มีแค่ใน sidebar */}
          </main>

        </div>

      ) : (
        /* ═══════════════════════════════════════════
           EMP VIEW — card ข้อมูล + ปุ่มบันทึก
           ═══════════════════════════════════════════ */
        <div style={s.empBody}>
          <div style={s.empCard}>
            {fields.map(f => (
              <div key={f.label} style={s.empField}>
                <span style={s.empFieldLabel}>{f.label}</span>
                <span style={
                  f.label === 'fill_level' || f.label === 'status'
                    ? { ...s.empFieldVal, color: selected?.status ? STATUS_COLOR[selected.status] : '#4a3f35', fontWeight: 700 }
                    : s.empFieldVal
                }>
                  {f.value}
                </span>
              </div>
            ))}

            <div style={{ flex: 1 }} />

            {/* ปุ่ม back อันเดียว + บันทึก */}
            <div style={s.empFooter}>
              <button style={s.empBackBtn} onClick={() => navigate(-1)}>back</button>
              <button style={s.empRecordBtn} onClick={() => navigate(`/bins/${id}/record`)}>
                + บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#e8e4df', fontFamily: "'Sarabun', sans-serif" },

  /* header */
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#d6cfc6', padding: '10px 20px', borderBottom: '1px solid #c5bdb4' },
  headerLeft:  { display: 'flex', alignItems: 'center', gap: 10 },
  logo:        { width: 38, height: 38, borderRadius: '50%', background: '#a09080', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700 },
  headerUser:  { fontWeight: 700, fontSize: 14, color: '#4a3f35' },
  locZonePill: { background: '#9e8a77', color: '#fff', borderRadius: 6, padding: '5px 14px', fontSize: 13, fontWeight: 600 },
  headerRight: { display: 'flex', gap: 8 },
  alertBtn:    { padding: '5px 14px', background: '#8B7355', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  logoutBtn:   { padding: '5px 14px', background: '#7a6a5a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' },

  loadWrap: { display: 'flex', justifyContent: 'center', paddingTop: 80 },
  loadText: { color: '#888' },

  /* ── ADMIN layout ── */
  adminBody: { display: 'flex', padding: '28px 32px', maxWidth: 1050, margin: '0 auto', gap: 0 },

  sidebar:    { width: 210, flexShrink: 0, background: '#ddd8d2', borderRadius: '14px 0 0 14px', padding: '20px 0', display: 'flex', flexDirection: 'column' },
  sideItem:   { padding: '12px 22px', borderBottom: '1px solid #ccc7c0' },
  sideLabel:  { display: 'block', fontSize: 12, color: '#9a8a7a', fontWeight: 600, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.03em' },
  sideValue:  { display: 'block', fontSize: 15, color: '#4a3f35', fontWeight: 500 },
  sideFooter: { padding: '16px 20px' },

  adminMain: { flex: 1, background: '#eae5e0', borderRadius: '0 14px 14px 0', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 12 },

  titlePillWrap: { display: 'flex', justifyContent: 'center', marginBottom: 4 },
  titlePill:     { background: '#8B7355', color: '#fff', fontWeight: 700, fontSize: 15, padding: '8px 36px', borderRadius: 20 },

  tableHead: { display: 'flex', alignItems: 'center', background: '#9e8a77', color: '#fff', borderRadius: 9, padding: '10px 16px', fontSize: 14, fontWeight: 700, gap: 8 },
  tableRow:  { display: 'flex', alignItems: 'center', background: '#8B7355', color: '#fff', borderRadius: 9, padding: '10px 16px', fontSize: 14, gap: 8, cursor: 'pointer', transition: 'filter 0.12s' },
  tableRowActive: { outline: '2px solid #4a90d9', outlineOffset: 1, filter: 'brightness(1.12)' },

  col1:       { flex: '0 0 120px', fontSize: 13 },
  col2:       { flex: '0 0 90px' },
  col3:       { flex: 1, textAlign: 'right', fontSize: 13 },
  levelBadge: { flex: '0 0 90px', textAlign: 'center', fontSize: 13, fontWeight: 700, padding: '3px 0', borderRadius: 10 },
  noteInline: { color: 'rgba(255,255,255,0.65)', fontStyle: 'italic' },
  emptyRow:   { textAlign: 'center', color: '#aaa', padding: 32 },

  backBtn: { width: '100%', padding: '9px 0', background: '#9e8a77', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },

  /* ── EMP layout ── */
  empBody: { display: 'flex', justifyContent: 'center', padding: '36px 20px' },

  empCard: { background: '#ddd8d2', borderRadius: 18, width: 380, padding: '12px 0 0', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 16px rgba(0,0,0,0.11)', minHeight: 420 },

  empField:      { padding: '14px 28px', borderBottom: '1px solid #ccc7c0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  empFieldLabel: { fontSize: 14, color: '#5a4f46', fontWeight: 500 },
  empFieldVal:   { fontSize: 14, color: '#4a3f35', fontWeight: 600, maxWidth: 160, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },

  empFooter:    { display: 'flex', gap: 10, padding: '16px 20px', marginTop: 'auto' },
  empBackBtn:   { flex: 1, padding: '10px 0', background: '#9e8a77', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  empRecordBtn: { flex: 2, padding: '10px 0', background: '#8B7355', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
}