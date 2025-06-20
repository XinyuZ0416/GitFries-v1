import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { AccountContext } from '../components/Account'
import { TimeFormatContext } from '../components/TimeFormat'
import IssueDetails from '../components/IssueDetails'

export default function Notification() {
  const [notifications, setNotifications] = useState([])
  const [parentComments, setParentComments] = useState({})
  const [comments, setComments] = useState({})
  const [issues, setIssues] = useState({})
  const [userID, setUserID] = useState('')
  const { getCurrentUserId } = useContext(AccountContext)
  const { formatTime } = useContext(TimeFormatContext)

  // get current user ID
  useEffect(() => {
		const fetchUserID = async() => {
			const userID = await getCurrentUserId()
			if(userID){
				setUserID(userID)
			}
		}
		fetchUserID()
	},[getCurrentUserId])

  // get user notifications and relevant comments and issues
  useEffect(() => {
		const fetchUserNotificationsAndRelevantComments = async() => {
			if(userID){
        try{
          // fetch notifs
          const notificationsResponse = await axios.get(`/api/notifications/${userID}`)
          if(notificationsResponse){
            const notifications = notificationsResponse.data
            const sortedNotifications = notifications.slice().sort((a, b) => new Date(b.time) - new Date(a.time))
            setNotifications(sortedNotifications)

            const fetchCommentAndIssue = async() => {
              const commentsMap = {}
              const parentCommentsMap = {}
              const issuesMap = {}
  
              for(const notification of notifications){
                // map comments
                try{
                  const commentResponse = await axios.get(`/api/singleComment/${notification.commentID}`)
                  if(commentResponse){
                    commentsMap[notification.commentID] = commentResponse.data
                  }
                }catch (error) {
                  console.error(`Error fetching comment ${notification.commentID}: ${error.message}`)
                  commentsMap[notification.commentID] = { username: 'Someone', content: '(Comment has been deleted)' }
                }
                
                // map parentComments
                if(notification.parentCommentID != null){
                  try{
                    const parentCommentResponse = await axios.get(`/api/singleComment/${notification.parentCommentID}`)
                    if(parentCommentResponse){
                      // console.log(parentCommentResponse.data.userID)
                      parentCommentsMap[notification.parentCommentID] = parentCommentResponse.data
                    }
                  }catch (error) {
                    console.error(`Error fetching parent comment ${notification.parentCommentID}: ${error.message}`)
                    parentCommentsMap[notification.parentCommentID] = { content: '(Comment has been deleted)' }
                  }
                  
                }
                
                // map issues
                try{
                  const issueResponse = await axios.get(`/api/issue/${notification.issueID}`)
                  if(issueResponse){
                    issuesMap[notification.issueID] = issueResponse.data
                  }
                }catch (error) {
                  console.error(`Error fetching issue ${notification.issueID}: ${error.message}`)
                  issuesMap[notification.issueID] = { title: '(Issue has been deleted)', language: '', difficulty: '' }
                }
                
              }
              setComments(commentsMap)
              setParentComments(parentCommentsMap)
              setIssues(issuesMap)
            }
            fetchCommentAndIssue()
          }        
        }catch (err) {
          console.error(err)
        }
			}
		}

		fetchUserNotificationsAndRelevantComments()
	},[userID])

  // notifications are only relevant if its not triggered by the signed in user himself
  const hasRelevantNotifications = notifications.some(notification => {

    const comment = comments[notification.commentID]
    return comment && userID !== comment.userID
  })

  const toggleNotificationIssueDetail = (issueID) => {
    setIssues((prevIssues) => {
      // Make a copy of the previous issues state
      const updatedIssues = { ...prevIssues }
  
      updatedIssues[issueID] = {
        ...updatedIssues[issueID],
        isDetailsClicked: !updatedIssues[issueID].isDetailsClicked,
      }

      return updatedIssues
    })
  }
  
  return (
    <div style={{whiteSpace:'pre-line'}} className='notification-page'>
      {notifications.length > 0 && hasRelevantNotifications ?
        notifications.map(notification => (
          userID && comments[notification.commentID] && userID !== comments[notification.commentID].userID &&
            <section key={notification._id} className='single-notification'>
              <p className='time'>{formatTime(comments[notification.commentID].time)}</p>
              <h3>{comments[notification.commentID].username} {notification.parentCommentID? 'replied':'commented'}</h3>
              <h3>{comments[notification.commentID].content}</h3>

              {notification.parentCommentID && parentComments[notification.parentCommentID] &&
                <>
                  <p>to</p>
                  <section className='notification-issue-comment'>
                    <p className='notification-comment-username'>{parentComments[notification.parentCommentID].username}</p>
                    <p className='notification-comment-content'>{parentComments[notification.parentCommentID].content}</p>
                  </section>
                </>
              }
              <p>on</p>
              <section className='notification-issue-comment'>
                {issues[notification.issueID].isUrgent && <img src='/images/urgent.png' id='urgent-icon' alt='urgent icon' />}
                {issues[notification.issueID].isDetailsClicked ? 
                <>
                  <button 
                    className='notification-back-btn'
                    onClick={() => toggleNotificationIssueDetail(notification.issueID)}
                  >
                    back
                  </button>
                  <IssueDetails issue={issues[notification.issueID]} formatTime={formatTime}/> 
                </>: 
                <>
                  {issues[notification.issueID].title !== '(Issue has been deleted)' ? (
                    <>
                      <p className='notification-issue-title' onClick={() => toggleNotificationIssueDetail(notification.issueID)}>{issues[notification.issueID].title}</p>
                      <div className='notification-issue-tags'>
                        <p className='language-tag'>{issues[notification.issueID].language}</p>
                        <p className='difficulty-tag'>{issues[notification.issueID].difficulty}</p>
                      </div>
                    </>
                  ) : (
                    <p>{issues[notification.issueID].title}</p>
                  )}
                </>
                }
              </section>
            </section>
        ))
        :<strong>No notifications</strong>
      }
    </div>
  )
}
