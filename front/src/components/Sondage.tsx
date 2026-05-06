import { useState, type ChangeEvent, type FormEvent } from 'react'
import '../App.css'

type SondageType = {
  question: string
  answers: string[]
  duration: string
  allowMultiple: boolean
  dateCreation: string
  lienPartage: string
}

const durationOptions = [
  { value: '24h', label: '24 heures', minutes: 1440 },
  { value: '48h', label: '48 heures', minutes: 2880 },
  { value: '72h', label: '72 heures', minutes: 4320 }
]

function Sondage() {
  const [sondage, setSondage] = useState<SondageType>({
    question: '',
    answers: ['', ''],
    duration: '24h',
    allowMultiple: false,
    dateCreation: '',
    lienPartage: ''
  })

  const [created, setCreated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setSondage((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAnswerChange = (index: number, value: string) => {
    setSondage((prev) => {
      const answers = [...prev.answers]
      answers[index] = value
      return { ...prev, answers }
    })
  }

  const addAnswer = () => {
    setSondage((prev) => ({ ...prev, answers: [...prev.answers, ''] }))
  }

  const removeAnswer = (index: number) => {
    setSondage((prev) => {
      if (prev.answers.length <= 2) return prev
      const answers = prev.answers.filter((_, i) => i !== index)
      return { ...prev, answers }
    })
  }

  const toggleAllowMultiple = () => {
    setSondage((prev) => ({ ...prev, allowMultiple: !prev.allowMultiple }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Récupérer le token depuis le localStorage
      const token = localStorage.getItem('token')

      // Convertir la durée en minutes
      const durationOption = durationOptions.find(opt => opt.value === sondage.duration)
      if (!durationOption) {
        throw new Error('Durée invalide')
      }

      // Préparer les données pour l'API
      const requestData = {
        titre: sondage.question,
        description: '', // Le back-end attend une description, mais le front n'en a pas
        dureeMinutes: durationOption.minutes,
        multiReponse: sondage.allowMultiple,
        options: sondage.answers.filter(answer => answer.trim() !== '')
      }

      // Vérifier qu'il y a au moins 2 options valides
      if (requestData.options.length < 2) {
        throw new Error('Vous devez fournir au moins 2 réponses')
      }

      // Faire l'appel API
      const response = await fetch('http://10.190.4.90:8081/sondages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || `Erreur HTTP: ${response.status}`)
      }

      const result = await response.json()

      // Mettre à jour l'état avec les données du back-end
      setSondage((prev) => ({
        ...prev,
        dateCreation: new Date().toISOString().slice(0, 10),
        lienPartage: `http://10.190.4.90:8081/sondages/${result.lienPartage}`
      }))

      setCreated(true)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="create-sondage-page">
      <section className="form-card survey-modal">
        <header className="modal-header">
          <h1>Crée un sondage</h1>
        </header>

        <form onSubmit={handleSubmit} className="survey-form">
          <div className="field-group">
            <label htmlFor="question">Question</label>
            <textarea
              id="question"
              name="question"
              value={sondage.question}
              onChange={handleChange}
              placeholder="Quelle question veux-tu poser ?"
              rows={3}
              maxLength={300}
              required
            />
            <div className="field-note">{sondage.question.length} / 300</div>
          </div>

          <div className="field-group">
            <div className="field-title">Réponses</div>
            {sondage.answers.map((answer, index) => (
              <div className="answer-row" key={index}>
                <input
                  type="text"
                  value={answer}
                  onChange={(event) => handleAnswerChange(index, event.target.value)}
                  placeholder="Entre ta réponse"
                  required
                />
                <button
                  type="button"
                  className="answer-remove"
                  onClick={() => removeAnswer(index)}
                  aria-label="Supprimer la réponse"
                >
                  🗑
                </button>
              </div>
            ))}
            <button type="button" className="secondary-button" onClick={addAnswer}>
              + Ajouter une autre réponse
            </button>
          </div>

          <div className="field-group grid-two">
            <div>
              <label htmlFor="duration">Durée</label>
              <select
                id="duration"
                name="duration"
                value={sondage.duration}
                onChange={handleChange}
              >
                {durationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="checkbox-field">
              <label>
                <input
                  type="checkbox"
                  checked={sondage.allowMultiple}
                  onChange={toggleAllowMultiple}
                />
                Autoriser plusieurs réponses
              </label>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Création en cours...' : 'Post'}
          </button>
        </form>

        {created && (
          <section className="created-summary">
            <p>Sondage créé avec succès !</p>
            <div className="summary-row">
              <span>Date de création :</span>
              <strong>{sondage.dateCreation}</strong>
            </div>
            <div className="summary-row">
              <span>Lien de partage :</span>
              <a href={sondage.lienPartage} target="_blank" rel="noopener noreferrer">
                {sondage.lienPartage}
              </a>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

export default Sondage
