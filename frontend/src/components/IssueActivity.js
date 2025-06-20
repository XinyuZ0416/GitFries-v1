import React from 'react'
import { Link } from 'react-router-dom'
import IssueDetails from './IssueDetails'

export default function IssueActivity({
  userID, 
  currentUserID, 
  formatTime, 
  userPostedIssues, 
  handleDeleteIssue, 
  toggleUserPostedIssueDetails}) {
  
  return (
    <div>
      {userPostedIssues.length > 0 ? (
        <>
          <h3 className='comment-issue-header'>Issues</h3>
            {userPostedIssues.map(issue => (
            <div key={issue._id} className='single-comment-issue'>
              <p className='time'>{formatTime(issue.time)}</p>
              <p>Posted:</p>
              
              <div>
                {issue.isDetailsClicked? 
                  <div>
                    <input 
                      type='button' 
                      value='close' 
                      onClick={() => toggleUserPostedIssueDetails(issue._id)}
                      className='close-issue-btn' 
                    />
                    <IssueDetails issue={issue} formatTime={formatTime}/>
                  </div>:
                  <div className='comment-activity-issue-title'>
                    {issue.isUrgent && <img src='/images/urgent.png' id='urgent-icon' alt='urgent icon' />}
                    <p className='issue-title' onClick={() => toggleUserPostedIssueDetails(issue._id)}>{issue.title}</p>
                    
                    <div className='link-language-difficulty'>
                      <p className='language-tag'>{issue.language === 'Others'? issue.customLanguage : issue.language}</p>
                      <p className='difficulty-tag'>{issue.difficulty}</p>
                      <Link to={issue.issueURL} target='_blank'>
                        <img src='/images/link.png' id='link-icon' alt='link icon' />
                      </Link>
                    </div>
                  </div>
                }
                {userID === currentUserID && <img src='/images/delete.png' id='delete-icon' alt='delete icon' onClick={() => {handleDeleteIssue(issue)}} />}
              </div>
            </div>
          ))}
        </>):
        ``}      
    </div>
  )
}
