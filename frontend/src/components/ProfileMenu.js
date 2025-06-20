import React, {useState, useEffect,useContext} from "react"
import DropdownItem from "./DropdownItem"
import { NavLink } from 'react-router-dom'
import { AccountContext } from "./Account";

/**
 * top right corner user menu
 */

export default function UserMenu(){
  const [status, setStatus] = useState(false)
  const {getSession, getCurrentUsername, logout} = useContext(AccountContext)
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState(null)

  // get session data
  useEffect(() => {
    getSession()
      .then((session) => {
        setStatus(true)
      })
      .catch((err) => {
        setStatus(false)
      })
  }, [status]) 

  // get username
  useEffect(() => {
    const currentUsername = getCurrentUsername();
    setUsername(currentUsername);
  }, [])

  // trigger click event
  useEffect(()=>{
    let clickOutsideDropdown = () => setOpen(false)
    document.addEventListener('mousedown', clickOutsideDropdown)

    return() => {
      document.removeEventListener('mousedown', clickOutsideDropdown)
    }
  }, [])

  return(
    <>
      <div className="dropdown-menu">
        <div className="dropdown-trigger" onClick={() => setOpen(prevOpen => !prevOpen)}>
          <img id='me-icon' src="/images/me.png" alt="me icon"/>
        </div>

        <ul className={`dropdown-items-${open? 'active':'inactive'}`}>
          <li>
            {status? 
              <>
                <NavLink to={`profile/${username}`}><DropdownItem text="Profile" /></NavLink><br />
                <NavLink to='settings'><DropdownItem text="Settings" /></NavLink><br />
                <button onClick={logout}>Sign Out</button>
              </> :
              <NavLink to='signin'><DropdownItem text="Sign In" /></NavLink>
            }<br />
          </li>
        </ul>
      </div>
    </>
  )
}