import React from 'react'
import Greeting from '../components/Greeting.js'
import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js'
import { useState, useContext } from 'react'
import UserPool from '../UserPool'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AccountContext } from "../components/Account"

/**
 * For registration & verification of new user
 */
export default function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verifyProcess, setVerifyProcess] = useState(false)
  const [OTP, setOTP] = useState('')
  const navigate = useNavigate()
  const { authenticate, getCurrentUsername, getCurrentUserId } = useContext(AccountContext)

  const onSubmit = (e) => {
    e.preventDefault()

    // if username/ email/ password is empty, input border glows
    if (username.trim().length > 25) {
      alert('Username too long, keep it below 25 char pls >:0')
      return
    }

    // generate a list of user's email address
    const attributeList = []
    attributeList.push(
      new CognitoUserAttribute({Name: 'email', Value: email})
    )

    // start verify process if given info matches requirement
    UserPool.signUp(username, password, attributeList, null, async (err, data) => {
      if (err) {
        alert(`Couldn't sign up: ${err}`)
      } else {
        setVerifyProcess(true)
      }
    })
  }
  
  const verifyAccount = (e) => {
    e.preventDefault()

    // create new user  
    const user = new CognitoUser({Username: username, Pool: UserPool})

    // confirm registraion with the new user info
    user.confirmRegistration(OTP, true, async(err, data) => {
      if (err) {
        alert(`Couldn't verify account: ${err}`)
      } else {
        try{
          // create user in mongodb
          await axios.post('/api/signup', { username, email });

          // authenticate the user to get the session
          await authenticate(username, password)

          // update userID
          const realUsername = getCurrentUsername()
          const userID = await getCurrentUserId()
          try {
            await axios.put(`/api/useridupdate/${realUsername}`, {
              userID: userID
            })
          } catch (err) {
            console.log('Error updating userID:', err);
          }

          alert('Account verified, please log in')
          navigate('/signin')
        }catch(err){
          console.error('Error creating user in MongoDB:', err)
        }
      }
    })
  }

  const resendVerifyCode = () =>{
    const user = new CognitoUser({Username: username, Pool: UserPool})

    user.resendConfirmationCode((err, result) => {
        if(err){
            alert(`An error occurs: ${err}`)
            return
        }else{
            alert(`Confirmation code resent successfully`)
        }
    })
  }
  
  return (
    <div className='sign-in-up-page'>
      <Greeting 
            greetingTextSrc="/images/welcome-back.png"
            greetingTextAlt="welcome back"
            greetingText="Sign in to unlock the fun!"
            greetingFriesSrc="/images/full-fries.png"
            greetingFriesAlt="full fries"
            greetingBtn="Sign In"
            greetingTo="/signin"
        />

      <div>
        {verifyProcess === false ? (// if haven't started verifying, show signup form
          <form onSubmit={onSubmit} className='sign-in-up'>
            <img src='images/signup.png' className='sign-in-up-icon' alt='sign up icon' />
            <label className='sign-in-up-label' htmlFor="username">UserName:</label>
              <input 
                 id="username"
                  type="text" 
                  value={username.toLowerCase().trim()}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`sign-in-up-input`}
                  placeholder='UserName:'
                  required
              />
              

              <label className='sign-in-up-label' htmlFor="email">Email:</label>
              <input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`sign-in-up-input`}
                  placeholder='Email:'
                  required
              />

              <label className='sign-in-up-label' htmlFor="password">Password:</label>
              <input 
                  id="password"
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`sign-in-up-input`}
                  placeholder='Password:'
                  required
              />

            <button className='sign-in-up-password-btn'>Sign Up</button>
          </form>
        ) : ( // if have started verifying, show verification form
          <form onSubmit={verifyAccount} className='sign-in-up'>
            <img id='greetingTextImg' src='images/verification.png' alt='verification' />
            
            <label htmlFor="verification">Please Check Your Email for Verification Code:</label>
            <input
              id="verification"
              type="text"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              className={`sign-in-up-input`}
              placeholder='Code:'
              required
            />
            <input className='btn' type="button" value="Resend Verification Code" onClick={resendVerifyCode}/>
            <button className='sign-in-up-password-btn'>C'mon, Sign Me Up Already</button>
          </form>
        )}
      </div>
    </div>
  );
  }