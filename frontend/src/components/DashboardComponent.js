import React from 'react'
import CountCommentsAndIssuesByUserAndTime from './CountCommentsAndIssuesByUserAndTime'
import CountCommentsByUserAndLanguageOrDifficulty from './CountCommentsByUserAndLanguageOrDifficulty'
import CountIssuesByUserAndLanguageOrDifficulty from './CountIssuesByUserAndLanguageOrDifficulty'

export default function DashboardComponent({userComments, userIssues}) {

  return (
    <section className='profile-dashboard'>
      <div className='profile-dashboard-header'>
        <img src="/images/dashboard.png" id='dashboard-icon' alt='dashboard icon'/>
        <h2>Dashboard</h2>
      </div>
      
      <div className='profile-dashboard-linebarchart'>
        <CountCommentsAndIssuesByUserAndTime
          currentUserComments={userComments}
          currentUserIssues={userIssues}
          height={150}
        />
      </div>

      <div className='dashboard-piechart'>
        <CountCommentsByUserAndLanguageOrDifficulty currentUserComments={userComments} />
      </div>
      <div className='dashboard-piechart'>
        <CountIssuesByUserAndLanguageOrDifficulty currentUserIssues={userIssues} />
      </div>
    </section>
  )
}
