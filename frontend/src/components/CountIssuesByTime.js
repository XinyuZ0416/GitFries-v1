import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function CountIssuesByTime() {
  const [issuesCount, setIssuesCount] = useState([])
  const [loading, setLoading] = useState(true)

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/issues/countByTime')

        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]

        // transform response.data to chart-required format
        const transformedData = response.data.map(item => ({
          name: monthNames[item.month - 1], // month is 1-based, array is 0-based
          issues: item.count
        }))

        setIssuesCount(transformedData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(true)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h3>Issues Posted</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={issuesCount}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="issues" stroke="#734500" />
        </LineChart>
    </ResponsiveContainer>
    </div>
  );
}
