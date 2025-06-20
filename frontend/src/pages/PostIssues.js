import React, {useState, useContext, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AccountContext } from '../components/Account'
import axios from 'axios'

export default function PostIssues() {
  const [hasLanguageOption, setHasLanguageOption] = useState(true)
  const { getCurrentUserId } = useContext(AccountContext)
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  // get user id
  useEffect(() => {
    const getUserID = async() => {
      try{
        const userID = await getCurrentUserId()
        setUserId(userID)

        const userResponse = await axios.get(`/api/userByID/${userID}`)
        setUsername(userResponse.data[0].username)

        setFormData((prevFormData) => {
          return{
            ...prevFormData,
            userID: userID,
            username: userResponse.data[0].username
          }
        })
      }catch(err){
        console.log(err)
      }
    }
    getUserID()
  },[getCurrentUserId])

  // form data
  const [formData, setFormData] = useState({
    userID:userId,
    username:username,
    issuesURL: '', 
    title: '', 
    description: '', 
    language: '', 
    customLanguage: '', 
    difficulty: '', 
    isUrgent: false,
    time:''
  })

  const handleSubmit = async(e) => {
    e.preventDefault()
    
    try{
      // add issues
      const response = await axios.post('/api/issuecreate', { 
        userID:formData.userID,
        username:formData.username,
        issueURL:formData.issuesURL,
        title: formData.title,
        description: formData.description,
        language: formData.language,
        customLanguage: formData.customLanguage,
        difficulty: formData.difficulty,
        isUrgent: formData.isUrgent,
        time:formData.time
      })

      // update user's issuesposted field
      const issueID = response.data._id
      await axios.put(`/api/userpostadd/${userId}`,{
        userID: userId,
        issueID: issueID 
      })
      navigate('/issues')
    }catch(err){
      alert(`Error creating issue: ${err.response?.data?.message || err.message}`);
    }
  }

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target

    setFormData((prevFormData) => {
      return{
        ...prevFormData,
        [name]: type === 'checkbox'? checked : value,
        time: Date.now()
      }
    })

    if(name === 'language'){
      if(value === 'Others'){
        setHasLanguageOption(false)
      }else{
        setHasLanguageOption(true)
      }
    }
  }

  return (
    <div className="post-issue-container">
      <form onSubmit={handleSubmit} className='post-issue-form'>
      {userId? 
        <>
          <label>Issue URL *</label>
          <input 
            type='text'
            name='issuesURL'
            value={formData.issuesURL}
            onChange={handleChange}
            className='post-issue-input'
            required
          />

          <label>Title *</label>
          <input 
            type='text'
            name='title'
            value={formData.title}
            onChange={handleChange}
            className='post-issue-input'
            required
          />

          <label>Description</label>
          <textarea 
            type='text'
            name='description'
            value={formData.description}
            onChange={handleChange}
            className='post-issue-textarea'
          />  

          <div className='post-issue-tags-container'>
            <div className='post-issue-lan-dif-tags'>
              <label>Language *</label>
              <select 
                name='language'
                value={formData.language}
                onChange={handleChange}
                required
                className='post-issue-select'
              > 
                <option value=''>-- Choose --</option>
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

              <label>Difficulty *</label>
              <select 
                name='difficulty'
                value={formData.difficulty}
                onChange={handleChange}
                required
                className='post-issue-select'
              >
                <option value=''>-- Choose --</option>
                <option value='Easy'>Easy</option>
                <option value='Medium'>Medium</option>
                <option value='Hard'>Hard</option>
                <option value='Unknown'>Unknown</option>
              </select>
            </div>
            
            <div className='post-issue-urgent-tag'>
              <label htmlFor='isUrgent' id='isUrgent'></label>
              <input 
                id='isUrgent'
                name='isUrgent'
                type='checkbox'
                checked={formData.isUrgent}
                onChange={handleChange}
              />Urgent
            </div>
          </div>

          {hasLanguageOption? '':
              <div className='post-issue-tags-container'>
                <label>Oops, what language you need help with?</label>
                <input 
                  type='text'
                  name='customLanguage'
                  value={formData.customLanguage}
                  onChange={handleChange}
                  className='post-issue-input'
                  required
                />
              </div>
            }
          <button className='post-issue-btn'>Submit</button>
        </> : 
        <h1>
        Please <Link to='/signin'>Sign In</Link>  to Add Issues
        </h1>
        }
      </form>
    </div>
  )
}
