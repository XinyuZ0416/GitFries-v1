import React, { useState, useEffect } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CountCommentsAndIssuesByUserAndTime({ currentUserComments, currentUserIssues, height }) {
  const [combinedData, setCombinedData] = useState([])

  

  useEffect(() => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    if (currentUserComments.length > 0 || currentUserIssues.length > 0) {
      const countCommentsAndIssuesByTime = () => {
        const commentCounts = Array(12).fill(0)
        const issueCounts = Array(12).fill(0)

        // count comments by month
        currentUserComments.forEach(comment => {
          const monthIndex = new Date(comment.time).getMonth()
          commentCounts[monthIndex]++;
        })

        // Count issues by month
        currentUserIssues.forEach(issue => {
          const monthIndex = new Date(issue.time).getMonth()
          issueCounts[monthIndex]++
        })

        // Prepare data in chart-required format
        const transformedData = monthNames.map((name, index) => ({
          name,
          comments: commentCounts[index],
          issues: issueCounts[index]
        }))

        setCombinedData(transformedData)
      }

      countCommentsAndIssuesByTime() // Call the counting function immediately
    } else {
      // If no data, set combinedData to an empty array
      setCombinedData([])
    }
  }, [currentUserComments, currentUserIssues])

  return (
    <div>
      <h3>Issues Posted & Comments Added</h3>
      <div className='linebar-chart-container'>
        {currentUserComments.length > 0 || currentUserIssues.length > 0 ? (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={combinedData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3"/>
              <Line type="monotone" dataKey="issues" stroke="#734500" />
              <Bar dataKey="comments" fill="rgba(252, 211, 4, 0.6)" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <h3>No Data</h3>
        )}
      </div>
    </div>
  )
}
