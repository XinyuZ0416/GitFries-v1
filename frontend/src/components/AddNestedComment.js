import React, { useEffect, useContext, useState } from 'react'
import { AccountContext } from '../components/Account'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function AddNestedComment({ onAddComment, issue, profileImg }) {
  const { getCurrentUserId } = useContext(AccountContext)
  const [username, setUsername] = useState('')
  const [comment, setComment] = useState('')
  const navigate = useNavigate()
  
  // get username on component mount
  useEffect(() => {
    const fetchUserData = async() => {
      const userID = await getCurrentUserId()
      const userResponse = await axios.get(`/api/userByID/${userID}`)

      setUsername(userResponse.data[0].username)
    }
    fetchUserData()
  }, [getCurrentUserId])
  
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!username) {
      navigate('/signin')
    } else if (!comment) {
      alert('Did you add any content?')
      return
    }

    onAddComment(comment)
    setComment('') // clear textarea
  }

  return (
    <form onSubmit={handleSubmit} className='add-nestedcomment'>
      <div className='add-comment-userpic-name'>
        <img className='add-comment-userpic' src={profileImg || "https://gitfries.s3.eu-west-2.amazonaws.com/profile-images/me.png"} onClick={() => navigate(`/profile/${issue.username}`)} alt="profile icon" />
        <h3 className='add-comment-name'>{username}</h3>
      </div>

      <div className='add-comment-text-commentbtn'>
        <textarea 
          type='text'
          name='comment'
          value={comment}
          placeholder='Add a comment...' 
          onChange={(e) => setComment(e.target.value)}
          className='add-comment-text'
        />
        <button className='add-comment-btn'>Comment</button>
      </div>
    </form>
  )
}
