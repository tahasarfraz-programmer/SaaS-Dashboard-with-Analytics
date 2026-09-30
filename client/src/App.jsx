import { Routes, Route, NavLink, Navigate, Link, useLocation, useOutlet } from 'react-router-dom'; import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from './context.jsx'; import { Logo } from './ui.jsx'; import Overview from './pages/Overview.jsx'; import Customers from './pages/Customers.jsx'; import Settings from './pages/Settings.jsx'; import { Login, Register } from './pages/Auth.jsx';
function Shell() { const { user, logout, theme, setTheme } = useApp(), loc = useLocation(), outlet = useOutlet();
  return (<div className="shell"><aside><Logo />
    <nav>{[['/', 'Overview'], ['/customers', 'Customers'], ['/settings', 'Settings']].map(([to, l]) => <NavLink key={to} to={to} end>{l}</NavLink>)}</nav>
    <button className="theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}</button>
    <div className="me"><span className="av">{user.name[0]}</span><div><b>{user.name}</b><small>{user.email}</small></div><button onClick={logout}>Log out</button></div></aside>
    <main><AnimatePresence mode="wait"><motion.div key={loc.pathname} initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>{outlet}</motion.div></AnimatePresence></main></div>); }
export default function App() { const { user, ready } = useApp(), loc = useLocation();
  if (!ready) return <div className="boot"><Logo /></div>;
  return (<Routes>
    <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} /><Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
    <Route element={user ? <Shell /> : <Navigate to="/login" replace state={{ from: loc }} />}>
      <Route index element={<Overview />} /><Route path="customers" element={<Customers />} /><Route path="settings" element={<Settings />} />
      <Route path="*" element={<div className="card empty"><h3>This page doesn’t exist</h3><Link to="/">Back to Overview</Link></div>} /></Route></Routes>); }
