import React, {useState, useEffect,useContext} from "react"
import { NavLink, useNavigate } from 'react-router-dom'
import { AccountContext } from "./Account";
import axios from "axios";

/**
 * top right corner user menu
 */

export default function UserMenu({userID}){
  const [status, setStatus] = useState(false)
  const {getSession, logout} = useContext(AccountContext)
  const [open, setOpen] = useState(false)
  const [profileImg, setProfileImg] = useState('')
  const navigate = useNavigate()

  // get session data
  useEffect(() => {
    getSession()
      .then((session) => {
        setStatus(true)
      })
      .catch((err) => {
        setStatus(false)
      })
  }, [status, getSession]) 

  // get user profile img
  useEffect(() => {
    const fetchUserImg = async() => {
      if(userID){
        const userResponse = await axios.get(`/api/userByID/${userID}`)
        setProfileImg(userResponse.data[0].profileImageUrl)
      }
    }
    fetchUserImg()
  }, [userID, profileImg])

  // trigger click event
  useEffect(()=>{
    let clickOutsideDropdown = () => setOpen(false)
    document.addEventListener('mousedown', clickOutsideDropdown)

    return() => {
      document.removeEventListener('mousedown', clickOutsideDropdown)
    }
  }, [])

  const handleClickProfile = async (userID) => {
    try {
      const response = await axios.get(`/api/userByID/${userID}`)
      const username = response.data[0].username
      navigate(`/profile/${username}`)
      console.log(response.data[0].username); // Log the data received from the API
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
 
return (
  <div className="dropdown-menu">
    <div className="dropdown-trigger" onClick={() => setOpen(prevOpen => !prevOpen)}>
      <img id='me-icon' src={profileImg || "https://gitfries.s3.eu-west-2.amazonaws.com/profile-images/me.png"} alt="me icon" />
    </div>

    <ul className={`dropdown-items-${open ? 'active' : 'inactive'}`}>
      <li>
        {status ? (
          <div className="UserMenu-signed-in">
            <button className="usermenu-btn" onClick={() => handleClickProfile(userID)}>Profile</button>
            <button onClick={logout} className="usermenu-btn">Sign Out</button>
          </div>
        ) : (
          <NavLink to='signin'><button className="usermenu-btn">Sign In</button></NavLink>
        )}
      </li>
    </ul>
  </div>
);
}