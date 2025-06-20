import React,{ useContext, useState, useEffect }  from 'react'
import { Link, NavLink } from 'react-router-dom'
import Usermenu from './UserMenu'
import { AccountContext } from './Account'
import axios from 'axios'

export default function Navbar(){
	const { getCurrentUserId } = useContext(AccountContext)
	const [userID, setUserID] = useState('')
	const [unreadNotifications, setUnreadNotifications] = useState([])

	// get current user ID
	useEffect(() => {
		const fetchUserID = async() => {
			const userID = await getCurrentUserId()
			if(userID){
				setUserID(userID)
			}
		}

		fetchUserID()
	},[getCurrentUserId])


	// get unread notifications
	useEffect(() => {
		const fetchUnreadUserNotifications = async() => {
			if(userID){
				const unreadNotificationsObj = await axios.get(`/api/unreadNotifications/${userID}`)
				const unreadNotifications = unreadNotificationsObj.data
				if(unreadNotifications){
					setUnreadNotifications(unreadNotifications)
				}
			}
		}
		fetchUnreadUserNotifications()
	},[userID])

	// when user clicks on notification icon, mark as read
	const handleClickNotification = async () => {
		try{
			await Promise.all(
				unreadNotifications.map(async(unreadNotification) => {
					await axios.put(`/api/markNotificationRead/${unreadNotification._id}`)
				})
			)
			setUnreadNotifications([])
		}catch (error) {
      console.error('Error marking notifications as read:', error);
    }
		
	}


	return(
		<nav>
			<Link to="/">
				<img className='navbar-icon' src="/images/full-fries.png" alt="web-icon"/>
				<img className='navbar-icon' src="/images/web-name.png" alt="web-name"/>
			</Link>

			<ul>
				<li className='navbar-text'><NavLink to="issues">Issues</NavLink></li>
				<li className='navbar-text'><NavLink to="dashboard">Dashboard</NavLink></li>
			</ul>
			{userID &&
				<div id='notification-icon'>
					{unreadNotifications.length > 0 ? 
						<Link to='/notification' onClick={handleClickNotification}>
							<img className='navbar-icon' src="/images/new-notification.png" alt="notification-icon"/>
						</Link>:
						<Link to='/notification'>
							<img className='navbar-icon' src="/images/notification.png" alt="notification-icon"/>
						</Link>
					}
					
				</div>
			}
			<Usermenu userID={userID}/>
		</nav>
	)
}