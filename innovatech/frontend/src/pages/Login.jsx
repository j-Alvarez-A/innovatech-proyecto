import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('rol', data.rol)
      navigate('/')
    } catch {
      setError('Email o contraseña incorrectos')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Innovatech Solutions</h1>
        <p style={styles.subtitle}>Plataforma de Gestión</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={styles.button}>Ingresar</button>
        </form>
        <p style={styles.hint}>
          Demo: admin@innovatech.com / admin123
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f0f2f5' },
  card:      { background:'white', padding:'2rem', borderRadius:'8px', boxShadow:'0 2px 16px rgba(0,0,0,0.1)', width:'360px' },
  title:     { margin:0, fontSize:'1.5rem', color:'#1a1a2e' },
  subtitle:  { color:'#666', marginBottom:'1.5rem' },
  form:      { display:'flex', flexDirection:'column', gap:'0.75rem' },
  input:     { padding:'0.75rem', borderRadius:'6px', border:'1px solid #ddd', fontSize:'1rem' },
  button:    { padding:'0.75rem', background:'#4f46e5', color:'white', border:'none', borderRadius:'6px', fontSize:'1rem', cursor:'pointer' },
  error:     { color:'#e53e3e', marginBottom:'0.5rem' },
  hint:      { fontSize:'0.8rem', color:'#999', marginTop:'1rem', textAlign:'center' },
}
