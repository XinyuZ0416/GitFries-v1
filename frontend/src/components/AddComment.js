import React, { useEffect, useContext, useState } from 'react'
import {AccountContext} from '../components/Account'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AddComment({ issueID, onAddComment, issue }) {
  const { getCurrentUserId } = useContext(AccountContext)
  const [username, setUsername] = useState('')
  const [comment, setComment] = useState('')
  const [profileImg, setProfileImg] = useState('')
  const navigate = useNavigate()
  
  // get username on component mount
  useEffect(() => {
    const fetchUserData = async() => {
      const userID = await getCurrentUserId()
      if(userID){
        const userResponse = await axios.get(`/api/userByID/${userID}`)

        if(userResponse){
          setUsername(userResponse.data[0].username)
        }
      }

      const fetchUserImg = async() => {
        if(userID){
          const userResponse = await axios.get(`/api/userByID/${userID}`)
          setProfileImg(userResponse.data[0].profileImageUrl)
        }
      }
      fetchUserImg()
    }
    fetchUserData()
  },[getCurrentUserId, profileImg])
  
  const handleSubmit = async(e) => {
    e.preventDefault()

    if(!username){
      navigate('/signin')
      return
    }else if(!comment){
      alert('Did you add any content?')
      return
    }

    try{
      const userID = await getCurrentUserId()

      // add comment and update commentdb
      const response = await axios.post('/api/commentcreate',{
        userID: userID,
        username:username,
        issueID: issueID,
        content: comment
      })
      const newComment = response.data
      const newCommentID = newComment._id

      // update issuedb commentID field 
      await axios.put(`/api/issues/commentadd/${issueID}`,{
        commentID: newComment._id
      })

      // update userdb commentAdded field
      await axios.put(`/api/user/commentadd/${userID}`,{
        userID: userID,
        commentID: newComment._id
      })

      // create notification for issue owner if user is not replying to himself
      if(userID !== issue.userID){
        await axios.post(`/api/notification/create`,{
          userID: issue.userID,
          issueID: issueID,
          commentID: newCommentID,
          commentUsername: username,
        })
      }
      
      setComment('') // clear textarea
      onAddComment(newComment)
    }catch(err) {
      console.log(`Error adding comment: ${err.response?.data?.message || err.message}`)
    }  
  }

  return (
    <form onSubmit={handleSubmit} className='add-comment'>
      <div className='add-comment-userpic-name'>
        <img className='add-comment-userpic' src={profileImg || "https://gitfries.s3.eu-west-2.amazonaws.com/profile-images/me.png"} onClick={() => navigate(`/profile/${username}`)} alt="profile icon" />
        <h3 className='add-comment-name' onClick={() => navigate(`/profile/${username}`)} >{username}</h3>
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
