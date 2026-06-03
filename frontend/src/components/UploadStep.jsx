import { useState } from 'react'

export default function UploadStep({ onNext }) {
  const [preview, setPreview] = useState(null)
  const [base64, setBase64] = useState(null)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Por favor escolhe um ficheiro de imagem (JPG, PNG, etc.)')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      setBase64(e.target.result.split(',')[1])
      setError(null)
    }
    reader.onerror = () => setError('Erro ao ler o ficheiro.')
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', animation: 'fadeIn 0.6s ease' }}>
        <div style={{ fontSize: '4rem', animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>✂️</div>
        <h2 style={{ fontSize: '1.4rem', marginTop: 8 }}>Bem-vindo ao Furnando</h2>
        <p style={{ color: '#7a6a52', fontSize: '0.88rem', marginTop: 4 }}>
          O teu barbeiro virtual — carrega uma foto e descobre o corte ideal para o teu rosto
        </p>
      </div>

      {/* Passos */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: '1.5rem' }}>
        {[
          { icon: '📸', txt: 'Foto' },
          { icon: '💬', txt: 'Preferências' },
          { icon: '✂️', txt: 'Cortes' }
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center', flex: 1, padding: '10px 6px', background: '#1f1509', borderRadius: 10, border: '1px solid #3d2e1a' }}>
            <div style={{ fontSize: '1.4rem' }}>{s.icon}</div>
            <div style={{ fontSize: '0.72rem', color: '#7a6a52', marginTop: 4, letterSpacing: 0.5 }}>{s.txt}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ marginBottom: 4 }}>📸 Carrega a tua foto</h2>
        <p style={{ marginBottom: '1rem', fontSize: '0.86rem' }}>
          Usa uma foto de frente, com boa iluminação e rosto bem visível.
        </p>

        {/* Zona de upload */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
          style={{
            border: `2px dashed ${dragging ? '#c8922a' : preview ? '#c8922a88' : '#3d2e1a'}`,
            borderRadius: 12,
            padding: preview ? '0' : '2.5rem 1rem',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.2s',
            background: dragging ? '#2a1e0e' : '#1f1509',
            overflow: 'hidden'
          }}>
          <input
            type="file"
            accept="image/*"
            onChange={e => handleFile(e.target.files[0])}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
          />

          {preview ? (
            <div style={{ position: 'relative' }}>
              <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 260, objectFit: 'cover', display: 'block' }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, #1a1008cc)',
                padding: '20px 12px 10px',
                fontSize: '0.82rem', color: '#c8922a', fontWeight: 600
              }}>
                ✅ Foto carregada — clica para trocar
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '3rem', marginBottom: 10 }}>📷</div>
              <p style={{ color: '#b8a98a', fontWeight: 500 }}>Clica ou arrasta a foto aqui</p>
              <p style={{ fontSize: '0.8rem', color: '#7a6a52', marginTop: 4 }}>JPG, PNG ou WEBP</p>
              <div style={{
                marginTop: 16, display: 'inline-block',
                padding: '6px 16px', borderRadius: 20,
                background: 'linear-gradient(90deg, #3d2e1a, #c8922a44, #3d2e1a)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s linear infinite',
                fontSize: '0.78rem', color: '#c8922a', border: '1px solid #c8922a44'
              }}>
                💈 Furnando está pronto para te ajudar
              </div>
            </>
          )}
        </div>

        {error && <div className="error" style={{ marginTop: 10 }}>{error}</div>}

        <button
          className="btn btn-primary"
          disabled={!base64}
          onClick={() => onNext(base64)}
          style={{ width: '100%', marginTop: '1rem', padding: '12px', fontSize: '1rem' }}>
          {base64 ? '✂️ Continuar para preferências →' : '📸 Escolhe uma foto para continuar'}
        </button>
      </div>
    </div>
  )
}