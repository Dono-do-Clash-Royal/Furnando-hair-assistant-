import { useState, useEffect } from 'react'

function HaircutCard({ corte, rank, visible }) {
  const [images, setImages] = useState([])

  useEffect(() => {
    // Duas queries diferentes para garantir 2 fotos variadas do mesmo corte
    const base = corte.nome // ex: "Buzz Cut", "Crew Cut"
    const q1 = encodeURIComponent(base + ' haircut')
    const q2 = encodeURIComponent(base + ' hairstyle men')

    const fetchOne = (query, page) =>
      fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=10&page=${page}&client_id=rJlkAMV2LCJSog3gKUZyWYLBRo_6oEeASfm1KOvwbzc`)
        .then(r => r.json())
        .then(data => {
          if (!data.results?.length) return null
          const shuffled = [...data.results].sort(() => Math.random() - 0.5)
          return shuffled[0].urls.small
        })
        .catch(() => null)

    Promise.all([fetchOne(q1, 1), fetchOne(q2, 2)])
      .then(urls => {
        const valid = urls.filter(Boolean)
        if (valid.length) setImages(valid)
      })
  }, [corte.nome])

  const ranks = ['🥇 Melhor escolha', '2.ª opção', '3.ª opção']
  const isFirst = rank === 0
  const colors = ['#c8922a', '#8a7a6a', '#6a8a7a']

  return (
    <div style={{
      border: `1px solid ${isFirst ? '#c8922a' : '#3d2e1a'}`,
      borderLeft: `4px solid ${colors[rank]}`,
      borderRadius: 12,
      padding: '1.2rem',
      marginBottom: 12,
      background: isFirst ? '#2a1e0e' : '#1f1509',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: `all 0.5s ease ${rank * 0.15}s`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {isFirst && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          background: '#c8922a', color: '#1a1008',
          fontSize: '0.7rem', fontWeight: 700,
          padding: '3px 12px', borderBottomLeftRadius: 8,
          letterSpacing: 1, textTransform: 'uppercase'
        }}>TOP PICK</div>
      )}
      <div style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 4, color: colors[rank], letterSpacing: 1, textTransform: 'uppercase' }}>
        {ranks[rank]}
      </div>
      <h3 style={{ marginBottom: 6, fontSize: '1.1rem' }}>{corte.nome}</h3>
      <p style={{ fontSize: '0.86rem', color: '#b8a98a', lineHeight: 1.6, marginBottom: 10 }}>{corte.porque}</p>

      {images.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {images.map((url, i) => (
            <div key={i} style={{ width: '48%', borderRadius: 10, overflow: 'hidden', height: 130, background: '#3d2e1a' }}>
              <img src={url} alt={corte.nome}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            </div>
          ))}
        </div>
      )}
      {images.length === 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {[0, 1].map(i => (
            <div key={i} style={{ width: '48%', height: 130, borderRadius: 10, background: '#2a1e0e', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {corte.tags?.map(tag => (
          <span key={tag} style={{ fontSize: '0.75rem', background: '#2e1f0a', borderRadius: 20, padding: '3px 10px', color: '#7a6a52', border: '1px solid #3d2e1a' }}>{tag}</span>
        ))}
        <span style={{ fontSize: '0.75rem', background: '#c8922a22', borderRadius: 20, padding: '3px 10px', color: '#c8922a', border: '1px solid #c8922a44' }}>{corte.dificuldade}</span>
      </div>
    </div>
  )
}

export default function ResultsStep({ loading, results, onReset }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (results && !results.error) setTimeout(() => setVisible(true), 100)
  }, [results])

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
          @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        `}</style>
        <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite', display: 'inline-block', marginBottom: 12 }}>💈</div>
        <h2 style={{ marginBottom: 8 }}>Furnando está a trabalhar...</h2>
        <p>A analisar o teu rosto e a escolher os melhores cortes</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          {['Formato do rosto...', 'Analisando...', 'Preparando cortes...'].map((txt, i) => (
            <div key={i} style={{ fontSize: '0.75rem', color: '#7a6a52', padding: '4px 10px', border: '1px solid #3d2e1a', borderRadius: 20, animation: `pulse 1.5s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}>{txt}</div>
          ))}
        </div>
      </div>
    )
  }

  if (results?.error) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '1rem', fontSize: '3rem' }}>😬</div>
        <div className="error">{results.error}</div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={onReset}>← Tentar novamente</button>
        </div>
      </div>
    )
  }

  if (!results) return null

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
      `}</style>

      <div className="card" style={{ marginBottom: 12, background: 'linear-gradient(135deg, #2a1e0e, #1a1008)', border: '1px solid #c8922a44' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>✂️ As tuas sugestões</h2>
          <span style={{ fontSize: '1.5rem' }}>💈</span>
        </div>
        <p style={{ marginBottom: 12 }}>Furnando analisou o teu rosto e escolheu os cortes ideais.</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1f1509', borderRadius: 10, padding: '10px 14px', border: '1px solid #c8922a44' }}>
          <span style={{ fontSize: '1.5rem' }}>🧠</span>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#c8922a', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Formato do rosto detectado</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f5f0e8', textTransform: 'capitalize' }}>{results.formato_rosto}</div>
            <div style={{ fontSize: '0.82rem', color: '#b8a98a', marginTop: 2 }}>{results.descricao_formato}</div>
          </div>
        </div>
      </div>

      {results.cortes?.map((corte, i) => (
        <HaircutCard key={i} corte={corte} rank={i} visible={visible} />
      ))}

      <div style={{ background: '#2a1e0e', borderRadius: 12, padding: '14px 16px', border: '1px solid #3d2e1a', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.3rem' }}>💡</span>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#c8922a', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Dica do Furnando</div>
            <p style={{ fontSize: '0.88rem' }}>{results.dica_geral}</p>
          </div>
        </div>
      </div>

      <button className="btn btn-secondary" onClick={onReset} style={{ width: '100%', marginTop: 4 }}>
        💈 Analisar outra foto
      </button>
    </div>
  )
}