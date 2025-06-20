import React, {useState, useEffect, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom'
import AddComment from './AddComment';
import Comment from './Comment';
import axios from 'axios';
import { AccountContext } from './Account';

export default function IssueDetails({ issue, formatTime }) {
  const [comments, setComments] = useState([])
  const [userID, setUserID] = useState('')
  const [username, setUsername] = useState('')
  const { getCurrentUserId } = useContext(AccountContext)
  const navigate = useNavigate()
  const [profileImg, setProfileImg] = useState('')

  // get & structure comments, fetch current user ID & username
  useEffect(() => {
    const fetchCommentsByIssue = async() => {
      try{
        const response = await axios.get(`/api/comments/${issue._id}`) // get comments
        const structuredComments = buildNestedComments(response.data)// structure comments
        setComments(structuredComments)
      }catch(err){
        console.log(err)
      }
    } 

    const fetchCurrentUserId = async() => {
      try{
        const userID = await getCurrentUserId()
        if(userID){
          setUserID(userID)

          const userResponse = await axios.get(`/api/userByID/${userID}`)
          setUsername(userResponse.data[0].username)
        }
      }catch(err){
        console.log(err)
      }
    }

    const fetchIssuePosterImg = async() => {
      const response = await axios.get(`/api/userByID/${issue.userID}`)
      setProfileImg(response.data[0].profileImageUrl)
    }

    fetchCommentsByIssue()
    fetchCurrentUserId()
    fetchIssuePosterImg()
  },[issue._id, getCurrentUserId, issue.userID])

  // build nested comments
  const buildNestedComments = (comments) => {
    
    const commentMap = {} // empty object to map comment IDs to their respective comment objects

    // initialize each comment with an empty nestedComments array and populate commentMap
    comments.forEach(comment => {
      comment.nestedComments = [] // add an empty nestedComments array to each comment
      commentMap[comment._id] = comment // add each comment to the commentMap using the comment's _id as the key
    })

    const nestedComments = []

    comments.forEach(comment => {
      // if a comment A has a parentCommentID, 
      // find its parent comment B in commentMap and push comment A into B's nestedComments array
      if (comment.parentCommentID) { 
        if (commentMap[comment.parentCommentID]) {
          commentMap[comment.parentCommentID].nestedComments.push(comment)
        }
      // otherwise pushed the comment directly into the nestedComments array
      } else {
        nestedComments.push(comment)
      }
    })

    return nestedComments
  }

  // for dynamically updating rendered comments
  const addCommentToState = (newComment) => {
    setComments(prevComments => [
      newComment,
      ...prevComments
    ])
  }

  const handleDeleteIssue = async() => {
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

        // // get issue favedby field and find those users to update their faved issue field
        // const issueFavedBy = await axios.get(`/api/issuefavedby/${issue._id}`)
        // const issueFavedByArray = issueFavedBy.data.favoritedBy
        // await Promise.all(
        //   issueFavedByArray.map(async(favedByID) => {
        //     await axios.put(`/api/userfavsremove/${favedByID}`,{
        //       userID: favedByID,
        //       issueID: issue._id
        //     })
        //   })
        // )

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
  

  return (
    <section className='issue-details'  style={{ whiteSpace: 'pre-line' }}>
      <div className='issue-details-header'>
        <div className='issue-details-userpic-container'>
          <img className='issue-details-userpic' src={profileImg || "https://gitfries.s3.eu-west-2.amazonaws.com/profile-images/me.png"} onClick={() => navigate(`/profile/${issue.username}`)} alt="profile icon" />
        </div>

        <div className='issue-details-header-right'>
          <h1>{issue.title}</h1>
          <div className='issue-details-header-info'>
            <p className='username' onClick={() => navigate(`/profile/${issue.username}`)}>{issue.username}</p> 
            <p className='language-tag'>{issue.language === 'Others'? issue.customLanguage : issue.language}</p>
            <p className='difficulty-tag'>{issue.difficulty.replace(/-/g, ' ')}</p>
            <p className='time'>{formatTime(issue.time)}</p>
            <Link to={issue.issueURL} target='_blank'>
              <img src='/images/link.png' id='link-icon' alt='link icon' />
            </Link>
            {issue.isUrgent && 
              <img 
                src='/images/urgent.png' 
                id='urgent-icon' 
                alt='urgent icon' 
              />
            }
          </div>
        </div>
      </div>
      
      <div className='issue-details-description'>{issue.description}</div>
      
      {userID === issue.userID? <img src='/images/delete.png' className='issue-details-delete' alt='delete icon' onClick={handleDeleteIssue}/>:''}
      

      <AddComment 
        issueID={issue._id}
        onAddComment={addCommentToState} 
        issue={issue}
        profileImg={profileImg}
      />

      <Comment 
        issueID={issue._id} 
        comments={comments} 
        currentUserID={userID} 
        currentUsername={username} 
        onCommentsUpdate={setComments} 
        issue={issue}
        profileImg={profileImg}
      />
      
    </section>
  )
}
