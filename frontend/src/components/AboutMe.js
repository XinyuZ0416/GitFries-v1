import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function AboutMe(props) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState('Welcome to my GitFries page!')
  const [isContentCreated, setIsContentCreated] = useState(false)

  // fetch existing about me content when the component mounts 
  useEffect(() => {
    const findAboutMe = async () => {
      if (!props.userID) return
      try{
        const response = await axios.get(`/api/aboutme/${props.userID}`)

        if(response.data && response.data.content){
          setContent(response.data.content)
          setIsContentCreated(true)
        }else{
          setContent('Welcome to my GitFries page!')
          setIsContentCreated(false)
        }
      }catch(err){
        console.log(err)
      }
    }
    findAboutMe()

  }, [props.userID])
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsEditing(prevIsEditing => !prevIsEditing)

    // create if not created
    if(!isContentCreated){
      try {
        const response = await axios.post('/api/aboutmecreate', {
          userID: props.userID, 
          content: content 
        })

        setContent(response.data.content || 'Welcome to my GitFries page!')
        setIsContentCreated(true)
      } catch (err) {
        console.log(`Error creating aboutme: ${err.response?.data?.message || err.message}`)
      }
    }else{ //update if created
      try{
        await axios.put(`/api/aboutmeupdate/${props.userID}`,{
          content: content
        })
      }catch(err){
        console.log(err)
      }
    }
  }

  return (
    <section className='about-me'>
      <div>
        <div className='about-me-header'>
          <img src="/images/cool.png" id='about-me-icon' alt='about-me icon'/>
          <h2><label>About Me</label></h2>
        </div>
        <form onSubmit={handleSubmit}>
          {props.userID === props.currentUserID?
          // if signed in userID = viewing userID, allow edit
            (isEditing? 
              <div>
                <button className='about-me-save'>Save</button>
                <textarea 
                  type='text' 
                  value={content} 
                  onChange={(e) => {setContent(e.target.value)}}
                  required 
                  className='about-me-edit'
                />
              </div>:
              <div className='about-me-content'>
                <img
                  id='edit-icon'
                  src="/images/edit.png"
                  alt="edit icon"
                  onClick={() => {setIsEditing(prevIsEditing => !prevIsEditing)}}
                />
                <p>{content} </p>
              </div>):
            // else only show content
            (<p className='about-me-content'>{content} </p>)
          }
        </form>
      </div>
      
    </section>
  )
}

