import express from 'express'; import cors from 'cors'; import { existsSync } from 'fs'; import path from 'path'; import { fileURLToPath } from 'url'; import fs from 'fs'; import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken';
const app = express(); app.use(cors()); app.use(express.json());
// Seeded random so every run shows the same believable data
const rng = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const NAMES = ['Ava Chen','Liam Ortiz','Noah Patel','Mia Rossi','Zoe Kim','Ethan Cole','Isla Novak','Omar Haddad','Lena Berg','Kai Tanaka','Ruby Adams','Leo Silva'];
const PLANS = [['Free',0],['Pro',49],['Team',149],['Enterprise',599]], COUNTRIES = ['US','UK','DE','IN','BR','JP','CA','FR'], STATUS = ['active','active','active','trial','churned'];
const customers = (() => { const r = rng(42); return Array.from({ length: 36 }, (_, i) => {
  const name = NAMES[i % 12] + (i >= 12 ? ` ${String.fromCharCode(64 + i / 12)}.` : ''), [plan, mrr] = PLANS[r() * 4 | 0];
  return { id: i + 1, name, email: name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/\.$/, '') + '@example.com', plan, mrr, status: STATUS[r() * 5 | 0], country: COUNTRIES[r() * 8 | 0] }; }); })();

// ---- Auth: bcrypt-hashed passwords, JWT sessions, users stored in server/data/users.json ----
const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me', DB = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data/users.json');
const load = () => existsSync(DB) ? JSON.parse(fs.readFileSync(DB, 'utf8')) : [];
const save = u => { fs.mkdirSync(path.dirname(DB), { recursive: true }); fs.writeFileSync(DB, JSON.stringify(u, null, 2)); };
const pub = u => ({ id: u.id, name: u.name, email: u.email, company: u.company || '' }), sign = u => jwt.sign({ id: u.id }, SECRET, { expiresIn: '7d' });
const guard = (req, res, next) => { try { const { id } = jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), SECRET); const u = load().find(x => x.id === id); if (!u) throw 0; req.user = u; next(); } catch { res.status(401).json({ error: 'Please log in.' }); } };
app.post('/api/auth/register', (req, res) => { const { name = '', email = '', password = '', company = '' } = req.body, users = load();
  if (name.trim().length < 2) return res.status(400).json({ error: 'Enter your full name.' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  if (password.length < 8) return res.status(400).json({ error: 'Use at least 8 characters for your password.' });
  if (users.some(u => u.email === email.toLowerCase())) return res.status(409).json({ error: 'An account with this email already exists. Log in instead.' });
  const u = { id: Date.now(), name: name.trim(), email: email.toLowerCase(), company: company.trim(), hash: bcrypt.hashSync(password, 10) }; users.push(u); save(users); res.status(201).json({ token: sign(u), user: pub(u) }); });
app.post('/api/auth/login', (req, res) => { const { email = '', password = '' } = req.body, u = load().find(x => x.email === email.toLowerCase());
  if (!u || !bcrypt.compareSync(password, u.hash)) return res.status(401).json({ error: 'Email or password is incorrect.' }); res.json({ token: sign(u), user: pub(u) }); });
app.get('/api/auth/me', guard, (req, res) => res.json({ user: pub(req.user) }));
app.put('/api/auth/profile', guard, (req, res) => { const { name = '', company = '' } = req.body, users = load(), u = users.find(x => x.id === req.user.id);
  if (name.trim().length < 2) return res.status(400).json({ error: 'Enter your full name.' }); u.name = name.trim(); u.company = company.trim(); save(users); res.json({ user: pub(u) }); });
app.use('/api', guard); // everything below needs a valid token

app.get('/api/overview', (req, res) => {
  const days = [7, 30, 90].includes(+req.query.range) ? +req.query.range : 30, r = rng(days * 7);
  const series = Array.from({ length: days }, (_, i) => ({ date: new Date(Date.now() - (days - 1 - i) * 864e5).toISOString().slice(5, 10),
    revenue: Math.round(4200 + i * (2700 / days) + Math.sin(i / 2.5) * 700 + r() * 600), users: Math.round(900 + i * (240 / days) + Math.cos(i / 3) * 90 + r() * 60) }));
  const sum = a => a.reduce((s, x) => s + x, 0), h = days >> 1, rev = series.map(s => s.revenue), usr = series.map(s => s.users);
  const pct = a => (sum(a.slice(h)) / sum(a.slice(0, h)) - 1) * 100;
  res.json({ series,
    kpis: [{ label: 'Revenue', value: sum(rev), prefix: '$', delta: pct(rev) }, { label: 'Active users', value: usr.at(-1), delta: pct(usr) },
      { label: 'Conversion', value: 3.2 + r(), suffix: '%', dec: 1, delta: r() * 8 - 2 }, { label: 'Churn', value: 1.4 + r(), suffix: '%', dec: 1, delta: -(r() * 6), invert: true }],
    channels: [{ name: 'Organic', value: 42 }, { name: 'Paid', value: 27 }, { name: 'Referral', value: 19 }, { name: 'Email', value: 12 }],
    plans: PLANS.slice(1).map(([plan]) => ({ plan, mrr: customers.filter(c => c.plan === plan && c.status !== 'churned').reduce((s, c) => s + c.mrr, 0) })),
    recent: customers.slice(0, 5) });
});
app.get('/api/customers', (req, res) => { const q = (req.query.q || '').toLowerCase();
  res.json(customers.filter(c => [c.name, c.email, c.plan, c.status].some(v => v.toLowerCase().includes(q)))); });

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../client/dist');
if (existsSync(dist)) { app.use(express.static(dist)); app.get('*', (_, res) => res.sendFile(path.join(dist, 'index.html'))); }
app.listen(4000, () => console.log('API ready on http://localhost:4000'));
