import { useContext, useEffect, useState } from "react";
import { AccountContext } from "./Account";

/**
 * Get user's current session, display user's current status
 */

export default function Status(){
    const [status, setStatus] = useState(false)
    const {getSession, logout} = useContext(AccountContext)

    /**
     * check if user is currently logged in and set corresponding state
     * @TODO dependency array might need to change to []
     */
    useEffect(() => {
        getSession()
            .then((session) => {
                console.log('session:', session)
                setStatus(true)
            })
            .catch((err) => {
                console.log('session:', err)
                setStatus(false)
            })
    }, [status]) 


    return(
        <div>
            {status?
                (<div>
                    You are logged in
                    <button onClick={logout}>Log Out</button>
                </div>):
                <div>Please log in</div>
            }
        </div>
    )
    
}