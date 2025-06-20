import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function ProfilePicSetting({ userID, currentUserID, viewedUsername }) {
  const [username, setUsername] = useState('') // username of the user being viewed
  const [isEditing, setIsEditing] = useState(false) // flag to toggle editing mode
  const [isEditingURL, setIsEditingURL] = useState(false) // flag to toggle editing mode of personal url
  const [isPreviewing, setIsPreviewing] = useState(false) // flag to indicate if preview mode is active
  const [image, setImage] = useState(null) // selected image file
  const [imageUrl, setImageUrl] = useState('') // URL of the profile image
  const [personalUrl, setPersonalUrl] = useState('') // personal URL of the user
  const [previewImage, setPreviewImage] = useState('') // URL of the previewed image
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  useEffect(() => {
    setUsername(viewedUsername)

    const fetchUser = async () => {
      if (userID) {
        const user = await axios.get(`/api/userByID/${userID}`)
        setImageUrl(user.data[0].profileImageUrl)
        setPersonalUrl(user.data[0].personalUrl)
      }
    }

    fetchUser()
  }, [viewedUsername, userID])

  // handle personal usrl
  const handleSetURL = async(e)=> {
    e.preventDefault()

    try{
      await axios.put(`/api/userUrlupdate/${currentUserID}`,{personalUrl: personalUrl})
    }catch(err){
      console.log(err)
    }

    setIsEditingURL(false)
  }

  // handle updating username
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (!username.trim()) {
        alert('Username cannot be empty')
        return
      }

      if (username.trim().length > 25) {
        alert('Username too long, keep it below 25 char pls >:0')
        return
      }

      // update the username
      const response = await axios.put(`/api/usernameupdate/${currentUserID}`, { username: username.trim() })

      // find user posted issues and change username
      const issueIDsArray = response.data.issuesPosted
      Promise.all(issueIDsArray.map(async (issueID) => {
        await axios.put(`/api/updateIssueUsername/${issueID}`, { username })
      }))

      // find user comments and change username
      const commentIDsArray = response.data.commentsAdded
      Promise.all(commentIDsArray.map(async (commentID) => {
        await axios.put(`/api/updateCommentUsername/${commentID}`, { username })
      }))

      if (response.status === 200) {
        // update the state to reflect the new username and toggle editing mode
        setIsEditing(false)
        navigate(`/profile/${username}`)
      } else {
        alert('Failed to update username')
      }
    } catch (error) {
      // handle different error scenarios
      if (error.response && error.response.status === 500) {
        alert('Username already exists. Please choose another one.')
      } else {
        alert('An error occurred while updating the username.')
      }
      console.error('Error updating username:', error)
    }
  }

  // handle click to select image
  const handleSelectImg = () => {
    fileInputRef.current.click()
  }

  // handle image selection
  const handleImage = (e) => {
    setIsPreviewing(true)
    const selectedImg = e.target.files[0]
    if (selectedImg) {
      setImage(selectedImg)
      setPreviewImage(URL.createObjectURL(selectedImg))
    }
  }

  // handle image upload
  const handleUploadImg = async (e) => {
    e.preventDefault()
    setIsPreviewing(false)

    const formData = new FormData()
    formData.append('profileImage', image)

    try {
      const response = await axios.put(`/api/userpicupload/${currentUserID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })

      if (response.status === 200) {
        setImageUrl(response.data.user.profileImageUrl)
      } else {
        alert('Failed to update profile image')
      }
    } catch (error) {
      alert('An error occurred while uploading the profile image.')
      console.error('Error uploading profile image:', error)
    }
  }

  

  return (
    <section className='profile'>
      <form onSubmit={handleSubmit}>
        {userID === currentUserID ? (
          <>
            {/* profile pic */}
            {isPreviewing ? (
              <div>
                <img
                  className='proile-page-pic'
                  src={previewImage || "https://gitfries.s3.eu-west-2.amazonaws.com/profile-images/me.png"}
                  alt="profile preview"
                />
                <input id='confirm-btn' type='button' value='Confirm' onClick={handleUploadImg} />
              </div>
            ) : (
              <div>
                <img
                  className='proile-page-pic'
                  src={imageUrl || "https://gitfries.s3.eu-west-2.amazonaws.com/profile-images/me.png"}
                  alt="profile"
                />
                
                <img
                  id='edit-icon'
                  src="/images/edit.png"
                  alt="edit icon"
                  onClick={handleSelectImg}
                />
              </div>
            )}
          
            <div>
              <input
                type='file'
                ref={fileInputRef}
                style={{ display: 'none' }}
                name='file'
                onChange={handleImage}
                accept='image/*'
              />
            </div>

            {/* username */}
            {isEditing ? (
              <div>
                <input
                  type='text'
                  value={username}
                  onChange={(e) => { setUsername(e.target.value.trim()) }}
                  required
                />
                <button>Save</button>
              </div>
            ) : (
              <div>
                <h2>{username}</h2>
                <img
                id='edit-icon'
                src="/images/edit.png"
                alt="edit icon"
                onClick={() => { setIsEditing(prevIsEditing => !prevIsEditing) }}
                style={{ cursor: 'pointer' }}
              />
              </div>
            )}

            {/* personal url */}
            {isEditingURL ? (
              <div>
                <input
                  type='text'
                  value={personalUrl}
                  placeholder='Personal URL (optional)'
                  onChange={(e) => { setPersonalUrl(e.target.value) }}
                />
                <button onClick={handleSetURL}>Save</button>
              </div>
            ) : (
              <div>
                <Link to={personalUrl} target='_blank'>
                  <img src='/images/link.png' id='link-icon' alt='link icon' />
                </Link>
                <img
                id='edit-icon'
                src="/images/edit.png"
                alt="edit icon"
                onClick={() => { setIsEditingURL(prevIsEditingURL => !prevIsEditingURL) }}
                style={{ cursor: 'pointer' }}
              />
              </div>
            )}
            
          </>
        ) : (
          <>
            <img
                  id='profile-img'
                  src={imageUrl || "https://gitfries.s3.eu-west-2.amazonaws.com/profile-images/me.png"}
                  alt="profile preview"
                />
            <h2>{username}</h2>
            {personalUrl && 
              <Link to={personalUrl} target='_blank'>
                <img src='/images/link.png' id='link-icon' alt='link icon' />
              </Link>}
          </>
        )}
      </form>
    </section>
  )
}