import { Route, Routes } from 'react-router-dom'
import React from 'react';
import './App.css'
import Navbar from './components/Navbar'
import Profile from './pages/Profile.js'
import Issues from './pages/Issues'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Intro from './pages/Intro'
import Account from './components/Account.js'
import TimeFormat from './components/TimeFormat.js'
import ForgotPassword from './pages/ForgotPassword.js'
import NoMatch from './components/NoMatch.js'
import Footer from './components/Footer.js'
import PostIssues from './pages/PostIssues.js'
import IssueDetails from './components/IssueDetails.js'
import Notification from './pages/Notification.js'


export default function App() {
  return (
    <>
      <TimeFormat>
      <Account>
        <div className='App'>
          <Navbar />
            <Routes>
              <Route path='/' element={<Intro />} />
              <Route path='/profile/:username' element={<Profile />} />
              <Route path='issues' element={<Issues />} />
              <Route path='/issue/:issueID' element={<IssueDetails />} />
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='signup' element={<Signup />} />
              <Route path='signin' element={<Signin />} />
              <Route path='*' element={<NoMatch />} />
              <Route path='forgot-password' element={<ForgotPassword />} />
              <Route path='post-issues' element={<PostIssues />} />
              <Route path='/notification' element={<Notification />} />
            </Routes>
        </div>
        <Footer />
      </Account>
      </TimeFormat>
    </>
  )
}
