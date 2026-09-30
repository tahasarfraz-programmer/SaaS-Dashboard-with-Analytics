import { useState } from 'react'; import { motion } from 'framer-motion'; import { useApi } from '../api.js';
export default function Customers() {
  const [q, setQ] = useState(''), { data, err } = useApi(`/api/customers?q=${encodeURIComponent(q)}`);
  return (
    <div><div className="head"><div><h1>Customers</h1><p>{data ? data.length : '…'} accounts</p></div>
      <input className="search" placeholder="Search name, email, plan or status" value={q} onChange={e => setQ(e.target.value)} /></div>
      <div className="card scroll">{err && <p className="empty">Could not load customers. Is the API running?</p>}
        <table><thead><tr><th>Customer</th><th>Plan</th><th>MRR</th><th>Status</th><th>Country</th></tr></thead>
          <tbody>{data?.map((c, i) => <motion.tr key={c.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i, 12) * 0.03 }}>
            <td><div className="who"><span className="av">{c.name[0]}</span><div><b>{c.name}</b><small>{c.email}</small></div></div></td>
            <td>{c.plan}</td><td>${c.mrr}</td><td><span className={'pill ' + c.status}>{c.status}</span></td><td>{c.country}</td></motion.tr>)}</tbody></table>
        {data && !data.length && <p className="empty">No customers match “{q}”. Try a plan name such as Pro.</p>}</div></div>);
}
