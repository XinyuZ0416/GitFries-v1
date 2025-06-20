import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function CountIssuesByLanguageOrDifficulty({countBy, header, name}) {
  const [issuesCount, setIssuesCount] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/issues/${countBy}`)
        
        // transform response.data to chart-required format
        const transformedData = response.data.map(item => ({
          name: item[name],
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
  }, [countBy, name])

  if (loading) {
    return <p>Loading...</p>
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb']

  return (
    <div>
      <h3>{header}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart width={730} height={250}>
        <Tooltip />
        <Legend />
        <Pie 
            data={issuesCount} 
            dataKey="issues" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            outerRadius={100} 
          >
          {issuesCount.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
