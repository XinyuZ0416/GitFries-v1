import React, { useState,useEffect, useContext } from 'react'
import {AccountContext} from '../components/Account'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function IssuesSidebar({ issue, getIssueDetail, formatTime, handleFavIssue, isFaved }) {
  const [childComponentIsFaved, setChildComponentIsFaved] = useState(isFaved)
  const {getCurrentUserId} = useContext(AccountContext)
  const navigate = useNavigate()
  const [profileImg, setProfileImg] = useState('')

  const handleChildComponentIsFaved = async () => {
    setChildComponentIsFaved(prevChildComponentIsFaved => !prevChildComponentIsFaved)
    await handleFavIssue(issue, !childComponentIsFaved) //send to parent component the fav status of single issue
  }

  // update the issue fav status when component mounts and fetch issue poster img
  useEffect(() => {
    const updateFavStatus = async () => {
      try {
        const userID = await getCurrentUserId()
        if (userID) {
          // if user signed in, update fav status
          const favResponse = await axios.get(`/api/userfavs/${userID}`)
          const isIssueFaved = favResponse.data.some(favIssue => favIssue._id === issue._id)
          setChildComponentIsFaved(isIssueFaved)
        } else {
          // if user signed out, show every issue as unfaved
          setChildComponentIsFaved(false)
        }
      } catch (error) {
        console.error('Error updating favorited status:', error)
      }
    }

    const fetchIssuePosterImg = async() => {
      const response = await axios.get(`/api/userByID/${issue.userID}`)
      setProfileImg(response.data[0].profileImageUrl)
    }
  
    updateFavStatus()
    fetchIssuePosterImg()
  }, [getCurrentUserId, issue._id, issue.userID])

  
  return (
    <section key={issue._id} className='single-sidebar'>
      
      <div>
        {issue.isUrgent && <img src='/images/urgent.png' id='urgent-icon' alt='urgent icon' />}
        <h3>
            <input 
              type='button' 
              value={issue.title} 
              onClick={() => getIssueDetail(issue)} 
              className='sidebar-title'
            />
          </h3>
          
        <div className='sidebar-tags'>
          <p className='language-tag'>
            {issue.language === 'Others'? issue.customLanguage : issue.language}
          </p>
          <p className='difficulty-tag'>
            {issue.difficulty.replace(/-/g, ' ')}
          </p>
        </div>
        

        <div className='sidebar-user'>
          <img 
            className='sidebar-usericon' 
            src={profileImg || "https://gitfries.s3.eu-west-2.amazonaws.com/profile-images/me.png"} 
            onClick={() => navigate(`/profile/${issue.username}`)} 
            alt="profile icon" 
          />
          <p className='sidebar-username' onClick={() => navigate(`/profile/${issue.username}`)}>
            {issue.username}
          </p>
        </div>
        
        <div className='sidebar-time-fav'>
          <p className='sidebar-time'>{formatTime(issue.time)}</p>
          {childComponentIsFaved? 
            <img id='full-fries' src='/images/full-fries.png' alt='favorited' onClick={handleChildComponentIsFaved}/>:
            <img id='empty-fries' src='/images/empty-fries.png' alt='not favorited' onClick={handleChildComponentIsFaved}/>
          }
        </div>
      </div>
    </section>
  )
}
