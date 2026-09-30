import { useState } from 'react'; import { motion } from 'framer-motion';
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useApi } from '../api.js'; import { CountUp, Tip } from '../ui.jsx'; import { useApp } from '../context.jsx';
const COLORS = ['#5eead4', '#a78bfa', '#fbbf24', '#fb7185'];
const list = { show: { transition: { staggerChildren: 0.08 } } }, item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };
export default function Overview() {
  const { user } = useApp(), [range, setRange] = useState(30), { data, err } = useApi(`/api/overview?range=${range}`);
  if (err) return <p className="empty">Could not load analytics. Start the API with <code>npm run dev</code> from the project root.</p>;
  if (!data) return <div className="skeleton" />;
  return (
    <motion.div variants={list} initial="hidden" animate="show">
      <div className="head"><div><h1>Welcome back, {user.name.split(' ')[0]}</h1><p>How the business performed over the last {range} days.</p></div>
        <div className="seg">{[7, 30, 90].map(r => <button key={r} onClick={() => setRange(r)} className={r === range ? 'on' : ''}>{r === range && <motion.span layoutId="pill" />}<em>{r} days</em></button>)}</div></div>
      <div className="kpis">{data.kpis.map(k => { const good = (k.delta >= 0) !== !!k.invert;
        return <motion.div variants={item} className="card kpi" key={k.label}><small>{k.label}</small>
          <strong><CountUp to={k.value} prefix={k.prefix} suffix={k.suffix} dec={k.dec} /></strong>
          <span className={good ? 'up' : 'down'}>{k.delta >= 0 ? '▲' : '▼'} {Math.abs(k.delta).toFixed(1)}% vs earlier</span></motion.div>; })}</div>
      <motion.div variants={item} className="card"><h3>Revenue and active users</h3>
        <div className="chart"><ResponsiveContainer><ComposedChart data={data.series}>
          <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5eead4" stopOpacity=".45" /><stop offset="1" stopColor="#5eead4" stopOpacity="0" /></linearGradient></defs>
          <CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={28} />
          <YAxis yAxisId="l" tickLine={false} axisLine={false} width={46} tickFormatter={v => '$' + v / 1000 + 'k'} /><YAxis yAxisId="r" orientation="right" hide />
          <Tooltip content={<Tip />} cursor={{ stroke: 'var(--mute)', strokeDasharray: 4 }} />
          <Area yAxisId="l" dataKey="revenue" name="Revenue" stroke="#5eead4" strokeWidth={2.5} fill="url(#g)" />
          <Line yAxisId="r" dataKey="users" name="Active users" stroke="#a78bfa" strokeWidth={2} dot={false} /></ComposedChart></ResponsiveContainer></div></motion.div>
      <div className="two">
        <motion.div variants={item} className="card"><h3>Where users come from</h3><div className="donut">
          <div className="chart s"><ResponsiveContainer><PieChart><Pie data={data.channels} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={4} stroke="none">
            {data.channels.map((c, i) => <Cell key={c.name} fill={COLORS[i]} />)}</Pie><Tooltip content={<Tip />} /></PieChart></ResponsiveContainer></div>
          <ul className="legend">{data.channels.map((c, i) => <li key={c.name}><i style={{ background: COLORS[i] }} />{c.name}<b>{c.value}%</b></li>)}</ul></div></motion.div>
        <motion.div variants={item} className="card"><h3>Monthly recurring revenue by plan</h3>
          <div className="chart s"><ResponsiveContainer><BarChart data={data.plans}><CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="plan" tickLine={false} axisLine={false} />
            <Tooltip content={<Tip />} cursor={{ fill: 'var(--line)' }} /><Bar dataKey="mrr" name="MRR" radius={[8, 8, 0, 0]} fill="#a78bfa" /></BarChart></ResponsiveContainer></div></motion.div></div>
      <motion.div variants={item} className="card"><h3>Newest customers</h3>
        {data.recent.map(c => <p className="row" key={c.id}><span className="av">{c.name[0]}</span><span><b>{c.name}</b><small>{c.email}</small></span><span className={'pill ' + c.status}>{c.status}</span></p>)}</motion.div>
    </motion.div>);
}
