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
  { value: '24h', label: '24 heures' },
  { value: '48h', label: '48 heures' },
  { value: '72h', label: '72 heures' }
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

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const now = new Date()
    const dateCreation = now.toISOString().slice(0, 10)
    const lienPartage = `https://sondage.app/${now.getTime()}`
    const newSondage = {
      ...sondage,
      dateCreation,
      lienPartage
    }

    setSondage(newSondage)
    setCreated(true)

    console.log('Sondage créé :', newSondage)
    alert(`Sondage créé localement.\nLien de partage : ${lienPartage}`)
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

          <button type="submit" className="submit-button">
            Post
          </button>
        </form>

        {created && (
          <section className="created-summary">
            <p>Sondage créé localement.</p>
            <div className="summary-row">
              <span>Date de création :</span>
              <strong>{sondage.dateCreation}</strong>
            </div>
            <div className="summary-row">
              <span>Lien de partage :</span>
              <strong>{sondage.lienPartage}</strong>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

export default Sondage
