import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getLocations, getBinHistory } from '../services/api'
import Navbar from './Navbar'

const SL  = { empty: 'ว่าง', half: 'ครึ่ง', full: 'เต็ม' }
const SC  = { empty: 'var(--empty)', half: 'var(--warn)', full: 'var(--danger)' }
const SBG = { empty: 'rgba(0,229,160,0.08)', half: 'rgba(255,179,64,0.08)', full: 'rgba(255,90,90,0.08)' }
const PCT = { empty: 18, half: 55, full: 95 }
const STATUS_COLOR = { empty: '#5a9e6f', half: '#d4924a', full: '#c25c5c' }
const STATUS_BG    = { empty: '#eaf5ee', half: '#fdf3e7', full: '#fceaea' }

export default function AdminHome() {
  const { logoutUser } = useAuth()
  const [locations, setLocations] = useState([])
  const [loading, setLoading]     = useState(true)

  // Detail modal
  const [detailBin, setDetailBin]         = useState(null)
  const [detailRecords, setDetailRecords] = useState([])
  const [detailSelected, setDetailSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    getLocations().then(r => setLocations(r.data)).finally(() => setLoading(false))
  }, [])

  const openDetail = async bin => {
    setDetailBin(bin)
    setDetailLoading(true)
    setDetailRecords([])
    setDetailSelected(null)
    try {
      const r = await getBinHistory(bin.id)
      setDetailRecords(r.data)
      if (r.data.length > 0) setDetailSelected(r.data[0])
    } catch {
      setDetailRecords([])
    } finally {
      setDetailLoading(false)
    }
  }
  const closeDetail = () => { setDetailBin(null); setDetailRecords([]); setDetailSelected(null) }

  const allBins = locations.flatMap(l => l.bins)
  const stats   = {
    total: allBins.length,
    full:  allBins.filter(b => b.status === 'full').length,
    half:  allBins.filter(b => b.status === 'half').length,
    empty: allBins.filter(b => b.status === 'empty').length,
  }

  return (
    <div style={s.page}>
      <Navbar role="admin" onLogout={logoutUser} />
      <div style={s.body}>
        {loading ? <Loader /> : (
          <>
            <div style={s.statsRow}>
              <StatCard label="ถังทั้งหมด" value={stats.total} />
              <StatCard label="เต็มแล้ว"   value={stats.full}  accent="var(--danger)" />
              <StatCard label="ครึ่งถัง"   value={stats.half}  accent="var(--warn)" />
              <StatCard label="ว่าง"        value={stats.empty} accent="var(--empty)" />
            </div>

            {locations.map((loc, li) => (
              <section key={loc.id} style={{ ...s.section, animationDelay: `${li * 0.08}s` }}>
                <div style={s.locHeader}>
                  <span style={s.locDot} />
                  <h2 style={s.locName}>{loc.name}</h2>
                  <span style={s.locCount}>{loc.bins.length} ถัง</span>
                </div>
                <div style={s.grid}>
                  {loc.bins.map((bin, bi) => (
                    <BinCard key={bin.id} bin={bin} delay={bi * 0.05}
                      onClick={() => openDetail(bin)} />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>

      {/* ── Detail Modal (Admin) ── */}
      {detailBin && (
        <div style={ov.overlay} onClick={e => { if (e.target === e.currentTarget) closeDetail() }}>
          <div style={ov.container}>

            {/* sidebar */}
            <aside style={ov.sidebar}>
              {detailLoading ? (
                <div style={{ padding: '40px 0', display: 'flex', justifyContent: 'center' }}><Loader /></div>
              ) : (() => {
                const latest = detailRecords[0]
                const fields = [
                  { label: 'bin_id',        value: `#${detailBin.id}` },
                  { label: 'location_name', value: latest?.location_name ?? detailBin.location_name ?? '—' },
                  { label: 'waste_type',    value: detailBin.label ?? '—' },
                  { label: 'timestamp',     value: detailSelected ? new Date(detailSelected.recorded_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }) : '—' },
                  { label: 'fill_level',    value: detailSelected ? (SL[detailSelected.status] ?? '—') : '—' },
                  { label: 'gas_level',     value: detailSelected?.gas_level ?? '—' },
                  { label: 'capacity',      value: detailSelected?.capacity ?? '—' },
                  { label: 'status',        value: detailSelected ? (SL[detailSelected.status] ?? '—') : '—' },
                ]
                return (
                  <>
                    {fields.map(f => (
                      <div key={f.label} style={ov.sideItem}>
                        <span style={ov.sideLabel}>{f.label}</span>
                        <span style={{
                          ...ov.sideValue,
                          ...(f.label === 'status' || f.label === 'fill_level'
                            ? { color: detailSelected?.status ? STATUS_COLOR[detailSelected.status] : 'var(--text2)', fontWeight: 700 }
                            : {})
                        }}>{f.value}</span>
                      </div>
                    ))}
                    <div style={{ flex: 1 }} />
                    <div style={ov.sideFooter}>
                      <button style={ov.backBtn} onClick={closeDetail}>ปิด</button>
                    </div>
                  </>
                )
              })()}
            </aside>

            {/* main — history table */}
            <main style={ov.main}>
              <div style={ov.titlePillWrap}>
                <div style={ov.titlePill}>ประวัติ</div>
              </div>

              <div style={ov.tableHead}>
                <span style={ov.col1}>date</span>
                <span style={ov.col2}>level</span>
                <span style={ov.col3}>opentime / lasttime</span>
              </div>

              {detailLoading ? (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--text3)' }}>กำลังโหลด...</div>
              ) : detailRecords.length === 0 ? (
                <div style={ov.emptyRow}>ยังไม่มีการบันทึกข้อมูล</div>
              ) : (
                detailRecords.map(r => (
                  <div
                    key={r.id}
                    style={{ ...ov.tableRow, ...(detailSelected?.id === r.id ? ov.tableRowActive : {}) }}
                    onClick={() => setDetailSelected(r)}
                  >
                    <span style={ov.col1}>
                      {new Date(r.recorded_at).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                    <span style={{ ...ov.levelBadge, background: STATUS_BG[r.status], color: STATUS_COLOR[r.status] }}>
                      {SL[r.status] ?? r.status}
                    </span>
                    <span style={ov.col3}>
                      {new Date(r.recorded_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      {r.note && <span style={ov.noteInline}> · {r.note}</span>}
                    </span>
                  </div>
                ))
              )}
            </main>

          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, accent }) {
  const col = accent || 'var(--text)'
  return (
    <div style={{ ...sc.card, borderColor: accent ? `${accent}40` : 'var(--border)' }}>
      {accent && <div style={{ ...sc.glow, background: `radial-gradient(circle at top left, ${accent}15, transparent 65%)` }} />}
      <div style={{ ...sc.val, color: col }}>{value ?? '—'}</div>
      <div style={sc.lbl}>{label}</div>
    </div>
  )
}

function BinCard({ bin, delay, onClick }) {
  const hasSt = !!bin.status
  const pct   = hasSt ? PCT[bin.status] : 0
  const color = hasSt ? SC[bin.status] : 'var(--text3)'
  const bg    = hasSt ? SBG[bin.status] : 'transparent'
  return (
    <div style={{ ...c.card, animationDelay: `${delay}s` }} onClick={onClick}>
      {hasSt && (
        <div style={{ position: 'absolute', inset: 0, background: bg, opacity: 0.5, pointerEvents: 'none', borderRadius: 'inherit' }} />
      )}
      <div style={c.top}>
        <div style={c.name}>{bin.label}</div>
        <div style={{ ...c.badge, color, background: `${color}18`, border: `1px solid ${color}35` }}>
          {hasSt ? SL[bin.status] : '—'}
        </div>
      </div>
      <div style={c.pctRow}>
        <div style={c.pctTrack}>
          <div style={{ ...c.pctFill, width: `${pct}%`, background: color }} />
        </div>
        <span style={{ ...c.pctNum, color }}>{pct}%</span>
      </div>
      {bin.recorded_at && (
        <div style={c.time}>
          {new Date(bin.recorded_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}
        </div>
      )}
      <button style={c.btn} onClick={onClick}>
        ดูรายละเอียด
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  )
}

function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, gap: 10 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)', animation: `pulse-glow 1.1s ease ${i * 0.18}s infinite` }} />
      ))}
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: 'var(--bg)' },
  body: { padding: '32px 36px', maxWidth: 1280, margin: '0 auto' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 40, animation: 'fadeUp 0.4s ease' },
  section:  { marginBottom: 44, animation: 'fadeUp 0.5s ease both' },
  locHeader:{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 },
  locDot:   { width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' },
  locName:  { fontSize: 16, fontWeight: 600, color: 'var(--text)' },
  locCount: { fontSize: 12, color: 'var(--text3)', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px' },
  grid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 },
}

const sc = {
  card: { position: 'relative', overflow: 'hidden', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px 24px 20px' },
  glow: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  val:  { fontSize: 40, fontWeight: 700, lineHeight: 1, marginBottom: 8 },
  lbl:  { fontSize: 13, color: 'var(--text2)', fontWeight: 500 },
}

const c = {
  card: {
    position: 'relative', overflow: 'hidden',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '18px 20px 16px',
    display: 'flex', flexDirection: 'column', gap: 12,
    cursor: 'pointer', transition: 'border-color 0.2s, transform 0.15s',
    animation: 'fadeUp 0.45s ease both',
  },
  top:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' },
  name:  { fontSize: 15, fontWeight: 600, color: 'var(--text)' },
  badge: { fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em' },
  pctRow:  { display: 'flex', alignItems: 'center', gap: 10, position: 'relative' },
  pctTrack:{ flex: 1, height: 4, background: 'var(--bg3)', borderRadius: 99, overflow: 'hidden' },
  pctFill: { height: '100%', borderRadius: 99, transition: 'width 0.6s ease' },
  pctNum:  { fontSize: 11, fontWeight: 700, minWidth: 30, textAlign: 'right' },
  time:    { fontSize: 11, color: 'var(--text3)', position: 'relative' },
  btn: {
    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '9px 0', background: 'var(--bg3)', border: '1px solid var(--border2)',
    borderRadius: 8, color: 'var(--text2)', fontSize: 12, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
  },
}

/* ── Overlay / Modal styles ── */
const ov = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease',
  },
  container: {
    display: 'flex', width: 820, maxWidth: '96vw', maxHeight: '85vh',
    background: 'var(--bg2)', border: '1px solid var(--border2)',
    borderRadius: 18, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
    animation: 'fadeUp 0.3s ease',
  },

  /* sidebar */
  sidebar:   { width: 220, flexShrink: 0, background: 'var(--bg3)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  sideItem:  { padding: '12px 18px', borderBottom: '1px solid var(--border)' },
  sideLabel: { display: 'block', fontSize: 11, color: 'var(--text3)', fontWeight: 700, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' },
  sideValue: { display: 'block', fontSize: 14, color: 'var(--text)', fontWeight: 500 },
  sideFooter:{ padding: '14px 16px' },
  backBtn:   { width: '100%', padding: '9px 0', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--text2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },

  /* main */
  main:       { flex: 1, padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' },
  titlePillWrap: { display: 'flex', justifyContent: 'center', marginBottom: 4 },
  titlePill:  { background: 'var(--accent)', color: '#0d0f12', fontWeight: 700, fontSize: 14, padding: '7px 32px', borderRadius: 20 },

  tableHead:  { display: 'flex', alignItems: 'center', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: '10px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text2)', gap: 8 },
  tableRow:   { display: 'flex', alignItems: 'center', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, padding: '10px 16px', fontSize: 13, gap: 8, cursor: 'pointer', transition: 'all 0.12s' },
  tableRowActive: { borderColor: 'var(--accent)', background: 'rgba(0,229,160,0.06)' },

  col1:      { flex: '0 0 110px', fontSize: 12, color: 'var(--text2)' },
  col2:      { flex: '0 0 80px' },
  col3:      { flex: 1, textAlign: 'right', fontSize: 12, color: 'var(--text2)' },
  levelBadge:{ flex: '0 0 80px', textAlign: 'center', fontSize: 12, fontWeight: 700, padding: '3px 0', borderRadius: 10 },
  noteInline:{ color: 'var(--text3)', fontStyle: 'italic' },
  emptyRow:  { textAlign: 'center', color: 'var(--text3)', padding: 32, fontSize: 13 },
}