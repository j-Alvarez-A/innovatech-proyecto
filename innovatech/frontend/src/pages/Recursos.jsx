import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function Recursos() {
  const [empleados, setEmpleados] = useState([])
  const [form, setForm] = useState({ nombre: '', email: '', cargo: '', habilidades: '', horasSemana: 40 })
  const [loading, setLoading] = useState(true)

  const fetchEmpleados = () => {
    api.get('/recursos/empleados')
      .then(({ data }) => setEmpleados(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchEmpleados() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    await api.post('/recursos/empleados', {
      ...form,
      habilidades: form.habilidades.split(',').map((h) => h.trim()),
      horasSemana: Number(form.horasSemana),
    })
    setForm({ nombre: '', email: '', cargo: '', habilidades: '', horasSemana: 40 })
    fetchEmpleados()
  }

  const toggleDisponibilidad = async (empleado) => {
    await api.put(`/recursos/empleados/${empleado.id}`, { disponible: !empleado.disponible })
    fetchEmpleados()
  }

  return (
    <div style={styles.layout}>
      <nav style={styles.sidebar}>
        <h2 style={styles.logo}>Innovatech</h2>
        <Link style={styles.navLink} to="/">📊 Dashboard</Link>
        <Link style={styles.navLink} to="/proyectos">📁 Proyectos</Link>
        <Link style={styles.navLink} to="/recursos">👥 Recursos</Link>
      </nav>

      <main style={styles.main}>
        <h1 style={styles.title}>Gestión de Recursos Humanos</h1>

        <form onSubmit={handleCreate} style={styles.form}>
          <input style={styles.input} placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          <input style={styles.input} placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input style={styles.input} placeholder="Cargo" value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} required />
          <input style={styles.input} placeholder="Habilidades (separadas por coma)" value={form.habilidades} onChange={(e) => setForm({ ...form, habilidades: e.target.value })} />
          <input style={styles.input} type="number" placeholder="Hrs/semana" value={form.horasSemana} onChange={(e) => setForm({ ...form, horasSemana: e.target.value })} />
          <button type="submit" style={styles.btn}>+ Agregar Empleado</button>
        </form>

        {loading ? <p>Cargando...</p> : (
          <table style={styles.table}>
            <thead>
              <tr><th>Nombre</th><th>Cargo</th><th>Habilidades</th><th>Hrs/sem</th><th>Disponible</th></tr>
            </thead>
            <tbody>
              {empleados.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.nombre}</td>
                  <td>{emp.cargo}</td>
                  <td>{emp.habilidades?.join(', ')}</td>
                  <td>{emp.horasSemana}</td>
                  <td>
                    <button
                      onClick={() => toggleDisponibilidad(emp)}
                      style={{ ...styles.badge, background: emp.disponible ? '#10b981' : '#ef4444', border:'none', cursor:'pointer', color:'white' }}
                    >
                      {emp.disponible ? '✓ Disponible' : '✗ Asignado'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}

const styles = {
  layout:   { display:'flex', minHeight:'100vh', fontFamily:'sans-serif' },
  sidebar:  { width:'220px', background:'#1a1a2e', color:'white', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'0.5rem' },
  logo:     { color:'white', marginBottom:'1.5rem' },
  navLink:  { color:'#a5b4fc', textDecoration:'none', padding:'0.5rem 0', fontSize:'0.95rem' },
  main:     { flex:1, padding:'2rem', background:'#f8fafc' },
  title:    { marginBottom:'1.5rem', color:'#1a1a2e' },
  form:     { display:'flex', gap:'0.75rem', marginBottom:'2rem', flexWrap:'wrap' },
  input:    { padding:'0.6rem 0.8rem', borderRadius:'6px', border:'1px solid #ddd', fontSize:'0.9rem' },
  btn:      { padding:'0.6rem 1.2rem', background:'#4f46e5', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
  table:    { width:'100%', borderCollapse:'collapse', background:'white', borderRadius:'8px', overflow:'hidden', boxShadow:'0 1px 6px rgba(0,0,0,0.08)' },
  badge:    { padding:'4px 10px', borderRadius:'99px', fontSize:'0.8rem' },
}
