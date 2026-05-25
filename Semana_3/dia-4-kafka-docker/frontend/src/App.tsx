import React, { useState, useEffect } from 'react';

const API_URL = '';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('Esperando Registro');
  const [statusColor, setStatusColor] = useState('#64748b'); // Slate gray for idle
  const [isProcessing, setIsProcessing] = useState(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  // Dynamically load Google Font "Outfit" for high-end look
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const registrarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !email || !password) {
      setStatus('Por favor completa todos los campos.');
      setStatusColor('#ef4444'); // Red for error
      return;
    }

    try {
      setIsProcessing(true);
      setStatus('Procesando');
      setStatusColor('#38bdf8'); // Sky blue for processing

      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();

      if (intervalId) clearInterval(intervalId);

      const poll = window.setInterval(async () => {
        try {
          const resStatus = await fetch(`${API_URL}/api/status/${data.id}`);
          const statusData = await resStatus.json();

          setStatus(statusData.status);

          if (statusData.status === 'Usuario Creado Exitosamente') {
            setStatusColor('#10b981'); // Emerald green for success
            setIsProcessing(false);
            clearInterval(poll);
          } else if (statusData.status === 'ERROR_TIMEOUT' || statusData.status === 'ERROR_PUBLICACION') {
            setStatusColor('#ef4444');
            setIsProcessing(false);
            clearInterval(poll);
          } else {
            setStatusColor('#38bdf8'); // Keep processing blue
          }
        } catch {
          setStatus('Error consultando estado.');
          setStatusColor('#ef4444');
          setIsProcessing(false);
          clearInterval(poll);
        }
      }, 800);

      setIntervalId(poll);
    } catch {
      setStatus('Error al enviar registro.');
      setStatusColor('#ef4444');
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      background: 'radial-gradient(circle at top, #1e293b, #0f172a, #020617)',
      color: '#f8fafc',
      minHeight: '100vh',
      fontFamily: '"Outfit", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background glowing blobs */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: '350px',
        height: '350px',
        background: 'rgba(56, 189, 248, 0.15)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '20%',
        width: '350px',
        height: '350px',
        background: 'rgba(16, 185, 129, 0.12)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 700,
        marginBottom: '10px',
        background: 'linear-gradient(to right, #38bdf8, #818cf8, #34d399)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        zIndex: 1,
        letterSpacing: '-0.025em'
      }}>
        Lite Bank
      </h1>
      <p style={{
        color: '#94a3b8',
        fontSize: '1rem',
        marginBottom: '30px',
        zIndex: 1,
        fontWeight: 300
      }}>
        Sistema Inteligente de Creación de Cuentas (Kafka Asíncrono)
      </p>

      <form onSubmit={registrarUsuario} style={{
        background: 'rgba(30, 41, 59, 0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '450px',
        zIndex: 1,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          marginBottom: '25px',
          textAlign: 'center',
          color: '#f1f5f9'
        }}>
          Registro de Usuario
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8' }}>Nombre Completo</label>
          <input
            id="nombre"
            type="text"
            placeholder="Juan Pérez"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '0.95rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: '#f8fafc',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8' }}>Correo Electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="juan.perez@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '0.95rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: '#f8fafc',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8' }}>Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '0.95rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: '#f8fafc',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          id="btn-registrar"
          type="submit"
          disabled={isProcessing}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '10px',
            border: 'none',
            background: isProcessing ? '#475569' : 'linear-gradient(135deg, #38bdf8, #818cf8)',
            color: isProcessing ? '#94a3b8' : '#ffffff',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            boxShadow: isProcessing ? 'none' : '0 4px 14px 0 rgba(56, 189, 248, 0.3)',
            transition: 'transform 0.1s, filter 0.2s',
            outline: 'none'
          }}
        >
          {isProcessing ? 'Registrando...' : 'Registrar'}
        </button>

        <div
          id="status-box"
          style={{
            marginTop: '25px',
            padding: '15px',
            borderRadius: '12px',
            fontSize: '1.05rem',
            fontWeight: '600',
            textAlign: 'center',
            color: '#ffffff',
            background: 'rgba(15, 23, 42, 0.4)',
            border: `1.5px solid ${statusColor}`,
            boxShadow: `0 0 10px 0 ${statusColor}33`,
            transition: 'border-color 0.3s, box-shadow 0.3s'
          }}
        >
          {status}
        </div>
      </form>
    </div>
  );
}
