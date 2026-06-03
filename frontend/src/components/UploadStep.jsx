import { useState, useRef } from 'react'

export default function UploadStep({ onNext }) {
  const [preview, setPreview] = useState(null)
  const [base64, setBase64] = useState(null)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)
  const cameraInputRef = useRef(null)
  const fileInputRef = useRef(null)

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
        .upload-option-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 18px 12px;
          border-radius: 14px;
          border: 2px solid #3d2e1a;
          background: #1f1509;
          color: #b8a98a;
          cursor: pointer;
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }
        .upload-option-btn:hover {
          border-color: #c8922a;
          background: #2a1e0e;
          color: #c8922a;
        }
        .upload-option-btn .icon {
          font-size: 2rem;
        }
      `}</style>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', animation: 'fadeIn 0.6s ease' }}>
        <div style={{ fontSize: '4rem', animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>✂️</div>
        <h2 style={{ fontSize: '1.4rem', marginTop: 8 }}>Bem-vindo ao Furnando</h2>
        <p style={{ color: '#7a6a52', fontSize: '0.88rem', marginTop: 4 }}>
          O teu barbeiro virtual — tira uma foto e descobre o corte ideal para o teu rosto
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
        <h2 style={{ marginBottom: 4 }}>📸 Adiciona a tua foto</h2>
        <p style={{ marginBottom: '1.2rem', fontSize: '0.86rem' }}>
          Usa uma foto de frente, com boa iluminação e rosto bem visível.
        </p>

        {/* Inputs ocultos */}
        {/* Câmara — abre diretamente a câmara frontal */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />
        {/* Ficheiro — abre o explorador de ficheiros */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />

        {/* Preview da foto */}
        {preview && (
          <div style={{
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: '1rem',
            border: '2px solid #c8922a88',
            position: 'relative'
          }}>
            <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 260, objectFit: 'cover', display: 'block' }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(transparent, #1a1008cc)',
              padding: '20px 12px 10px',
              fontSize: '0.82rem', color: '#c8922a', fontWeight: 600
            }}>
              ✅ Foto carregada — escolhe outra abaixo se quiseres trocar
            </div>
          </div>
        )}

        {/* Drag & Drop zone (quando não há preview) */}
        {!preview && (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
            style={{
              border: `2px dashed ${dragging ? '#c8922a' : '#3d2e1a'}`,
              borderRadius: 12,
              padding: '2rem 1rem',
              textAlign: 'center',
              background: dragging ? '#2a1e0e' : '#1a1008',
              marginBottom: '1rem',
              transition: 'all 0.2s',
            }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 6 }}>🖼️</div>
            <p style={{ color: '#7a6a52', fontSize: '0.82rem' }}>Ou arrasta uma foto aqui</p>
          </div>
        )}

        {/* Botões de escolha */}
        <div style={{ display: 'flex', gap: 10, marginBottom: '0.5rem' }}>
          <button
            className="upload-option-btn"
            onClick={() => cameraInputRef.current?.click()}
          >
            <span className="icon">📷</span>
            Tirar foto
          </button>
          <button
            className="upload-option-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="icon">🗂️</span>
            {preview ? 'Trocar ficheiro' : 'Escolher ficheiro'}
          </button>
        </div>

        {error && <div className="error" style={{ marginTop: 10 }}>{error}</div>}

        <button
          className="btn btn-primary"
          disabled={!base64}
          onClick={() => onNext(base64)}
          style={{ width: '100%', marginTop: '1rem', padding: '12px', fontSize: '1rem' }}>
          {base64 ? '✂️ Continuar para preferências →' : '📸 Adiciona uma foto para continuar'}
        </button>
      </div>
    </div>
  )
}