import { useState } from 'react'; import { Link } from 'react-router-dom'; import { motion } from 'framer-motion'; import { useApp } from '../context.jsx'; import { Logo } from '../ui.jsx';
export function Field({ label, type = 'text', value, set, auto, req = true }) { const [show, setShow] = useState(false), pw = type === 'password';
  return <label className="fld"><input type={pw && show ? 'text' : type} value={value} onChange={e => set(e.target.value)} placeholder=" " autoComplete={auto} required={req} />
    <span>{label}</span>{pw && <button type="button" className="eye" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>}</label>; }
const score = p => [p.length >= 8, /[a-z]/.test(p) && /[A-Z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length, WORDS = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'];
function Showcase() { return (
  <section className="show"><Logo />
    <div><h2>See your whole business at a glance.</h2><p>Revenue, users and customers in one live dashboard.</p>
      <ul><li>Live revenue and growth charts</li><li>Every customer account and plan in one place</li><li>Light and dark themes that remember you</li></ul></div>
    <div className="stage">
      <motion.div className="fc a" animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}><small>Revenue this month</small><b>$48,290</b><span className="up">▲ 12.4%</span>
        <svg viewBox="0 0 120 36"><motion.path d="M0 30 C20 28 25 12 45 16 S80 30 95 10 L120 4" fill="none" stroke="#5eead4" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.6 }} /></svg></motion.div>
      <motion.div className="fc b" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}><span className="av">A</span><div><b>New customer</b><small>Ava Chen joined Pro</small></div></motion.div>
    </div></section>); }
function Frame({ mode, title, sub, children }) { return (
  <div className="auth"><Showcase /><main className="pane">
    <motion.div className="acard" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="tabs">{[['login', 'Log in', '/login'], ['register', 'Create account', '/register']].map(([k, l, to]) => <Link key={k} to={to} className={mode === k ? 'on' : ''}>{l}</Link>)}</div>
      <h1>{title}</h1><p>{sub}</p>{children}</motion.div></main></div>); }
const Err = ({ msg }) => msg ? <motion.p key={msg} className="err" role="alert" animate={{ x: [0, -8, 8, -5, 5, 0] }}>{msg}</motion.p> : null;
const Go = ({ busy, children }) => <button className="cta" disabled={busy}>{busy ? <i className="spin" /> : children}</button>;
export function Login() { const { login } = useApp(), [f, setF] = useState({ email: '', password: '' }), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const submit = async e => { e.preventDefault(); setErr(''); setBusy(true); try { await login(f); } catch (x) { setErr(x.message); setBusy(false); } };
  return <Frame mode="login" title="Welcome back" sub="Log in to see how your business is doing today.">
    <form onSubmit={submit}><Field label="Email address" type="email" auto="email" value={f.email} set={v => setF({ ...f, email: v })} />
      <Field label="Password" type="password" auto="current-password" value={f.password} set={v => setF({ ...f, password: v })} /><Err msg={err} /><Go busy={busy}>Log in</Go></form>
    <p className="alt">New here? <Link to="/register">Create a free account</Link></p></Frame>; }
export function Register() { const { register } = useApp(), [f, setF] = useState({ name: '', company: '', email: '', password: '' }), [ok, setOk] = useState(false), [err, setErr] = useState(''), [busy, setBusy] = useState(false), s = score(f.password), up = k => v => setF({ ...f, [k]: v });
  const submit = async e => { e.preventDefault(); setErr(''); if (!ok) return setErr('Please agree to the terms to continue.'); setBusy(true); try { await register(f); } catch (x) { setErr(x.message); setBusy(false); } };
  return <Frame mode="register" title="Create your account" sub="Start tracking your growth in under a minute.">
    <form onSubmit={submit}><Field label="Full name" auto="name" value={f.name} set={up('name')} /><Field label="Company (optional)" auto="organization" req={false} value={f.company} set={up('company')} />
      <Field label="Work email" type="email" auto="email" value={f.email} set={up('email')} /><Field label="Password" type="password" auto="new-password" value={f.password} set={up('password')} />
      <div className="meter" data-s={f.password ? s : 0}><div>{[1, 2, 3, 4].map(i => <i key={i} className={i <= s ? 'on' : ''} />)}</div><small>{f.password ? WORDS[s] : 'Use 8+ characters with upper and lower case, a number and a symbol'}</small></div>
      <label className="chk"><input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} />I agree to the terms and privacy policy</label><Err msg={err} /><Go busy={busy}>Create account</Go></form>
    <p className="alt">Already have an account? <Link to="/login">Log in</Link></p></Frame>; }
