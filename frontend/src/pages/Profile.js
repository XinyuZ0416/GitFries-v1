import { React, useContext, useEffect, useState } from 'react'
import { AccountContext } from '../components/Account'
import AboutMe from '../components/AboutMe'
import DashboardComponent from '../components/DashboardComponent'
import Activity from '../components/Activity'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import ProfilePicSetting from '../components/ProfilePicSetting'

export default function Profile(){
  const { getCurrentUsername, getCurrentUserId } = useContext(AccountContext)
  const [username, setUsername] = useState('') // of user being viewed
  const [userID, setUserID] = useState('') // of user being viewed
  const [userComments, setUserComments] = useState([]) // of user being viewed
  const [userIssues, setUserIssues] = useState([]) // of user being viewed
  const [currentUserID, setCurrentUserID] = useState('') // signed-in user
  const { username: routeUsername } = useParams()

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        let fetchedUsername
        let fetchedUserID

        if (routeUsername) {
          // if user clicks on other's profile, show others
          fetchedUsername = routeUsername
          const fetchedUser = await axios.get(`/api/user/${fetchedUsername}`)
          fetchedUserID = fetchedUser.data.userID
        } else {
          // otherwise show user's own profile
          fetchedUsername = await getCurrentUsername()
          fetchedUserID = await getCurrentUserId()
        }

        // set the ID and name of user being viewed
        setUsername(fetchedUsername)
        setUserID(fetchedUserID)

        // get user being viewed 
        const user = await axios.get(`/api/userByID/${fetchedUserID}`) 
        if(!user){
          throw new Error(`User with userID ${fetchedUserID} not found.`)
        }

        // get comments of user being viewed
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
          setUserComments(comments)

        // get issues of user being viewed
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
        setUserIssues(issues)

        // fetch signed-in user's ID
        const currentUserID = await getCurrentUserId()
        setCurrentUserID(currentUserID)

      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [routeUsername, getCurrentUsername, getCurrentUserId])

  return (
    <div className='profile-page' style={{whiteSpace:'pre-line'}}>
      <div className='profile-left-container'>
        <ProfilePicSetting userID={userID} currentUserID={currentUserID} viewedUsername={username}/> 
        <AboutMe userID={userID} currentUserID={currentUserID}/>
      </div>
      <DashboardComponent userComments={userComments} userIssues={userIssues}/>
      <Activity userID={userID} currentUserID={currentUserID} />
    </div>

  )
}
  