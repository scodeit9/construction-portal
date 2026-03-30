import React, { useState } from 'react';
import { 
  BarChart3, Settings, Calculator, FileText, HardHat, 
  Bell, ChevronDown, Trash2, Save, Zap, CheckCircle2 
} from 'lucide-react';

// STYLING HELPERS
const cardStyle = { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '5px' };

export default function App() {
  const [activeTab, setActiveTab] = useState('Input Project Data');
  
  // YOUR PROJECT DATA
  const [project, setProject] = useState({
    name: 'Residential Concrete Building - Block A',
    area: 2450.75,
    status: 'Active / In Progress'
  });

  // YOUR LABOR DATA (From your CSV)
  const [tasks, setTasks] = useState([
    { id: 1, name: "Clearing Forests/Debris", type: "Laborers", count: 6, rate: 24 },
    { id: 2, name: "Excavation", type: "Excavator Operators", count: 8, rate: 28 },
    { id: 3, name: "Ground Slab", type: "Equipment Operators", count: 4, rate: 33 },
    { id: 4, name: "External Walls", type: "Bricklayers", count: 8, rate: 31 },
    { id: 5, name: "Floor Finishes", type: "Floor Wall Installers", count: 18, rate: 39 }
  ]);

  const updateWorkerCount = (id, newCount) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, count: parseInt(newCount) || 0 } : t));
  };

  const totalLaborCost = tasks.reduce((sum, t) => sum + (t.count * 8 * 20 * t.rate), 0); // Assuming 20 days

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '280px', backgroundColor: '#0046ad', color: 'white', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
          <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '8px' }}><HardHat color="#0046ad" /></div>
          <h2 style={{ fontSize: '18px' }}>CONCRETEBUILD PRO</h2>
        </div>
        
        {['Project Dashboard', 'Input Project Data', 'Labor & Equipment', 'Payments', 'Reports & Analytics'].map(item => (
          <button key={item} onClick={() => setActiveTab(item)} style={{
            width: '100%', padding: '12px', textAlign: 'left', background: activeTab === item ? '#ffffff20' : 'none',
            color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '5px', fontSize: '14px'
          }}>
            {item}
          </button>
        ))}
      </aside>

      {/* MAIN BODY */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* TOP NAV */}
        <header style={{ height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
          <span style={{ color: '#64748b' }}>📍 Project: <strong>{project.name}</strong></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Bell size={20} color="#64748b" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ backgroundColor: '#0046ad', color: 'white', padding: '5px 10px', borderRadius: '20px', fontSize: '12px' }}>PM</div>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>John Doe</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>{activeTab}</h1>
              <p style={{ color: '#64748b', margin: '5px 0' }}>Enter starting phase and key project data</p>
            </div>
            <div style={{ textAlign: 'right', backgroundColor: '#ecfdf5', padding: '10px 20px', borderRadius: '8px', border: '1px solid #10b981' }}>
              <span style={{ fontSize: '12px', color: '#059669', display: 'block' }}>ESTIMATED TOTAL LABOR</span>
              <strong style={{ fontSize: '20px', color: '#047857' }}>€{totalLaborCost.toLocaleString()}</strong>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '16px', color: '#0046ad', marginBottom: '20px' }}>01 Current Project Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div><label style={{ fontSize: '13px', fontWeight: 'bold' }}>Starting Phase</label><input style={inputStyle} value="Excavation" /></div>
              <div><label style={{ fontSize: '13px', fontWeight: 'bold' }}>Current Status</label><input style={inputStyle} value={project.status} /></div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '16px', color: '#0046ad', marginBottom: '20px' }}>03 Labor Information</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '13px' }}>
                  <th style={{ padding: '10px' }}>Task</th>
                  <th>Worker Type</th>
                  <th>No. of Workers</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '15px 10px', fontSize: '14px' }}>{t.name}</td>
                    <td style={{ color: '#64748b', fontSize: '14px' }}>{t.type}</td>
                    <td>
                      <input 
                        type="number" 
                        value={t.count} 
                        onChange={(e) => updateWorkerCount(t.id, e.target.value)}
                        style={{ width: '60px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button style={{ padding: '12px 25px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Clear Form</button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ padding: '12px 25px', borderRadius: '8px', border: '1px solid #0046ad', background: 'white', color: '#0046ad', fontWeight: 'bold', cursor: 'pointer' }}>Save as Draft</button>
              <button style={{ padding: '12px 25px', borderRadius: '8px', border: 'none', background: '#0046ad', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} /> Calculate & Update
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}