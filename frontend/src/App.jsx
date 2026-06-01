import { useState } from 'react'
import UploadStep from './components/UploadStep'
import QuizStep from './components/QuizStep'
import ResultsStep from './components/ResultsStep'

// Este componente é o "maestro" da app
// Guarda o estado atual (que passo estamos) e passa dados entre componentes
export default function App() {
  // "step" controla qual ecrã está visível: 0=upload, 1=questionário, 2=resultados
  const [step, setStep] = useState(0)

  // A foto em base64 (texto que representa a imagem)
  const [imageBase64, setImageBase64] = useState(null)

  // As respostas do questionário
  const [preferences, setPreferences] = useState({})

  // Os resultados da IA
  const [results, setResults] = useState(null)

  // Estado de loading (a esperar resposta da IA)
  const [loading, setLoading] = useState(false)

  // Função chamada quando o utilizador clica "Analisar"
  const handleAnalyze = async (prefs) => {
    setPreferences(prefs)
    setLoading(true)
    setStep(2)

    try {
      // Faz o pedido ao backend Spring Boot
      // Como temos o proxy no vite.config.js, /api/analyze vai para localhost:8080/api/analyze
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, preferences: prefs })
      })

      if (!response.ok) {
        throw new Error('Erro do servidor: ' + response.status)
      }

      const text = await response.text()

      // Remove eventuais ```json ``` que a IA possa ter incluído
      const clean = text.replace(/```json|```/g, '').trim()
      const data = JSON.parse(clean)
      setResults(data)

    } catch (err) {
      console.error('Erro:', err)
      setResults({ error: 'Não foi possível analisar. Tenta novamente.' })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep(0)
    setImageBase64(null)
    setPreferences({})
    setResults(null)
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>✂️ Haircut Advisor</h1>
        <p>Descobre o corte de cabelo ideal para o teu rosto</p>
      </div>

      {/* Indicador de passo */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', alignItems: 'center' }}>
        {['Foto', 'Preferências', 'Resultado'].map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: i === step ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i <= step ? '#1a1a1a' : '#ddd',
              transition: 'all 0.3s'
            }} />
            {i === step && (
              <span style={{ fontSize: '0.8rem', color: '#555' }}>{label}</span>
            )}
          </div>
        ))}
      </div>

      {/* Ecrã 0: Upload da foto */}
      {step === 0 && (
        <UploadStep
          onNext={(img) => { setImageBase64(img); setStep(1) }}
        />
      )}

      {/* Ecrã 1: Questionário */}
      {step === 1 && (
        <QuizStep
          onBack={() => setStep(0)}
          onAnalyze={handleAnalyze}
        />
      )}

      {/* Ecrã 2: Resultados (ou loading) */}
      {step === 2 && (
        <ResultsStep
          loading={loading}
          results={results}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
