import React, { useState } from 'react';
import { 
  BarChart3, Calculator, FileText, HardHat, 
  Bell, ChevronDown, Save, Zap, CheckCircle2,
  MapPin, Calendar, TrendingUp, Plus
} from 'lucide-react';

// STYLING HELPERS
const cardStyle = { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '5px' };

export default function App() {
  const [activeTab, setActiveTab] = useState('Input Project Data');
  
  // PROJECT DATA
  const [project] = useState({
    name: 'Residential Concrete Building - Block A',
    area: 2450.75,
    status: 'Active / In Progress',
    location: 'Las Palmas, Gran Canaria',
    startDate: 'March 2026'
  });

  // LABOR DATA (Including Site Setup)
  const [tasks, setTasks] = useState([
    { id: 1, name: "Site Setup & Fencing", type: "General Labor", count: 4, rate: 22 },
    { id: 2, name: "Clearing Forests/Debris", type: "Laborers", count: 6, rate: 24 },
    { id: 3, name: "Excavation", type: "Excavator Operators", count: 8, rate: 28 },
    { id: 4, name: "Ground Slab", type: "Equipment Operators", count: 4, rate: 33 },
    { id: 5, name: "External Walls", type: "Bricklayers", count: 10, rate: 31 },
    { id: 6, name: "Floor Finishes", type: "Floor Installers", count: 18, rate: 39 }
  ]);

  const updateWorkerCount = (id, newCount) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, count: parseInt(newCount) || 0 } : t));
  };

  // Calculation: Count * 8hrs * 20 days * Rate
  const totalLaborCost = tasks.reduce((sum, t) => sum + (t.count * 8 * 20 * t.rate), 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '280px', backgroundColor: '#0046ad', color: 'white', padding: '20px', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '8px' }}>
            <HardHat color="#0046ad" size={24} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px' }}>CONCRETEBUILD PRO</h2>
        </div>
        
        {['Project Dashboard', 'Input Project Data', 'Labor & Equipment', 'Payments', 'Reports & Analytics'].map(item => (
          <button key={item} onClick={() => setActiveTab(item)} style={{
            width: '100%', padding: '12px', textAlign: 'left', background: activeTab === item ? '#ffffff20' : '