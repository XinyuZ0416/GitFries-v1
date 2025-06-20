import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import IssueActivity from './IssueActivity'
import CommentActivity from './CommentActivity'
import { TimeFormatContext } from './TimeFormat'

export default function Activity({ userID, currentUserID }) {
  const [comments, setComments] = useState([])
  const [issueTitles, setIssueTitles] = useState({})
  const [issues, setIssues] = useState({}) // issues being commented on
  const { formatTime } = useContext(TimeFormatContext)
  const [userPostedIssues, setUserPostedIssues] = useState([]) // issues that the user posted

  useEffect(() => {
    if (userID) {
      const fetchUserComments = async () => {
        try {
          // Fetch user comments
          const response = await axios.get(`/api/userByID/${userID}`)
          const userCommentIDs = response.data[0].commentsAdded

          const fetchedCommentPromises = userCommentIDs.map(async (commentID) => {
            try {
              const commentResponse = await axios.get(`/api/singleComment/${commentID}`)
              return commentResponse.data
            } catch (err) {
              console.log(err)
              return null
            }
          });

          const fetchedCommentDetails = await Promise.all(fetchedCommentPromises)
          const validComments = fetchedCommentDetails.filter(comment => comment !== null)
          const sortedComments = validComments.slice().sort((a, b) => new Date(b.time) - new Date(a.time))
          setComments(sortedComments)

          // Fetch commented issues
          const issueTitlesMap = {}
          const issueMap = {}
          const issuePromises = sortedComments.map(async (comment) => {
            try {
              const issueResponse = await axios.get(`/api/issue/${comment.issueID}`)
              const issue = issueResponse.data
              issueTitlesMap[comment.issueID] = issue.title
              issueMap[comment.issueID] = { ...issue, isDetailsClicked: false }
              return issue
            } catch (err) {
              console.log(err)
              return null
            }
          })

          await Promise.all(issuePromises)
          setIssueTitles(issueTitlesMap)
          setIssues(issueMap)
        } catch (err) {
          console.log(err)
        }
      }

      const fetchUserIssues = async() => {
        try{
          // get the array of user-posted issues IDs
          const response = await axios.get(`/api/userByID/${userID}`)
          const userIssuesIDs = response.data[0].issuesPosted 

          // get the user-posted issue objects
          const fetchedIssuePromises = userIssuesIDs.map(async(issueID) =>{
            const issueResponse = await axios.get(`/api/issue/${issueID}`)
            return(issueResponse.data)
          })

          // construct issue objs into an array, sort by time, and set as issues
          const fetchedIssueDetails = await Promise.all(fetchedIssuePromises)
          const sortedIssues = fetchedIssueDetails.slice().sort((a,b) => new Date(b.time) - new Date(a.time))
          setUserPostedIssues(sortedIssues)
          
        }catch(err){
          console.log(err)
        }
      }
      
      fetchUserComments()
      fetchUserIssues()
    }
  }, [userID])

  const toggleIssueDetails = (issueID) => {
    setIssues((prevIssues) => {
      if(!prevIssues[issueID]) return prevIssues

      // update the prevIssues obj's isDetailsClicked field
      return{
        ...prevIssues,
        [issueID]:{
          ...prevIssues[issueID],
          isDetailsClicked: !prevIssues[issueID].isDetailsClicked
        }
      }
    })
  }

  const handleDeleteComment = async(comment) => {
    try{
      const confirm = window.confirm('Woah, are you sure you want to delete this comment?')
      if(confirm){

        // recursively delete comments while updating commentdb, issuedb relavant fields
        await axios.request({
          url: `/api/comment/deletenested/${comment._id}`,
          method: 'delete',
          data: { issueID: comment.issueID, userID: comment.userID}
        })

        // for dynamically showing the comment without reloading window
        const updatedComments = comments.filter(c => c._id !== comment._id)
        setComments(updatedComments)
      }
    }catch(err){
      console.log(err)
    }
  }

  const handleDeleteIssue = async(issue) => {
    try{
      const confirm = window.confirm('Woah, are you sure you want to delete this issue?')
      if(confirm){
        // get issue comments
        const response = await axios.get(`/api/comments/${issue._id}`)
        const issueComments = response.data

        // update userdb issuePosted field
        await axios.put(`/api/userpostremove/${userID}`,{
          userID: userID,
          issueID: issue._id
        })

        // get issue favedby field and find those users to update their faved issue field
        const issueFavedBy = await axios.get(`/api/issuefavedby/${issue._id}`)
        const issueFavedByArray = issueFavedBy.data.favoritedBy
        await Promise.all(
          issueFavedByArray.map(async(favedByID) => {
            await axios.put(`/api/userfavsremove/${favedByID}`,{
              userID: favedByID,
              issueID: issue._id
            })
          })
        )

        // delete issue
        await axios.delete(`/api/issue/delete/${issue._id}`)

        // delete commentdb all relevant comments
        await axios.delete(`/api/comments/delete/${issue._id}`)
        
        //update userdb commentsAdded field (including current user and others)
        await Promise.all(
          issueComments.map(async(comment) => {
            await axios.put(`/api/user/commentremove/${comment.userID}`,{
              userID: comment.userID,
              commentID: comment._id
            })
          })
        )

        window.location.reload()
      }
    }catch(err){
      console.log(err)
    }
  }

  const toggleUserPostedIssueDetails = (issueID) => {
    setUserPostedIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue._id === issueID ? { ...issue, isDetailsClicked: !issue.isDetailsClicked } : issue
      )
    )
  }

  return (
    <section className='activity'>
      <div className='activity-header'>
        <img src="/images/activity.png" id='activity-icon' alt='activity icon' />
        <h2>Activity</h2>
      </div>

      {comments.length === 0 && userPostedIssues.length === 0 && <h3>No Data</h3>}
      
      <div id='activity-components'>
        {comments.length > 0 &&
          <section className='comment-issue-activities'>
            <CommentActivity
              userID={userID}
              currentUserID={currentUserID}
              comments={comments}
              issueTitles={issueTitles}
              issues={issues}
              formatTime={formatTime}
              toggleIssueDetails={toggleIssueDetails}
              handleDeleteComment={handleDeleteComment}
            />
          </section>
        }
        
        
        {userPostedIssues.length > 0 &&
          <section className='comment-issue-activities'>
            <IssueActivity 
              userID={userID} 
              currentUserID={currentUserID} 
              formatTime={formatTime} 
              userPostedIssues={userPostedIssues} 
              handleDeleteIssue={handleDeleteIssue}
              toggleUserPostedIssueDetails={toggleUserPostedIssueDetails}
            />
          </section>
        }
        
      </div>
    </section>
  )
}
