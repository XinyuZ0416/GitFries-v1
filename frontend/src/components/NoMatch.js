import React from 'react'
import { Navigate, Link } from 'react-router-dom'

export default function NoMatch() {
  return (
    <>
      <Navigate to='/issues' replace />
      <p>Oops! Seems like you are on the wrong track..</p>
      <p>Redirecting you to the <Link to='/issues'>issues page</Link>...</p>
    </>
    
  )
}
