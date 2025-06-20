import React, {useState, useEffect} from 'react'

export default function FilterPanel({onSelectionsChange, onSubmit, onReset, filterSelections}) {
  const [language, setLanguage] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [formData, setFormData] = useState(filterSelections)

  useEffect(() => {
    setFormData(filterSelections)
  }, [filterSelections])

  const updateFilterChange = (e) => {
    const {name, value, type, checked} = e.target

    setFormData((prevFormData) => {
      return{
        ...prevFormData,
        [name]: type === 'checkbox'? checked : value
      }
    })
  }

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value
    setLanguage(newLanguage)
    onSelectionsChange({language: newLanguage, difficulty, isUrgent})

    updateFilterChange(e)
  }

  const handleDifficultyChange = (e) => {
    const newDifficulty = e.target.value
    setDifficulty(newDifficulty)
    onSelectionsChange({language, difficulty: newDifficulty, isUrgent})

    updateFilterChange(e)
  }

  const handleIsUrgentChange = (e) => {
    const newIsUrgent = e.target.checked;
    console.log(newIsUrgent)
    setIsUrgent(newIsUrgent)
    onSelectionsChange({ language, difficulty, isUrgent: newIsUrgent });
  }

  return (
    <form className='filter-panel' onSubmit={onSubmit}>
      <h3>Select One or Multiple</h3>

      <div className='filterpanel-lan-dif'>
        <select 
          name='language'
          value={formData.language}
          onChange={handleLanguageChange}
        >
          <option value=''>-- Language --</option>
          <option value='Others'>Others</option>
          <option value='C'>C</option>
          <option value='C++'>C++</option>
          <option value='C#'>C#</option>
          <option value='CSS'>CSS</option>
          <option value='Go'>Go</option>
          <option value='HTML'>HTML</option>
          <option value='Java'>Java</option>
          <option value='Javascript'>Javascript</option>
          <option value='Kotlin'>Kotlin</option>
          <option value='Matlab'>Matlab</option>
          <option value='NoSQL'>NoSQL</option>
          <option value='Perl'>Perl</option>
          <option value='PHP'>PHP</option>
          <option value='Python'>Python</option>
          <option value='R'>R</option>
          <option value='Ruby'>Ruby</option>
          <option value='Rust'>Rust</option>
          <option value='Scala'>Scala</option>
          <option value='SQL'>SQL</option>
          <option value='Swift'>Swift</option>
          <option value='TypeScript'>TypeScript</option>
        </select>

        <select 
          name='difficulty'
          value={formData.difficulty}
          onChange={handleDifficultyChange}
        >
          <option value=''>-- Difficulty --</option>
          <option value='Easy'>Easy</option>
          <option value='Medium'>Medium</option>
          <option value='Hard'>Hard</option>
          <option value='Unknown'>Unknown</option>
        </select>
      </div>

      <div className='filter-pane-urgent'>
        <label htmlFor='isUrgent'>Is it urgent?</label>
        <input 
          id='isUrgent'
          name='isUrgent'
          type='checkbox'
          checked={formData.isUrgent}
          onChange={handleIsUrgentChange}
        />
        <p>Yes</p>
      </div>

      <div className='filterpanel-submit-reset'>
        <button className='filterpanel-reset' onClick={onReset}>Reset</button>
        <button className='filterpanel-submit'>Submit</button>
      </div>
    </form>
  )
}
