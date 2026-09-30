import { useEffect, useState } from 'react';
export async function request(url, opts = {}) {
  const t = localStorage.token, r = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...(t && { Authorization: 'Bearer ' + t }) }, body: opts.body && JSON.stringify(opts.body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { if (r.status === 401 && t) { localStorage.removeItem('token'); location.href = '/login'; } throw Error(j.error || 'Something went wrong. Try again.'); }
  return j; }
// Keeps the previous data on screen while a new range or search loads
export function useApi(url) { const [data, setData] = useState(null), [err, setErr] = useState(null);
  useEffect(() => { let live = true; setErr(null); request(url).then(j => live && setData(j)).catch(e => live && setErr(e.message)); return () => { live = false; }; }, [url]);
  return { data, err }; }
