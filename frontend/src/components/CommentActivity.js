import React from 'react'
import IssueDetails from './IssueDetails'
import { Link } from 'react-router-dom'

export default function CommentActivity({
  userID,
  currentUserID,
  comments,
  issueTitles,
  issues,
  formatTime,
  toggleIssueDetails,
  handleDeleteComment}){
  
  return (
    <div>
      {comments.length > 0 ? (
        <>
          <h3 className='comment-issue-header'>Comments</h3>
            {comments.map(comment => (
              <div key={comment._id} className='single-comment-issue'>
                <p className='time'>{formatTime(comment.time)}</p>
                <p>Replied:</p>
                <p className='activity-comment-content'>{comment.content}</p>
                {/* Render issue details conditionally */}
                {issues[comment.issueID] && issues[comment.issueID].isDetailsClicked ? 
                  (
                  <div className='unfolded-title'>
                    <input
                      type='button'
                      value='Close'
                      onClick={() => toggleIssueDetails(comment.issueID)}
                      className='close-issue-btn'
                    />
                    {issues[comment.issueID] && (
                      <IssueDetails issue={issues[comment.issueID]} formatTime={formatTime} />
                    )}
                  </div>
                  ) : (
                  <div>
                    <div
                      className='comment-activity-issue-title'
                      onClick={() => toggleIssueDetails(comment.issueID)}
                    >
                      {issueTitles[comment.issueID] || ':Loading'}
                    
                      {issues[comment.issueID]? 
                        <div className='link-language-difficulty'>
                          <p className='language-tag'>{issues[comment.issueID].language}</p>
                          <p className='difficulty-tag'>{issues[comment.issueID].difficulty}</p>
                          <Link to={issues[comment.issueID].issueURL} target='_blank'>
                            <img src='/images/link.png' id='link-icon' alt='link icon' />
                          </Link>
                        </div>: 
                        <p>Loading issue details...</p>
                      }
                    </div>
                    {currentUserID === userID && (
                    <img
                      src='/images/delete.png'
                      id='delete-icon'
                      alt='delete icon'
                      onClick={() => handleDeleteComment(comment)}
                    />
                    )}
                  </div>
                )}
              </div>
            ))}
        </>
      ) : (
        <p>No comments found</p>
      )}
    </div>
  )
}
