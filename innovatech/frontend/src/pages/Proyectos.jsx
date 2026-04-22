import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const ESTADOS = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO']

export default function Proyectos() {
  const [proyectos, setProyectos] = useState([])
  const [form, setForm]           = useState({ nombre: '', descripcion: '', estado: 'EN_PROCESO' })
  const [loading, setLoading]     = useState(true)

  const fetchProyectos = () => {
    api.get('/proyectos/proyectos')
      .then(({ data }) => setProyectos(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProyectos() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    await api.post('/proyectos/proyectos', form)
    setForm({ nombre: '', descripcion: '', estado: 'EN_PROCESO' })
    fetchProyectos()
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar proyecto?')) return
    await api.delete(`/proyectos/proyectos/${id}`)
    fetchProyectos()
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
        <h1 style={styles.title}>Gestión de Proyectos</h1>

        {/* Formulario nuevo proyecto */}
        <form onSubmit={handleCreate} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Nombre del proyecto"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <input
            style={styles.input}
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
          <select
            style={styles.input}
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
          >
            {ESTADOS.map((e) => <option key={e}>{e}</option>)}
          </select>
          <button type="submit" style={styles.btn}>+ Crear Proyecto</button>
        </form>

        {/* Lista de proyectos */}
        {loading ? <p>Cargando...</p> : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th><th>Nombre</th><th>Estado</th><th>Tareas</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td><span style={{ ...styles.badge, background: badgeColor(p.estado) }}>{p.estado}</span></td>
                  <td>{p.tareas?.length ?? 0} tareas</td>
                  <td>
                    <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>Eliminar</button>
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

const badgeColor = (estado) => ({
  PENDIENTE: '#f59e0b', EN_PROCESO: '#3b82f6', COMPLETADO: '#10b981', CANCELADO: '#ef4444'
}[estado] || '#ccc')

const styles = {
  layout:    { display:'flex', minHeight:'100vh', fontFamily:'sans-serif' },
  sidebar:   { width:'220px', background:'#1a1a2e', color:'white', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'0.5rem' },
  logo:      { color:'white', marginBottom:'1.5rem' },
  navLink:   { color:'#a5b4fc', textDecoration:'none', padding:'0.5rem 0', fontSize:'0.95rem' },
  main:      { flex:1, padding:'2rem', background:'#f8fafc' },
  title:     { marginBottom:'1.5rem', color:'#1a1a2e' },
  form:      { display:'flex', gap:'0.75rem', marginBottom:'2rem', flexWrap:'wrap' },
  input:     { padding:'0.6rem 0.8rem', borderRadius:'6px', border:'1px solid #ddd', fontSize:'0.9rem' },
  btn:       { padding:'0.6rem 1.2rem', background:'#4f46e5', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
  table:     { width:'100%', borderCollapse:'collapse', background:'white', borderRadius:'8px', overflow:'hidden', boxShadow:'0 1px 6px rgba(0,0,0,0.08)' },
  badge:     { color:'white', padding:'2px 8px', borderRadius:'99px', fontSize:'0.75rem' },
  deleteBtn: { background:'#fee2e2', color:'#ef4444', border:'none', padding:'4px 10px', borderRadius:'4px', cursor:'pointer' },
}
