import { useState } from 'react'

// Este componente trata do upload da foto
// Quando o utilizador escolhe uma foto, converte-a para base64
// e passa para o componente pai (App.jsx) através da função onNext
export default function UploadStep({ onNext }) {
  const [preview, setPreview] = useState(null)   // URL para mostrar a pré-visualização
  const [base64, setBase64] = useState(null)     // Dados da imagem para enviar à API
  const [error, setError] = useState(null)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Por favor escolhe um ficheiro de imagem (JPG, PNG, etc.)')
      return
    }

    // FileReader lê o ficheiro como base64
    // É uma forma de transformar uma imagem num texto muito longo
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      setPreview(dataUrl)
      // Remove o prefixo "data:image/jpeg;base64," - só queremos os dados
      setBase64(dataUrl.split(',')[1])
      setError(null)
    }
    reader.onerror = () => setError('Erro ao ler o ficheiro. Tenta outro.')
    reader.readAsDataURL(file)
  }

  return (
    <div className="card">
      <h2>Carrega a tua foto</h2>
      <p style={{ marginBottom: '1rem' }}>
        Usa uma foto de frente, com boa iluminação, onde o rosto esteja bem visível.
      </p>

      <div className="upload-zone">
        {/* Input invisível que ativa ao clicar na zona */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <div style={{ fontSize: '2rem' }}>📷</div>
        <p>Clica aqui ou arrasta uma foto</p>
        <p style={{ fontSize: '0.8rem', marginTop: 4 }}>JPG, PNG ou WEBP</p>
      </div>

      {/* Pré-visualização da foto escolhida */}
      {preview && (
        <img
          src={preview}
          alt="Pré-visualização"
          className="preview-img"
          style={{ display: 'block' }}
        />
      )}

      {error && <div className="error">{error}</div>}

      <div className="btn-row">
        <button
          className="btn btn-primary"
          disabled={!base64}
          onClick={() => onNext(base64)}
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
