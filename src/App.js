import React, { useState, useMemo } from 'react';
import { 
  HardHat, Users, Plus, Trash2, LayoutGrid, 
  Activity, Zap, ShieldAlert, ChevronLeft, ChevronRight,
  BarChart3, Calculator, Globe, Coins, ListPlus, ChevronDown, ChevronUp,
  Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceDot, Label } from 'recharts';

const THEME = {
  primary: '#4f46e5', // Deeper Indigo
  success: '#059669', // Vibrant Emerald
  warning: '#d97706', // Rich Amber
  danger: '#e11d48',  // Vivid Rose
  bg: '#f1f5f9',      // Slightly cooler gray
  sidebar: '#1e1b4b', // Deep Midnight Blue
  text: '#0f172a',
  muted: '#475569',
  border: '#cbd5e1'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Forecasting');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [forecastScope, setForecastScope] = useState('single');
  const [expandedPhase, setExpandedPhase] = useState(null);

  const [phases, setPhases] = useState([
    { 
      id: 1, 
      name: "Phase A: Substructure", 
      tasks: [
        { id: 101, name: "Site Prep", rate: 24, duration: 5, labor: 4 },
        { id: 102, name: "Foundations", rate: 34, duration: 12, labor: 10 }
      ]
    },
    { 
      id: 2, 
      name: "Phase B: Superstructure", 
      tasks: [
        { id: 201, name: "Structural Steel", rate: 42, duration: 20, labor: 15 },
        { id: 202, name: "Ground Slab", rate: 33, duration: 7, labor: 9 }
      ]
    }
  ]);

  const [delayMetrics, setDelayMetrics] = useState([
    { id: 1, type: "Site Overheads", dailyCost: 200 },
    { id: 2, type: "Contractual Penalties", dailyCost: 500 }
  ]);

  const [taskCrew, setTaskCrew] = useState(8);
  const [projectCrew, setProjectCrew] = useState(35);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [selectedPhaseId, setSelectedPhaseId] = useState(1);
  const [selectedTaskId, setSelectedTaskId] = useState(101);

  const isProjectMode = forecastScope === 'project';
  const currentPhase = phases.find(p => p.id === selectedPhaseId) || phases[0];
  const currentTask = currentPhase.tasks.find(t => t.id === selectedTaskId) || currentPhase.tasks[0];

  const phaseStats = useMemo(() => {
    const totalHours = currentPhase.tasks.reduce((sum, t) => sum + (t.duration * t.labor * 8), 0);
    const totalBaselineDays = currentPhase.tasks.reduce((sum, t) => sum + t.duration, 0);
    const avgRate = currentPhase.tasks.reduce((sum, t) => sum + t.rate, 0) / (currentPhase.tasks.length || 1);
    const baselineCrew = currentPhase.tasks.reduce((sum, t) => sum + t.labor, 0);
    return { totalHours, totalBaselineDays, avgRate, baselineCrew };
  }, [currentPhase]);

  const activeBaseline = isProjectMode ? phaseStats.totalBaselineDays : currentTask.duration;
  const activeHoursNeeded = isProjectMode ? phaseStats.totalHours : (currentTask.duration * currentTask.labor * 8);
  const activeCrewSize = isProjectMode ? projectCrew : taskCrew;
  const activeRate = isProjectMode ? phaseStats.avgRate : currentTask.rate;
  const activeBaselineCrew = isProjectMode ? phaseStats.baselineCrew : currentTask.labor;

  const forecastDays = parseFloat((activeHoursNeeded / (Math.max(activeCrewSize, 1) * hoursPerDay)).toFixed(1));
  const overrunDays = forecastDays - activeBaseline;
  
  const dailyRiskSum = delayMetrics.reduce((sum, item) => sum + (parseFloat(item.dailyCost) || 0), 0);
  const totalRiskCost = overrunDays > 0 ? overrunDays * dailyRiskSum : 0;
  
  const extraStaffCount = Math.max(0, activeCrewSize - activeBaselineCrew);
  const extraWorkerCost = extraStaffCount * forecastDays * hoursPerDay * activeRate;
  
  const baseLaborCost = forecastDays * activeCrewSize * hoursPerDay * activeRate;
  const finalTotalCost = baseLaborCost + totalRiskCost;

  const targetCrew = isProjectMode ? currentPhase.tasks.reduce((sum, t) => sum + t.labor, 0) : currentTask.labor;
  
  const status = overrunDays <= 0 
    ? { label: 'ACCELERATED', color: THEME.success, bg: '#ecfdf5' } 
    : { label: 'DELAYED', color: THEME.danger, bg: '#fff1f2' };

  const chartData = useMemo(() => {
    const points = [];
    const minCrew = Math.max(1, Math.floor(activeCrewSize * 0.2));
    const maxCrew = Math.max(activeCrewSize * 2, targetCrew * 2);
    for (let i = minCrew; i <= maxCrew; i += Math.ceil(maxCrew / 15)) {
      points.push({
        crew: i,
        days: parseFloat((activeHoursNeeded / (i * hoursPerDay)).toFixed(1))
      });
    }
    points.push({ crew: activeCrewSize, days: forecastDays });
    return points.sort((a, b) => a.crew - b.crew);
  }, [activeHoursNeeded, activeCrewSize, forecastDays, targetCrew, hoursPerDay]);

  const addTask = (phaseId) => {
    setPhases(phases.map(p => p.id === phaseId ? {
      ...p, tasks: [...p.tasks, { id: Date.now(), name: "New Task", rate: 30, duration: 10, labor: 5 }]
    } : p));
  };

  const updateTask = (phaseId, taskId, field, val) => {
    setPhases(phases.map(p => p.id === phaseId ? {
      ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, [field]: isNaN(val) || field === 'name' ? val : parseFloat(val) } : t)
    } : p));
  };

  const updatePhaseName = (phaseId, newName) => {
    setPhases(phases.map(p => p.id === phaseId ? { ...p, name: newName } : p));
  };

  const updateRisk = (id, field, val) => {
    setDelayMetrics(delayMetrics.map(m => m.id === id ? { ...m, [field]: field === 'type' ? val : parseFloat(val) || 0 } : m));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: THEME.bg, color: THEME.text, fontFamily: 'Inter, sans-serif' }}>
      
      <aside style={{ width: isCollapsed ? '80px' : '260px', backgroundColor: THEME.sidebar, padding: '24px 16px', position: 'fixed', height: '100vh', transition: 'all 0.3s ease', zIndex: 100, borderRight: `1px solid ${THEME.primary}44` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ minWidth: '40px', height: '40px', borderRadius: '12px', background: `linear-gradient(135deg, ${THEME.primary}, #818cf8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)' }}><HardHat size={22} /></div>
          {!isCollapsed && <span style={{ fontWeight: '900', color: 'white', letterSpacing: '0.5px' }}>CONSTRUX AI</span>}
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <NavItem active={activeTab === 'Forecasting'} icon={<Activity size={20}/>} label="Simulator" collapsed={isCollapsed} onClick={() => setActiveTab('Forecasting')} />
          <NavItem active={activeTab === 'Project'} icon={<Globe size={20}/>} label="Project Hub" collapsed={isCollapsed} onClick={() => setActiveTab('Project')} />
          <NavItem active={activeTab === 'Metrics'} icon={<ShieldAlert size={20}/>} label="Risk Metrics" collapsed={isCollapsed} onClick={() => setActiveTab('Metrics')} />
        </nav>
      </aside>

      <div style={{ flex: 1, marginLeft: isCollapsed ? '80px' : '260px', transition: 'margin 0.3s ease' }}>
        <header style={{ padding: '20px 40px', backgroundColor: 'white', borderBottom: `2px solid ${THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontWeight: '900', margin: 0, color: THEME.sidebar }}>{activeTab}</h2>
          {activeTab === 'Forecasting' && (
            <div style={{ display: 'flex', background: THEME.bg, padding: '6px', borderRadius: '12px', border: `1px solid ${THEME.border}` }}>
              <button onClick={() => setForecastScope('single')} style={toggleStyle(forecastScope === 'single')}>Single Task</button>
              <button onClick={() => setForecastScope('project')} style={toggleStyle(forecastScope === 'project')}>Project View</button>
            </div>
          )}
        </header>

        <main style={{ padding: '40px' }}>
          {activeTab === 'Forecasting' ? (
            <div>
              <div style={{ marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                  {[...Array(8)].map((_, i) => (
                    <Users key={i} size={32} color={THEME.primary} style={{ opacity: i < (activeCrewSize / 5) ? 1 : 0.15, filter: i < (activeCrewSize / 5) ? 'drop-shadow(0 0 8px rgba(79, 70, 229, 0.3))' : 'none' }} />
                  ))}
                </div>
                
                <div style={{ position: 'relative', width: '100%', maxWidth: '600px', height: '28px', backgroundColor: '#e2e8f0', borderRadius: '50px', overflow: 'visible', border: `1px solid ${THEME.border}` }}>
                  <div style={{ 
                    position: 'absolute', 
                    height: '100%', 
                    width: overrunDays > 0 ? '100%' : `${(forecastDays / activeBaseline) * 100}%`, 
                    background: `linear-gradient(90deg, ${status.color}, #fca5a5)`, 
                    borderRadius: '50px',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }} />
                  <div style={{ 
                    position: 'absolute', 
                    top: '-18px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    backgroundColor: status.color,
                    padding: '4px 20px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '900',
                    color: 'white',
                    boxShadow: '0 8px 16px -4px rgba(0,0,0,0.2)'
                  }}>
                    {status.label}
                  </div>
                </div>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <div style={{ fontWeight: '900', color: status.color, fontSize: '22px' }}>
                    {overrunDays > 0 
                      ? `${overrunDays.toFixed(1)} Days Expected Delay` 
                      : `${Math.abs(overrunDays).toFixed(1)} Days Saved`}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: THEME.muted, marginTop: '4px' }}>
                    {overrunDays > 0 
                      ? `Extra Costs: €${totalRiskCost.toLocaleString()}` 
                      : `Extra Worker Cost: €${extraWorkerCost.toLocaleString()}`}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px', marginBottom: '32px' }}>
                <StatCard label="Forecast Duration" value={`${forecastDays} Days`} color={THEME.primary} bgColor="#eef2ff" />
                <StatCard label="Total Est. Cost" value={`€${finalTotalCost.toLocaleString()}`} color={overrunDays > 0 ? THEME.danger : THEME.success} bgColor={overrunDays > 0 ? '#fff1f2' : '#f0fdf4'} />
                <StatCard label="Overrun / Under" value={`${overrunDays.toFixed(1)} Days`} color={overrunDays > 0 ? THEME.danger : THEME.success} bgColor="#f8fafc" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
                <div style={{...cardStyle, padding: '24px', borderLeft: `6px solid ${THEME.primary}`}}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <h4 style={cardHeader}><BarChart3 size={20} color={THEME.primary}/> Efficiency Model</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: THEME.primary, fontSize: '12px', background: '#eef2ff', padding: '6px 12px', borderRadius: '8px', fontWeight: '700' }}>
                      <Info size={14}/> 
                      <span>Staffing / Time Ratio</span>
                    </div>
                  </div>
                  
                  <div style={{ height: '240px', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <defs>
                          <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={THEME.primary} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="crew" fontSize={11} tickLine={false} axisLine={false} tick={{fill: THEME.muted, fontWeight: '600'}}>
                          <Label value="Crew Size (Workers)" offset={-15} position="insideBottom" fontSize={11} fontWeight="800" fill={THEME.muted}/>
                        </XAxis>
                        <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{fill: THEME.muted, fontWeight: '600'}}>
                          <Label value="Days" angle={-90} position="insideLeft" offset={10} fontSize={11} fontWeight="800" fill={THEME.muted}/>
                        </YAxis>
                        <Area type="monotone" dataKey="days" stroke={THEME.primary} strokeWidth={4} fillOpacity={1} fill="url(#colorDays)" isAnimationActive={false} />
                        <ReferenceDot x={activeCrewSize} y={forecastDays} r={8} fill="white" stroke={status.color} strokeWidth={4} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div style={{ marginTop: '20px', padding: '16px', backgroundColor: THEME.bg, borderRadius: '16px', border: `1px dashed ${THEME.border}` }}>
                    <p style={{ margin: 0, fontSize: '12px', color: THEME.text, lineHeight: '1.6', fontWeight: '600' }}>
                      <b style={{color: THEME.primary}}>System Note:</b> The curve shows labor diminishing returns. 
                      Adding more workers beyond the baseline accelerates delivery but increases <b>Extra Worker Cost</b> linearly.
                    </p>
                  </div>
                </div>

                <div style={{...cardStyle, borderTop: `6px solid ${THEME.sidebar}`}}>
                  <h4 style={{...cardHeader, marginBottom: '24px'}}><Calculator size={20} color={THEME.sidebar}/> Simulation Controls</h4>
                  <label style={labelStyle}>Selected Phase</label>
                  <select style={inputStyle} value={selectedPhaseId} onChange={(e) => setSelectedPhaseId(Number(e.target.value))}>
                    {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  {!isProjectMode && (
                    <div style={{marginTop: '20px'}}>
                      <label style={labelStyle}>Specific Task Focus</label>
                      <select style={inputStyle} value={selectedTaskId} onChange={(e) => setSelectedTaskId(Number(e.target.value))}>
                        {currentPhase.tasks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                  )}
                  <div style={{marginTop: '24px', padding: '20px', background: THEME.bg, borderRadius: '16px'}}>
                    <label style={{...labelStyle, color: THEME.primary}}>Live Crew Size</label>
                    <input type="number" value={activeCrewSize} onChange={(e) => isProjectMode ? setProjectCrew(Number(e.target.value)) : setTaskCrew(Number(e.target.value))} style={{...inputStyle, fontSize: '20px', color: THEME.primary}} />
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'Project' ? (
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h3 style={{ margin: 0, fontWeight: '900' }}>Project Architecture</h3>
                <button style={addBtn} onClick={() => setPhases([...phases, { id: Date.now(), name: "New Phase", tasks: [] }])}><Plus size={18}/> New Phase</button>
              </div>
              {phases.map(phase => (
                <div key={phase.id} style={{ marginBottom: '20px', border: `1px solid ${THEME.border}`, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', padding: '20px', background: '#fcfcfd', cursor: 'pointer', alignItems: 'center' }} onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}>
                    {expandedPhase === phase.id ? <ChevronDown size={22} color={THEME.primary}/> : <ChevronRight size={22}/>}
                    <div style={{ flex: 1, marginLeft: '12px' }}>
                      <input 
                        value={phase.name} 
                        onChange={(e) => updatePhaseName(phase.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ ...ghostInput, fontWeight: '900', fontSize: '16px', width: 'auto', color: THEME.sidebar }}
                      />
                    </div>
                    <button style={{ border: 'none', background: '#eef2ff', color: THEME.primary, padding: '8px 12px', borderRadius: '8px', fontWeight: '700', display: 'flex', gap: '6px', alignItems: 'center' }} onClick={(e) => { e.stopPropagation(); addTask(phase.id); }}>
                      <ListPlus size={18}/> Task
                    </button>
                  </div>
                  {expandedPhase === phase.id && (
                    <div style={{ padding: '20px', borderTop: `1px solid ${THEME.border}`, backgroundColor: 'white' }}>
                      <table style={tableStyle}>
                        <thead style={tableHead}>
                          <tr><th>Task Name</th><th>Rate (€/hr)</th><th>Planned Days</th><th>Min Crew</th><th style={{textAlign: 'right'}}>Action</th></tr>
                        </thead>
                        <tbody>
                          {phase.tasks.map(task => (
                            <tr key={task.id} style={tableRow}>
                              <td><input value={task.name} onChange={(e) => updateTask(phase.id, task.id, 'name', e.target.value)} style={{...ghostInput, color: THEME.primary}}/></td>
                              <td><input type="number" value={task.rate} onChange={(e) => updateTask(phase.id, task.id, 'rate', e.target.value)} style={ghostInput}/></td>
                              <td><input type="number" value={task.duration} onChange={(e) => updateTask(phase.id, task.id, 'duration', e.target.value)} style={ghostInput}/></td>
                              <td><input type="number" value={task.labor} onChange={(e) => updateTask(phase.id, task.id, 'labor', e.target.value)} style={ghostInput}/></td>
                              <td style={{textAlign: 'right'}}><button style={{...iconBtn, color: THEME.danger}} onClick={() => setPhases(phases.map(p => p.id === phase.id ? {...p, tasks: p.tasks.filter(t => t.id !== task.id)} : p))}><Trash2 size={18}/></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h3 style={{ margin: 0, fontWeight: '900' }}>Risk Management</h3>
                <button style={{...addBtn, backgroundColor: THEME.danger}} onClick={() => setDelayMetrics([...delayMetrics, { id: Date.now(), type: "New Risk", dailyCost: 100 }])}><Plus size={18}/> Add Penalty</button>
              </div>
              <table style={tableStyle}>
                <thead style={tableHead}><tr><th>Risk Description</th><th>Daily Cost (€)</th><th style={{textAlign: 'right'}}>Action</th></tr></thead>
                <tbody>
                  {delayMetrics.map(m => (
                    <tr key={m.id} style={tableRow}>
                      <td><input value={m.type} onChange={(e) => updateRisk(m.id, 'type', e.target.value)} style={{...ghostInput, fontWeight: '700'}}/></td>
                      <td><input type="number" value={m.dailyCost} onChange={(e) => updateRisk(m.id, 'dailyCost', e.target.value)} style={{...ghostInput, color: THEME.danger}}/></td>
                      <td style={{textAlign: 'right'}}><button style={iconBtn} onClick={() => setDelayMetrics(delayMetrics.filter(item => item.id !== m.id))}><Trash2 size={18}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: '32px', padding: '24px', backgroundColor: '#fff1f2', borderRadius: '20px', textAlign: 'right', border: `2px solid ${THEME.danger}22` }}>
                <span style={labelStyle}>Projected Daily Exposure: </span>
                <span style={{ fontSize: '28px', fontWeight: '900', color: THEME.danger }}>€{dailyRiskSum.toLocaleString()} / Day</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const NavItem = ({ active, icon, label, collapsed, onClick }) => (
  <button onClick={onClick} style={{ 
    width: '100%', padding: '14px', borderRadius: '12px', border: 'none', 
    background: active ? 'linear-gradient(90deg, rgba(79,70,229,0.2) 0%, rgba(79,70,229,0) 100%)' : 'transparent', 
    color: active ? 'white' : '#94a3b8', cursor: 'pointer', display: 'flex', 
    alignItems: 'center', gap: '14px', transition: '0.3s', justifyContent: collapsed ? 'center' : 'flex-start' 
  }}>
    <span style={{ color: active ? '#818cf8' : 'inherit', filter: active ? 'drop-shadow(0 0 5px rgba(129,140,248,0.5))' : 'none' }}>{icon}</span>
    {!collapsed && <span style={{ fontWeight: active ? '800' : '600', fontSize: '14px' }}>{label}</span>}
  </button>
);

const StatCard = ({ label, value, color, bgColor }) => (
  <div style={{ backgroundColor: 'white', padding: '28px', borderRadius: '24px', border: `1px solid ${THEME.border}`, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', background: `linear-gradient(180deg, white 0%, ${bgColor} 100%)` }}>
    <div style={{ fontSize: '12px', fontWeight: '900', color: THEME.muted, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>{label}</div>
    <div style={{ fontSize: '32px', fontWeight: '900', color }}>{value}</div>
  </div>
);

const toggleStyle = (active) => ({ 
  padding: '8px 20px', border: 'none', borderRadius: '10px', cursor: 'pointer', 
  backgroundColor: active ? THEME.primary : 'transparent', 
  color: active ? 'white' : THEME.muted, 
  fontWeight: '800', fontSize: '13px', transition: '0.2s',
  boxShadow: active ? '0 4px 10px rgba(79, 70, 229, 0.3)' : 'none'
});

const cardStyle = { backgroundColor: 'white', borderRadius: '28px', padding: '32px', border: `1px solid ${THEME.border}`, position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const cardHeader = { display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontSize: '18px', fontWeight: '900', color: THEME.sidebar };
const labelStyle = { fontSize: '11px', fontWeight: '900', color: THEME.muted, textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${THEME.border}`, background: THEME.bg, fontWeight: '800', color: THEME.sidebar, outline: 'none', transition: 'border 0.2s' };
const tableStyle = { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' };
const tableHead = { textAlign: 'left', color: THEME.muted, fontSize: '12px', textTransform: 'uppercase', fontWeight: '900' };
const tableRow = { backgroundColor: 'white' };
const ghostInput = { width: '100%', border: 'none', background: 'transparent', padding: '12px', fontWeight: '700', fontSize: '14px', outline: 'none' };
const addBtn = { backgroundColor: THEME.primary, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' };
const iconBtn = { border: 'none', background: 'none', color: THEME.muted, cursor: 'pointer', padding: '10px', transition: 'transform 0.2s' };