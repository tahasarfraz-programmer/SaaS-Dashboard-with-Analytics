import { createContext, useCallback, useContext, useEffect, useState } from 'react'; import { AnimatePresence, motion } from 'framer-motion'; import { request } from './api.js';
const Ctx = createContext(); export const useApp = () => useContext(Ctx);
export function AppProvider({ children }) {
  const [user, setUser] = useState(null), [ready, setReady] = useState(false), [toasts, setToasts] = useState([]), [theme, setTheme] = useState(localStorage.theme || 'dark');
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.theme = theme; }, [theme]);
  useEffect(() => { if (!localStorage.token) return setReady(true);
    request('/api/auth/me').then(r => setUser(r.user)).catch(() => localStorage.removeItem('token')).finally(() => setReady(true)); }, []);
  const toast = useCallback((msg, type = 'ok') => { const id = Math.random(); setToasts(t => [...t, { id, msg, type }]); setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3600); }, []);
  const authed = r => { localStorage.token = r.token; setUser(r.user); };
  const value = { user, ready, theme, setTheme, toast,
    login: async b => authed(await request('/api/auth/login', { method: 'POST', body: b })),
    register: async b => authed(await request('/api/auth/register', { method: 'POST', body: b })),
    logout: () => { localStorage.removeItem('token'); setUser(null); toast('You are logged out. See you soon.'); },
    saveProfile: async b => setUser((await request('/api/auth/profile', { method: 'PUT', body: b })).user) };
  return <Ctx.Provider value={value}>{children}<div className="toasts"><AnimatePresence>{toasts.map(t =>
    <motion.div key={t.id} layout initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} className={'toast ' + t.type}>{t.msg}</motion.div>)}</AnimatePresence></div></Ctx.Provider>; }
