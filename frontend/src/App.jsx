import { useState } from 'react'
import UploadStep from './components/UploadStep'
import QuizStep from './components/QuizStep'
import ResultsStep from './components/ResultsStep'

function BarberPole() {
  return (
    <div style={{
      width: 28, height: 80, borderRadius: 14,
      border: '2px solid #888', overflow: 'hidden',
      position: 'relative', flexShrink: 0,
      boxShadow: '0 0 8px #0006'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(45deg, #e63946 0px, #e63946 10px, #fff 10px, #fff 20px, #1d3557 20px, #1d3557 30px)',
        backgroundSize: '42px 42px',
        animation: 'scroll 1.2s linear infinite'
      }} />
      <style>{`@keyframes scroll { from { background-position: 0 0; } to { background-position: 42px 42px; } }`}</style>
    </div>
  )
}

export default function App() {
  const [step, setStep] = useState(0)
  const [imageBase64, setImageBase64] = useState(null)
  const [preferences, setPreferences] = useState({})
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async (prefs) => {
    setPreferences(prefs)
    setLoading(true)
    setStep(2)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, preferences: prefs })
      })
      if (!response.ok) throw new Error('Erro do servidor: ' + response.status)
      const text = await response.text()
      const clean = text.replace(/```json|```/g, '').trim()
      setResults(JSON.parse(clean))
    } catch (err) {
      setResults({ error: 'Não foi possível analisar. Tenta novamente.' })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep(0); setImageBase64(null); setPreferences({}); setResults(null)
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid #3d2e1a', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <BarberPole />
          <div>
            <h1>Furnando</h1>
            <p style={{ fontSize: '0.78rem', color: '#7a6a52', letterSpacing: 3, textTransform: 'uppercase' }}>
              ✂️ O teu barbeiro virtual 💈
            </p>
          </div>
          <BarberPole />
        </div>

        {/* Faixa decorativa */}
        <div style={{
          marginTop: 12,
          height: 4, borderRadius: 2,
          background: 'repeating-linear-gradient(90deg, #e63946 0px, #e63946 20px, #fff 20px, #fff 40px, #1d3557 40px, #1d3557 60px)',
          opacity: 0.6
        }} />
      </div>

      {/* Indicador de passo */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', alignItems: 'center' }}>
        {['Foto', 'Preferências', 'Resultado'].map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: i === step ? 28 : 8, height: 8, borderRadius: 4,
              background: i <= step ? '#c8922a' : '#3d2e1a',
              transition: 'all 0.3s'
            }} />
            {i === step && (
              <span style={{ fontSize: '0.75rem', color: '#c8922a', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
                {label}
              </span>
            )}
          </div>
        ))}
      </div>

      {step === 0 && <UploadStep onNext={(img) => { setImageBase64(img); setStep(1) }} />}
      {step === 1 && <QuizStep onBack={() => setStep(0)} onAnalyze={handleAnalyze} />}
      {step === 2 && <ResultsStep loading={loading} results={results} onReset={handleReset} />}

      {/* Rodapé */}
      <div style={{ marginTop: '2rem', textAlign: 'center', color: '#3d2e1a', fontSize: '0.78rem' }}>
        💈 Furnando Barbershop © 2026
      </div>
    </div>
  )
}