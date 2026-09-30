import { useEffect, useState } from 'react';
export function CountUp({ to, prefix = '', suffix = '', dec = 0 }) { const [v, setV] = useState(0);
  useEffect(() => { let raf, t0; const f = t => { t0 ??= t; const p = Math.min((t - t0) / 900, 1); setV(to * (1 - (1 - p) ** 3)); if (p < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf); }, [to]);
  return <>{prefix}{v.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec })}{suffix}</>; }
export const Tip = ({ active, payload, label }) => active && payload?.length ? (
  <div className="tip"><b>{label}</b>{payload.map(p => <p key={p.dataKey}><i style={{ background: p.color }} />{p.name}<span>{p.dataKey === 'revenue' ? '$' : ''}{p.value.toLocaleString()}</span></p>)}</div>) : null;
export const Logo = () => (<svg className="logo" viewBox="0 0 230 44" height="38" role="img" aria-label="Saas Dashboard with Analytics">
  <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#5eead4" /><stop offset="1" stopColor="#a78bfa" /></linearGradient></defs><rect width="40" height="40" y="2" rx="12" fill="url(#lg)" />
  <path d="M11 29V22M20 29V13M29 29v-9" stroke="#0a0f1e" strokeWidth="4" strokeLinecap="round" /><text x="50" y="20" className="w1">Saas Dashboard</text><text x="50" y="38" className="w2">with Analytics</text></svg>);
