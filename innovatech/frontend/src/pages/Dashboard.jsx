import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Dashboard() {
  const [kpis, setKpis]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/analitica/kpis')
      .then(({ data }) => setKpis(data))
      .catch(() => setError('No se pudieron cargar los KPIs'))
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <nav style={styles.sidebar}>
        <h2 style={styles.logo}>Innovatech</h2>
        <Link style={styles.navLink} to="/">📊 Dashboard</Link>
        <Link style={styles.navLink} to="/proyectos">📁 Proyectos</Link>
        <Link style={styles.navLink} to="/recursos">👥 Recursos</Link>
        <button style={styles.logoutBtn} onClick={logout}>Cerrar sesión</button>
      </nav>

      {/* Main */}
      <main style={styles.main}>
        <h1 style={styles.title}>Panel de KPIs</h1>

        {loading && <p>Cargando indicadores...</p>}
        {error   && <p style={{ color: 'red' }}>{error}</p>}

        {kpis && (
          <div style={styles.grid}>
            <KpiCard label="Total Proyectos"      value={kpis.totalProyectos}    color="#4f46e5" />
            <KpiCard label="Proyectos Activos"    value={kpis.proyectosActivos}  color="#059669" />
            <KpiCard label="Tareas Completadas"   value={kpis.tareasCompletadas} color="#d97706" />
            <KpiCard label="Total Empleados"      value={kpis.totalEmpleados}    color="#7c3aed" />
            <KpiCard label="Empleados Asignados"  value={kpis.empleadosAsignados} color="#db2777" />
            <KpiCard label="Tasa Utilización"     value={`${kpis.tasaUtilizacion}%`} color="#0891b2" />
          </div>
        )}
      </main>
    </div>
  )
}

function KpiCard({ label, value, color }) {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <p style={styles.cardLabel}>{label}</p>
      <p style={{ ...styles.cardValue, color }}>{value}</p>
    </div>
  )
}

const styles = {
  layout:     { display:'flex', minHeight:'100vh', fontFamily:'sans-serif' },
  sidebar:    { width:'220px', background:'#1a1a2e', color:'white', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'0.5rem' },
  logo:       { color:'white', marginBottom:'1.5rem' },
  navLink:    { color:'#a5b4fc', textDecoration:'none', padding:'0.5rem 0', fontSize:'0.95rem' },
  logoutBtn:  { marginTop:'auto', background:'transparent', border:'1px solid #4f46e5', color:'#a5b4fc', padding:'0.5rem', borderRadius:'6px', cursor:'pointer' },
  main:       { flex:1, padding:'2rem', background:'#f8fafc' },
  title:      { marginBottom:'1.5rem', color:'#1a1a2e' },
  grid:       { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'1rem' },
  card:       { background:'white', borderRadius:'8px', padding:'1.25rem', boxShadow:'0 1px 6px rgba(0,0,0,0.08)' },
  cardLabel:  { fontSize:'0.8rem', color:'#64748b', margin:0 },
  cardValue:  { fontSize:'2rem', fontWeight:'bold', margin:'0.5rem 0 0' },
}
