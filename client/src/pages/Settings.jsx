import { useState } from 'react'; import { useApp } from '../context.jsx'; import { Field } from './Auth.jsx';
const PREFS = [['reports', 'Weekly report by email'], ['alerts', 'Alert me when churn rises'], ['updates', 'Product news and tips']];
export default function Settings() { const { user, saveProfile, theme, setTheme, toast } = useApp(), [name, setName] = useState(user.name), [company, setCompany] = useState(user.company),
  [prefs, setPrefs] = useState(() => JSON.parse(localStorage.prefs || '{"reports":true,"alerts":true,"updates":false}'));
  const save = async e => { e.preventDefault(); try { await saveProfile({ name, company }); toast('Profile saved.'); } catch (x) { toast(x.message, 'bad'); } };
  const flip = k => { const n = { ...prefs, [k]: !prefs[k] }; setPrefs(n); localStorage.prefs = JSON.stringify(n); };
  return (<div><div className="head"><div><h1>Settings</h1><p>Manage your profile and how the dashboard looks.</p></div></div>
    <div className="two"><form className="card" onSubmit={save}><h3>Profile</h3><Field label="Full name" value={name} set={setName} /><Field label="Company" req={false} value={company} set={setCompany} />
      <p>Signed in as <b>{user.email}</b></p><button className="cta">Save changes</button></form>
      <div><div className="card"><h3>Appearance</h3><div className="seg">{['dark', 'light'].map(t => <button key={t} className={theme === t ? 'on' : ''} onClick={() => setTheme(t)}>{theme === t && <span />}<em>{t === 'dark' ? 'Dark' : 'Light'}</em></button>)}</div></div>
        <div className="card"><h3>Notifications</h3>{PREFS.map(([k, l]) => <div className="row" key={k}><span>{l}</span><button role="switch" aria-checked={!!prefs[k]} aria-label={l} className={'sw ' + (prefs[k] ? 'on' : '')} onClick={() => flip(k)}><i /></button></div>)}</div></div></div></div>); }
