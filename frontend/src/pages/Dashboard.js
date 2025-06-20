import React,{ useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CountIssuesByTime from '../components/CountIssuesByTime'
import { AccountContext } from '../components/Account'
import CountCommentsAndIssuesByUserAndTime from '../components/CountCommentsAndIssuesByUserAndTime'
import CountIssuesByLanguageOrDifficulty from '../components/CountIssuesByLanguageOrDifficulty'
import axios from 'axios'
import CountCommentsByUserAndLanguageOrDifficulty from '../components/CountCommentsByUserAndLanguageOrDifficulty'
import CountIssuesByUserAndLanguageOrDifficulty from '../components/CountIssuesByUserAndLanguageOrDifficulty'

export default function Dashboard() {
  const [currentUserID, setCurrentUserID] = useState('')
  const [currentYear, setCurrentYear] = useState('')
  const [currentUserComments, setCurrentUserComments] = useState([])
  const [currentUserIssues, setCurrentUserIssues] = useState([])
  const {getCurrentUserId} = useContext(AccountContext)

  useEffect(() => {
    const fetchCurrentUserID = async() => {
      const currentUserID = await getCurrentUserId()
      setCurrentUserID(currentUserID)
    }
    
    fetchCurrentUserID()

    const currentYear = new Date().getFullYear()
    setCurrentYear(currentYear)

    
  },[getCurrentUserId])

  useEffect(() => {
    const fetchCurrentUserData = async() => {
      if(currentUserID){
        try{
          // get current user
          const user = await axios.get(`/api/userByID/${currentUserID}`)
          if(!user){
            console.log('no user')
            // throw new Error(`User with userID ${currentUserID} not found.`)
          }
          console.log(user)
  
          // get current user comments
          const commentIDs = user.data[0].commentsAdded
          const commentsPromise = Promise.all(commentIDs.map(async(commentID) => {
            try{
              const commentResponse = await axios.get(`/api/singleComment/${commentID}`)
              return commentResponse.data
            }catch(err){
              console.error(`Error fetching comment ${commentID}: ${err.message}`)
              throw err
            }
          }))
          const comments = await commentsPromise
          setCurrentUserComments(comments)

          // get current user issues
          const issueIDs = user.data[0].issuesPosted
          const issuesPromise = Promise.all(issueIDs.map(async(issueID) => {
            try{
              const issueResponse = await axios.get(`/api/issue/${issueID}`)
              return issueResponse.data
            }catch(err){
              console.error(`Error fetching issue ${issueID}: ${err.message}`)
              throw err
            }
          }))
          const issues = await issuesPromise
          setCurrentUserIssues(issues)
        }catch (error) {
          console.error('Error fetching user or comments:', error)
          throw error
      }
      }
    } 

    fetchCurrentUserData()
  },[currentUserID])

  return (
    <div className='dashboard-page'>
      <section className='dashboard-page-container'>
      <h1 className='dashboard-page-title'>Personal metrics In {currentYear}</h1>
      {currentUserID? 
        <div>
          <CountCommentsAndIssuesByUserAndTime 
            currentUserComments={currentUserComments}
            currentUserIssues={currentUserIssues}
            height={300}
          />
          <div className='dashboard-piechart'>
            <CountCommentsByUserAndLanguageOrDifficulty currentUserComments={currentUserComments} />
          </div>
          <div className='dashboard-piechart'>
            <CountIssuesByUserAndLanguageOrDifficulty currentUserIssues={currentUserIssues} />
          </div>
        </div>:
        <h2>Please <Link to='/signin'>sign in</Link> to see your own metrics</h2> 
      }

      <h1 className='dashboard-page-title'>Public Metrics In {currentYear}</h1>
      <CountIssuesByTime />

      <div className='pie-charts-container'>
        <div className='chart-container'>
          <CountIssuesByLanguageOrDifficulty countBy={'countByDifficulty'}header={'Issues By Difficulty'} name={'difficulty'} />
        </div>
        <div className='chart-container'>
          <CountIssuesByLanguageOrDifficulty countBy={'countByLanguage'} header={'Issues By Language'} name={'language'} />
        </div>
      </div>
      </section>
    </div>
  )
}
