import React, { useContext, useEffect, useState } from 'react'
import { TimeFormatContext } from './TimeFormat'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AddNestedComment from './AddNestedComment'

export default function Comment({ comments, currentUserID, currentUsername, onCommentsUpdate, issueID, issue }) {
  const { formatTime } = useContext(TimeFormatContext)
  const [nestedReplies, setNestedReplies] = useState({}) // state to manage nested replies visibility, e.g., {comment1: true}
  const navigate = useNavigate()
  const [profileImgs, setProfileImgs] = useState({}) // State to store profile images
  const [profileImg, setProfileImg] = useState({})
  const [isReplying, setIsReplying] = useState({})

  // fetch profile image for a comment's user ID
  const fetchCommenterImg = async (userID) => {
    try {
      const userResponse = await axios.get(`/api/userByID/${userID}`)
      if (userResponse.status === 200) {
        // Update profileImgs state with user profile image URL
        setProfileImgs(prevState => ({
          ...prevState,
          [userID]: userResponse.data[0].profileImageUrl
        }));
      } else {
        console.error(`Failed to fetch profile image for user ${userID}`)
      }
    } catch (error) {
      console.error(`Error fetching profile image: ${error}`)
    }
  }

  // fetch profile image for each commenter when comments or currentUserID changes
  useEffect(() => {
    if (comments) {
      comments.forEach(comment => {
        if (!profileImgs[comment.userID]) {
          fetchCommenterImg(comment.userID)
        }
      })
    }

    const fetchUserImg = async() => {
      if(currentUserID){
        const userResponse = await axios.get(`/api/userByID/${currentUserID}`)
        setProfileImg(userResponse.data[0].profileImageUrl)
      }
    }
    fetchUserImg()
  }, [comments, currentUserID, profileImg, profileImgs])

  // handle click on existing comment's "reply" btn
  const handleAddNestedReply = (commentID) => {
    if (!currentUserID) {
      navigate('/signin')
      return
    }

    // toggle the visibility of nested reply for the given commentID
    setNestedReplies(prevState => ({
      ...prevState,
      [commentID]: !prevState[commentID]
    }))

    // toggle the isReplying state for the given commentID
    setIsReplying(prevIsReplying => ({
      ...prevIsReplying,
      [commentID]: !prevIsReplying[commentID]
    }))
  }

  const handleDeleteComment = async (comment) => {
    try {
      const confirm = window.confirm('Woah, are you sure you want to delete this comment?');
      if (confirm) {

        // recursively delete comments while updating commentdb, issuedb relavant fields
        await axios.request({
          url: `/api/comment/deletenested/${comment._id}`,
          method: 'delete',
          data: { issueID: comment.issueID, userID: comment.userID }
        })

        // for dynamically showing the comment without reloading window
        const updatedComments = comments.filter(c => c._id !== comment._id)
        onCommentsUpdate(updatedComments)
      }
    } catch (err) {
      console.log(err);
    }
  }

  // handle reply to existing comment
  const handleAddNestedComment = async (issueID, parentCommentID, nestedCommentContent) => {
    try {
      // add nested comment and update commentdb
      const response = await axios.post('/api/commentcreate', {
        userID: currentUserID,
        username: currentUsername,
        issueID: issueID,
        content: nestedCommentContent,
        parentCommentID: parentCommentID
      })
      const newComment = response.data

      // update commentdb nestedcomment field
      await axios.put(`/api/comment/addnested/${parentCommentID}`, {
        nestedCommentID: newComment._id
      })

      // update issuedb commentID field
      await axios.put(`/api/issues/commentadd/${issueID}`, {
        commentID: newComment._id
      })

      // update userdb commentAdded field
      await axios.put(`/api/user/commentadd/${currentUserID}`, {
        userID: currentUserID,
        commentID: newComment._id
      })

      // update the comments state to include the new nested comment
      const updatedComments = comments.map(comment => {
        if (comment._id === parentCommentID) {
          return {
            ...comment, // the parent comment
            nestedComments: [
              {
                ...newComment, // the new nested comment
                issueID: issueID // set the issueID for the nested comment
              },
              ...(comment.nestedComments || []) // the existing nested comments
            ]
          }
        }
        return comment
      })

      // create notification for issue owner
      await axios.post(`/api/notification/create`, {
        userID: issue.userID,
        issueID: issueID,
        commentID: newComment._id,
        commentUsername: currentUsername
      })

      if (parentCommentID) {
        const parentComment = await axios.get(`/api/singleComment/${parentCommentID}`)

        // check if parentComment exists and is not the same user replying to themselves
        if (parentComment.data && parentComment.data._id && currentUserID !== parentComment.data.userID) {
          await axios.post(`/api/notification/create`, {
            userID: parentComment.data.userID,
            issueID: issueID,
            commentID: newComment._id,
            parentCommentID: parentCommentID,
            commentUsername: currentUsername
          })
        }
      }

      onCommentsUpdate(updatedComments); //defined in IssueDetails.js to setComments(updatedComments)

      // close the nested reply input after adding the comment
      setNestedReplies(prevState => ({
        ...prevState,
        [parentCommentID]: false
      }));
    } catch (err) {
      console.log(`Error adding nested comment: ${err.response?.data?.message || err.message}`);
    }
  }

  return (
    <div style={{ whiteSpace: 'pre-line' }} className='comment-container'>
      {comments.map(comment => (
        <section className='comment' key={comment._id}  style={{ whiteSpace: 'pre-line' }}>
          
          <div className='comment-userpic-name-time'>
            <div className='comment-userpic-container'>
              {profileImgs[comment.userID] && 
                <img 
                  className='comment-userpic'
                  src={profileImgs[comment.userID]} 
                  onClick={() => navigate(`/profile/${comment.username}`)} 
                  alt="profile icon" 
                />
              }
            </div>
            <h3 className='username' onClick={() => navigate(`/profile/${comment.username}`)}>
              {comment.username}
            </h3>
            <p className='time'>{formatTime(comment.time)}</p>
          </div>

          <div className='comment-content-delete-reply'>
            <div className='comment-content'>
              <p>{comment.content}</p>
            </div>
            
            <div className='delete-reply'>
              {currentUserID === comment.userID && 
                <img 
                  id='delete-icon' 
                  src='/images/delete.png'
                  alt='delete icon' 
                  onClick={() => handleDeleteComment(comment)} 
                />
              }
              <button 
                onClick={() => handleAddNestedReply(comment._id)}
                className='reply-btn'
              >
                {isReplying[comment._id] ? 'Back' : 'Reply'}
              </button>
            </div>
          </div>

          {/* if user clicks on reply to existing comment, show add nested comment */}
          {nestedReplies[comment._id] &&
            <AddNestedComment
              onAddComment={(nestedCommentContent) => handleAddNestedComment(issueID, comment._id, nestedCommentContent)}
              issue={issue}
              profileImg={profileImg}
            />}

          {/* nested comments */}
          {comment.nestedComments && comment.nestedComments.length > 0 &&
            <Comment
              issueID={issueID}
              issue={issue}
              comments={comment.nestedComments}
              currentUserID={currentUserID}
              currentUsername={currentUsername}
              onCommentsUpdate={(updatedNestedComments) => { // onCommentsUpdate is defined in IssueDetails.js to setComments(updatedComments)
                // dynamically display nested comments without page refresh
                const updatedComments = comments.map(c => {
                  if (c._id === comment._id) { //comment._id is the parent comment id
                    return {
                      ...c, // the parent comment
                      nestedComments: updatedNestedComments // the nested comments
                    }
                  }
                  return c
                });
                onCommentsUpdate(updatedComments);
              }}
            />}
        </section>
      ))}
    </div>
  )
}
