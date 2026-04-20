import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getLocations, recordBin, getBinHistory } from '../services/api'
import Navbar from './Navbar'

const SL  = { empty: 'ว่าง', half: 'ครึ่ง', full: 'เต็ม' }
const SC  = { empty: 'var(--empty)', half: 'var(--warn)', full: 'var(--danger)' }
const SBG = { empty: 'rgba(0,229,160,0.08)', half: 'rgba(255,179,64,0.08)', full: 'rgba(255,90,90,0.08)' }
const PCT = { empty: 18, half: 55, full: 95 }
const STATUS_COLOR = { empty: '#5a9e6f', half: '#d4924a', full: '#c25c5c' }

const STATUS_OPTS = [
  { value: 'empty', label: 'ว่าง',  icon: '🟢', color: 'var(--empty)' },
  { value: 'half',  label: 'ครึ่ง', icon: '🟡', color: 'var(--warn)'  },
  { value: 'full',  label: 'เต็ม',  icon: '🔴', color: 'var(--danger)'},
]

export default function EmpHome() {
  const { user, logoutUser } = useAuth()
  const [locations, setLocations] = useState([])
  const [loading, setLoading]     = useState(true)

  // Modal บันทึก
  const [modal, setModal]           = useState(null)
  const [mStatus, setMStatus]       = useState('')
  const [mCollected, setMCollected] = useState(null)
  const [mNote, setMNote]           = useState('')
  const [mSaving, setMSaving]       = useState(false)
  const [mError, setMError]         = useState('')

  // Modal เพิ่มเติม (detail)
  const [detailModal, setDetailModal]   = useState(null)
  const [detailRecords, setDetailRecords] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchData = () => {
    setLoading(true)
    getLocations().then(r => setLocations(r.data)).finally(() => setLoading(false))
  }
  useEffect(() => { fetchData() }, [])

  const openModal  = bin => { setModal(bin); setMStatus(bin.status || ''); setMCollected(null); setMNote(''); setMError('') }
  const closeModal = ()  => { setModal(null); setMStatus(''); setMCollected(null); setMNote(''); setMError('') }

  const openDetail = async bin => {
    setDetailModal(bin)
    setDetailLoading(true)
    try {
      const r = await getBinHistory(bin.id)
      setDetailRecords(r.data)
    } catch {
      setDetailRecords([])
    } finally {
      setDetailLoading(false)
    }
  }
  const closeDetail = () => { setDetailModal(null); setDetailRecords([]) }

  const handleSave = async () => {
    if (!mStatus) { setMError('กรุณาเลือกระดับความเต็ม'); return }
    setMSaving(true); setMError('')
    const prefix = mCollected === 'collected' ? '[เก็บแล้ว] ' : mCollected === 'not_collected' ? '[ยังไม่เก็บ] ' : ''
    try {
      await recordBin(modal.id, { status: mStatus, note: prefix + mNote })
      closeModal(); fetchData()
    } catch (err) {
      setMError(err.response?.data?.message || 'เกิดข้อผิดพลาด')
    } finally { setMSaving(false) }
  }

  const loc = locations[0]

  return (
    <div style={s.page}>
      <Navbar role="emp" locationName={loc?.name} onLogout={logoutUser} />

      <div style={s.body}>
        {loading ? <Loader /> : !loc ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}>📍</div>
            <p style={s.emptyText}>ยังไม่ได้รับมอบหมายพื้นที่</p>
            <p style={s.emptySub}>ติดต่อ admin เพื่อ assign location</p>
          </div>
        ) : (
          <>
            <div style={s.locBanner}>
              <span style={s.locDot} />
              <span style={s.locLabel}>{loc.name}</span>
              <span style={s.locCount}>{loc.bins.length} ถัง</span>
            </div>
            <div style={s.grid}>
              {loc.bins.map((bin, bi) => (
                <BinCard key={bin.id} bin={bin} delay={bi * 0.06}
                  onDetail={() => openDetail(bin)}
                  onRecord={() => openModal(bin)} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Modal เพิ่มเติม (Detail) ── */}
      {detailModal && (
        <div style={m.overlay} onClick={e => { if (e.target === e.currentTarget) closeDetail() }}>
          <div style={d.box}>
            <div style={d.header}>
              <div>
                <div style={d.headerTitle}>รายละเอียดถัง</div>
                <div style={d.headerSub}>#{detailModal.id} · {detailModal.label}</div>
              </div>
              <button style={m.closeBtn} onClick={closeDetail}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {detailLoading ? (
              <div style={{ padding: '40px 0', display: 'flex', justifyContent: 'center' }}><Loader /></div>
            ) : (() => {
              const latest = detailRecords[0]
              const fields = [
                { label: 'bin_id',        value: `#${detailModal.id}` },
                { label: 'location_name', value: latest?.location_name ?? detailModal.location_name ?? '—' },
                { label: 'waste_type',    value: detailModal.label ?? '—' },
                { label: 'timestamp',     value: latest ? new Date(latest.recorded_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }) : '—' },
                { label: 'fill_level',    value: latest ? (SL[latest.status] ?? '—') : '—' },
                { label: 'gas_level',     value: latest?.gas_level ?? '—' },
                { label: 'capacity',      value: latest?.capacity ?? '—' },
                { label: 'status',        value: latest ? (SL[latest.status] ?? '—') : '—' },
              ]
              return (
                <>
                  <div style={d.fields}>
                    {fields.map(f => (
                      <div key={f.label} style={d.fieldRow}>
                        <span style={d.fieldLabel}>{f.label}</span>
                        <span style={{
                          ...d.fieldVal,
                          ...(f.label === 'status' || f.label === 'fill_level'
                            ? { color: latest?.status ? STATUS_COLOR[latest.status] : 'var(--text2)', fontWeight: 700 }
                            : {})
                        }}>{f.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={d.footer}>
                    <button style={d.backBtn} onClick={closeDetail}>ปิด</button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* ── Modal บันทึก ── */}
      {modal && (
        <div style={m.overlay} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={m.box}>

            <div style={m.header}>
              <div>
                <div style={m.headerTitle}>บันทึกการเก็บขยะ</div>
                <div style={m.headerSub}>#{modal.id} · {modal.label}</div>
              </div>
              <button style={m.closeBtn} onClick={closeModal}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={m.section}>
              <div style={m.sectionLabel}>สถานะการเก็บ</div>
              <div style={m.radioRow}>
                {[
                  { v: 'collected',     l: '✓ เก็บแล้ว',    active: 'var(--empty)'  },
                  { v: 'not_collected', l: '✗ ยังไม่เก็บ',  active: 'var(--danger)' },
                ].map(opt => (
                  <button
                    key={opt.v}
                    style={{
                      ...m.radioBtn,
                      background:   mCollected === opt.v ? `${opt.active}18` : 'var(--bg3)',
                      borderColor:  mCollected === opt.v ? opt.active : 'var(--border)',
                      color:        mCollected === opt.v ? opt.active : 'var(--text2)',
                    }}
                    onClick={() => setMCollected(mCollected === opt.v ? null : opt.v)}
                  >{opt.l}</button>
                ))}
              </div>
            </div>

            <div style={m.section}>
              <div style={m.sectionLabel}>ระดับความเต็ม <span style={{ color: 'var(--danger)' }}>*</span></div>
              <div style={m.statusRow}>
                {STATUS_OPTS.map(opt => (
                  <button
                    key={opt.value}
                    style={{
                      ...m.statusBtn,
                      background:  mStatus === opt.value ? `${opt.color}20` : 'var(--bg3)',
                      borderColor: mStatus === opt.value ? opt.color : 'var(--border)',
                      color:       mStatus === opt.value ? opt.color : 'var(--text2)',
                      transform:   mStatus === opt.value ? 'scale(1.03)' : 'scale(1)',
                    }}
                    onClick={() => setMStatus(opt.value)}
                  >
                    <span style={{ fontSize: 20 }}>{opt.icon}</span>
                    <span style={{ fontWeight: 700 }}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={m.section}>
              <div style={m.twoCol}>
                <div style={m.fieldGroup}>
                  <div style={m.sectionLabel}>วันที่</div>
                  <div style={m.dateRow}>
                    <input style={m.dateBox} placeholder="DD"   maxLength={2} type="text" inputMode="numeric" />
                    <span style={{ color: 'var(--text3)' }}>/</span>
                    <input style={m.dateBox} placeholder="MM"   maxLength={2} type="text" inputMode="numeric" />
                    <span style={{ color: 'var(--text3)' }}>/</span>
                    <input style={{ ...m.dateBox, width: 64 }} placeholder="YYYY" maxLength={4} type="text" inputMode="numeric" />
                  </div>
                </div>
                <div style={{ ...m.fieldGroup, flex: 1 }}>
                  <div style={m.sectionLabel}>หมายเหตุ</div>
                  <input style={m.noteInput} value={mNote} onChange={e => setMNote(e.target.value)} placeholder="ระบุหมายเหตุ..." />
                </div>
              </div>
            </div>

            {mError && <div style={m.error}>⚠ {mError}</div>}

            <div style={m.footer}>
              <button style={m.backBtn} onClick={closeModal}>ยกเลิก</button>
              <button style={{ ...m.saveBtn, opacity: mSaving ? 0.7 : 1 }} onClick={handleSave} disabled={mSaving}>
                {mSaving ? <span style={m.spinner} /> : '✓ บันทึกข้อมูล'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BinCard({ bin, delay, onDetail, onRecord }) {
  const hasSt = !!bin.status
  const pct   = hasSt ? PCT[bin.status] : 0
  const color = hasSt ? SC[bin.status] : 'var(--text3)'
  return (
    <div style={{ ...c.card, animationDelay: `${delay}s` }}>
      {hasSt && <div style={{ position: 'absolute', inset: 0, background: SBG[bin.status], opacity: 0.5, pointerEvents: 'none', borderRadius: 'inherit' }} />}

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

      <div style={c.btnRow}>
        <button style={c.btnDetail} onClick={onDetail}>เพิ่มเติม</button>
        <button style={c.btnRecord} onClick={onRecord}>+ บันทึก</button>
      </div>
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
  page:  { minHeight: '100vh', background: 'var(--bg)' },
  body:  { padding: '32px 36px', maxWidth: 960, margin: '0 auto' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 18, fontWeight: 600, color: 'var(--text)' },
  emptySub:  { fontSize: 14, color: 'var(--text3)' },
  locBanner: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, animation: 'fadeUp 0.4s ease' },
  locDot:    { width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' },
  locLabel:  { fontSize: 16, fontWeight: 600, color: 'var(--text)' },
  locCount:  { fontSize: 12, color: 'var(--text3)', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px' },
  grid:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 18 },
}

const c = {
  card: {
    position: 'relative', overflow: 'hidden',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '18px 20px 16px',
    display: 'flex', flexDirection: 'column', gap: 12,
    animation: 'fadeUp 0.45s ease both',
  },
  top:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' },
  name:     { fontSize: 16, fontWeight: 600, color: 'var(--text)' },
  badge:    { fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em' },
  pctRow:   { display: 'flex', alignItems: 'center', gap: 10, position: 'relative' },
  pctTrack: { flex: 1, height: 4, background: 'var(--bg3)', borderRadius: 99, overflow: 'hidden' },
  pctFill:  { height: '100%', borderRadius: 99, transition: 'width 0.6s ease' },
  pctNum:   { fontSize: 11, fontWeight: 700, minWidth: 30, textAlign: 'right' },
  time:     { fontSize: 11, color: 'var(--text3)', position: 'relative' },
  btnRow:   { display: 'flex', gap: 8, position: 'relative' },
  btnDetail:{ flex: 1, padding: '9px 0', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--text2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  btnRecord:{ flex: 1, padding: '9px 0', background: 'rgba(0,229,160,0.12)', border: '1px solid rgba(0,229,160,0.25)', borderRadius: 8, color: 'var(--accent)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
}

const d = {
  box:         { background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 18, width: 440, maxWidth: '95vw', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)', animation: 'fadeUp 0.3s ease' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' },
  headerTitle: { fontSize: 17, fontWeight: 700, color: 'var(--text)' },
  headerSub:   { fontSize: 12, color: 'var(--text3)', marginTop: 3 },
  fields:      { display: 'flex', flexDirection: 'column' },
  fieldRow:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 24px', borderBottom: '1px solid var(--border)' },
  fieldLabel:  { fontSize: 13, color: 'var(--text3)', fontWeight: 500 },
  fieldVal:    { fontSize: 14, color: 'var(--text)', fontWeight: 600, textAlign: 'right' },
  footer:      { display: 'flex', padding: '16px 24px' },
  backBtn:     { flex: 1, padding: '11px 0', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, color: 'var(--text2)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
}

const m = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease' },
  box:     { background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 18, width: 580, maxWidth: '95vw', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)', animation: 'fadeUp 0.3s ease' },

  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' },
  headerTitle:{ fontSize: 17, fontWeight: 700, color: 'var(--text)' },
  headerSub: { fontSize: 12, color: 'var(--text3)', marginTop: 3 },
  closeBtn:  { width: 32, height: 32, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  section:      { padding: '18px 24px', borderBottom: '1px solid var(--border)' },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 },

  radioRow: { display: 'flex', gap: 10 },
  radioBtn: {
    flex: 1, padding: '10px 14px', border: '1px solid', borderRadius: 10,
    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
    transition: 'all 0.15s',
  },

  statusRow: { display: 'flex', gap: 10 },
  statusBtn: {
    flex: 1, padding: '14px 8px', border: '1px solid', borderRadius: 10,
    fontSize: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    transition: 'all 0.15s', fontFamily: 'inherit',
  },

  twoCol:     { display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
  dateRow:    { display: 'flex', alignItems: 'center', gap: 6 },
  dateBox:    { width: 44, padding: '9px 6px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, textAlign: 'center', fontSize: 14, color: 'var(--text)', fontFamily: 'inherit', outline: 'none' },
  noteInput:  { width: '100%', padding: '9px 12px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 14, color: 'var(--text)', fontFamily: 'inherit', outline: 'none' },

  error: { margin: '0 24px', padding: '10px 14px', background: 'rgba(255,90,90,0.08)', border: '1px solid rgba(255,90,90,0.2)', borderRadius: 8, color: 'var(--danger)', fontSize: 13 },

  footer:  { display: 'flex', gap: 10, padding: '18px 24px' },
  backBtn: { flex: 1, padding: '12px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, color: 'var(--text2)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  saveBtn: { flex: 2, padding: '12px', background: 'var(--accent)', border: 'none', borderRadius: 10, color: '#0d0f12', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.15s' },
  spinner: { width: 18, height: 18, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#0d0f12', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' },
}