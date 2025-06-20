import { useState } from "react";
import UserPool from "../UserPool";
import { CognitoUser } from "amazon-cognito-identity-js"
import { useNavigate } from "react-router-dom";
import Greeting from "../components/Greeting";

/**
 * For password reset
 */
export default function ForgotPassword(){
    const [passwordResetCode, setPasswordResetCode] = useState('')
    const [newPassword, setNewPassword] = useState("")
    const [username, setUsername] = useState("")
    const navigate = useNavigate()

    const resetForgottenPassword = () => {
        try {
            const user = new CognitoUser({ Username: username, Pool: UserPool })
            user.forgotPassword({
                onSuccess: () => {
                    alert('Password reset code has been sent to your email.')
                },
                onFailure: (err) => {
                    if(!username){
                        alert(`You didn't forget your email as well, did you?`)
                        return
                    }
                    alert(`Failed to initiate password reset process: ${err}`)
                }
            })
        } catch (error) {
            alert(`An error occurred during password reset: ${error}`)
        }
    }

    const confirmPasswordReset = (e) => {
        e.preventDefault()

        const user = new CognitoUser({ Username: username, Pool: UserPool })
        try {
            user.confirmPassword(passwordResetCode, newPassword, {
                onSuccess: () => {
                    alert('Password reset successful.')
                    navigate('/signin')
                },
                onFailure: (err) => {
                    alert(`Failed to reset password: ${err}`)
                }
            })
        } catch (error) {
            console.error(error)
            alert('An error occurred during password reset.')
        }
    }

    return (
        <div className='sign-in-up-page'>
          <form onSubmit={confirmPasswordReset} className='sign-in-up'>
            <img id="greetingTextImg" src="images/reset-password.png" alt="reset password" />
            <label className='sign-in-up-label'>Email: </label>
            <input
                type="email"
                value={username}
                onChange={(e) => {setUsername(e.target.value)}}
                className='sign-in-up-input'
                placeholder="Email:"
            />
            <input id="reset-password-verification-icon" type="button" value="Send Password Reset Code" onClick={resetForgottenPassword} />
            
            <label className='sign-in-up-label'>Password Reset Code: </label>
            <input
                type="text"
                value={passwordResetCode}
                onChange={(e) => setPasswordResetCode(e.target.value)}
                className='sign-in-up-input'
                placeholder="Code:"
                required
            />

            <label className='sign-in-up-label'>New Password: </label>
            <input
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className='sign-in-up-input'
                placeholder="New Password:"
                required
            />
            <button className='sign-in-up-password-btn'>Reset Password</button>
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
      )
}