import { useState } from 'react'

const QUESTIONS = [
  { id: 'comprimento', label: '📏 Comprimento', icon: '📏', options: ['Muito curto', 'Curto', 'Médio', 'Comprido', 'Tanto faz'] },
  { id: 'franja', label: '💇 Franja?', icon: '💇', options: ['Sim, quero franja', 'Não, sem franja', 'Aberta (à lateral)', 'Indiferente'] },
  { id: 'estilo', label: '🎨 Estilo', icon: '🎨', options: ['Casual / descontraído', 'Formal / profissional', 'Moderno / trendy', 'Clássico'] },
  { id: 'manutencao', label: '🔧 Manutenção', icon: '🔧', options: ['Mínima (low-maintenance)', 'Moderada', 'Sem problema'] },
  { id: 'tipo', label: '🌀 Tipo de cabelo', icon: '🌀', options: ['Liso', 'Ondulado', 'Encaracolado', 'Frisado'] }
]

export default function QuizStep({ onBack, onAnalyze }) {
  const [answers, setAnswers] = useState({})
  const answered = Object.keys(answers).length
  const total = QUESTIONS.length
  const progress = (answered / total) * 100

  return (
    <div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>

      <div className="card" style={{ marginBottom: 12, background: 'linear-gradient(135deg, #2a1e0e, #1a1008)', border: '1px solid #c8922a44', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>💬 As tuas preferências</h2>
          <span style={{ fontSize: '0.8rem', color: '#c8922a', fontWeight: 700 }}>{answered}/{total}</span>
        </div>
        <p style={{ marginBottom: 10, fontSize: '0.86rem' }}>Quanto mais responderes, melhor o Furnando te conhece!</p>

        {/* Barra de progresso */}
        <div style={{ background: '#3d2e1a', borderRadius: 4, height: 6, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            background: 'linear-gradient(90deg, #c8922a, #f0b84a)',
            width: `${progress}%`,
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {QUESTIONS.map((q, qi) => (
        <div key={q.id} className="card" style={{ marginBottom: 10, animation: `fadeIn 0.4s ease ${qi * 0.08}s both` }}>
          <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#c8922a', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
            {q.label}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {q.options.map(opt => (
              <button
                key={opt}
                onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                style={{
                  border: `1px solid ${answers[q.id] === opt ? '#c8922a' : '#3d2e1a'}`,
                  borderRadius: 20, padding: '6px 14px',
                  fontSize: '0.84rem', cursor: 'pointer',
                  color: answers[q.id] === opt ? '#1a1008' : '#7a6a52',
                  background: answers[q.id] === opt ? '#c8922a' : 'transparent',
                  fontWeight: answers[q.id] === opt ? 700 : 400,
                  transition: 'all 0.15s',
                  transform: answers[q.id] === opt ? 'scale(1.05)' : 'scale(1)'
                }}>
                {answers[q.id] === opt ? '✓ ' : ''}{opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button className="btn btn-secondary" onClick={onBack}>← Voltar</button>
        <button
          className="btn btn-primary"
          onClick={() => onAnalyze(answers)}
          style={{ flex: 1, padding: '12px', fontSize: '1rem' }}>
          {answered === total ? '✂️ Analisar agora!' : `✨ Analisar (${answered}/${total} respondidas)`}
        </button>
      </div>
    </div>
  )
}