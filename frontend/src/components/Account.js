import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js"
import { createContext } from "react"
import UserPool from "../UserPool"
import { useNavigate } from 'react-router-dom'
import React from "react"

/**
 * For session management, can use it in every component
 */

export const AccountContext = createContext()

export default function Account(props){
  const navigate = useNavigate()

  // retrieve current authenticated user's session info from User Pool
  const getSession = () => {
    return new Promise((resolve, reject) => {
      const user = UserPool.getCurrentUser()

      // if user exists, get his session info; else reject
      if(user){
          user.getSession((err, session) => {
              if(err){
                console.log(err)
                reject(err)
              }else{
                resolve(session)
              }
          })
      }else{
          reject()
      }
    })
  }

  // retrieve current authenticated user's username from User Pool
  const getCurrentUsername = () => {
    const user = UserPool.getCurrentUser();
    if (user) {
      return user.getUsername();
    } else {
      return null;
    }
  }

  // extract userId from session
  const getCurrentUserId = async () => {
    try {
      const session = await getSession()
      return session.idToken.payload['sub']
    } catch (err) {
      console.log('Error fetching user ID:', err)
      return null;
    }
  }
    
  // authenticate new user
  const authenticate = async(Username, Password) => {
    await new Promise((resolve, reject) => {
      const user = new CognitoUser({Username: Username,Pool: UserPool})
      const authDetails = new AuthenticationDetails({Username: Username, Password: Password})

      user.authenticateUser(authDetails, {
        onSuccess: (result) => {
            console.log('login success', result)
            resolve(result)
            const userID = result.getIdToken().payload.sub //get userID
            console.log("User ID:", userID)
        },
        onFailure: (err) => {
            console.log("login failure", err)
            reject(err)
        },
        newPasswordRequired: (data) => {
            console.log("new password required", data)
            resolve(data)
        }
      })
    })
  }

  // log out current user and jump to '/'
  const logout = () => {
    const user = UserPool.getCurrentUser()
    if (user) {
      user.signOut();
    } else {
      alert("No user to sign out.");
    }
    navigate('/')
    window.location.reload();
  }
    
  return(
    <div>
      <AccountContext.Provider value={{authenticate, getSession, getCurrentUsername, getCurrentUserId, logout}}>
        {props.children}
      </AccountContext.Provider>
    </div>
  )
}
