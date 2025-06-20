import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function CountIssuesByUserAndLanguageOrDifficulty({currentUserIssues}) {
  const [issuesByDifficulty, setIssuesByDifficulty] = useState([])
  const [issuesByLanguage, setIssuesByLanguage] = useState([])

  useEffect(()=>{
    if(currentUserIssues){
      try{
        // group issues by difficulty
        const groupedByDifficulty = currentUserIssues.reduce((groups, issue) => {
          if (!groups[issue.difficulty]) {
            groups[issue.difficulty] = { name: issue.difficulty, issues: [] }
          }
          groups[issue.difficulty].issues.push(issue)
          return groups
        }, {})

        // convert object to array of objects
        const transformedDifficulty = Object.values(groupedByDifficulty)
        setIssuesByDifficulty(transformedDifficulty)

        // group issues by language
        const groupedByLanguage = currentUserIssues.reduce((groups, issue) => {
          if (!groups[issue.language]) {
            groups[issue.language] = { name: issue.language, issues: [] }
          }
          groups[issue.language].issues.push(issue)
          return groups
        }, {})
  
        // convert object to array of objects
        const transformedLanguage = Object.values(groupedByLanguage)
        setIssuesByLanguage(transformedLanguage)

      }catch (error) {
          console.error('Error fetching issues:', error)
        }
    }
  
  },[currentUserIssues])

  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb']

  return (
    <div className='pie-charts-container'>
      <div className='chart-container'>
        <h3>Issues Posted By Difficulty</h3>
        {currentUserIssues.length > 0? 
          <ResponsiveContainer width="100%" height={300}>
            <PieChart width={730} height={250}>
              <Tooltip />
              <Legend />
              <Pie 
                  data={issuesByDifficulty} 
                  dataKey="issues.length" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                >
                {issuesByDifficulty.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>:
          <h3>No Data</h3>
        }
      </div>

      <div className='chart-container'>
        <h3>Issues Posted By Language</h3>
        {currentUserIssues.length > 0? 
          <ResponsiveContainer width="100%" height={300}>
            <PieChart width={730} height={250}>
              <Tooltip />
              <Legend />
              <Pie
                  data={issuesByLanguage} 
                  dataKey="issues.length" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                >
                {issuesByLanguage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>:
          <h3>No Data</h3>
        }
      </div>
    </div>

  )
}
