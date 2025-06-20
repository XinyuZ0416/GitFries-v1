import React from 'react'
import Greeting from '../components/Greeting.js'
import { useState, useContext } from 'react'
import { AccountContext } from "../components/Account"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

/**
 * For user login
 */
export default function Signin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { authenticate, getCurrentUserId } = useContext(AccountContext)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Authenticate user
      await authenticate(username, password)

      // Get current user ID
      const userID = await getCurrentUserId()
  

      // Fetch user data using userID
      const response = await axios.get(`/api/userByID/${userID}`)
      const fetchedUsername = response.data[0].username // Use a different variable name to avoid conflicts
      console.log(fetchedUsername)
      
      // Navigate to profile page
      navigate(`/profile/${fetchedUsername}`)
      window.location.reload()
    } catch (err) {
      alert(`Sign in failed: ${err}`)
    }
  }
  
  return (
    <div className='sign-in-up-page'>
      <form onSubmit={handleSubmit} className='sign-in-up'>
        <img src='images/signin.png' className='sign-in-up-icon' alt='sign in icon' />

        <label className='sign-in-up-label' htmlFor='email'>Email:</label>
        <input
          id='email'
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Email:'
          className={`sign-in-up-input`}
          required
        />

        <label className='sign-in-up-label' htmlFor='password'>Password:</label>
        <input
          id='password'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`sign-in-up-input`}
          placeholder='Password:'
          required
        />
        <input id='recover-password' type="button" value="Oh   , what was my password?" onClick={() => navigate('/forgot-password')} />

        <button className='sign-in-up-password-btn'>Sign In</button>
      </form>

      <Greeting 
          greetingTextSrc="/images/hello-there.png"
          greetingTextAlt="hello there"
          greetingText="Sign up for the goodies!"
          greetingFriesSrc="/images/empty-fries.png"
          greetingFriesAlt="empty fries"
          greetingBtn="Sign Up"
          greetingTo="/signup"
        />
    </div>
  );
}