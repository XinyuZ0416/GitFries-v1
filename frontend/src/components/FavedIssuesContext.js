import React, {useEffect, useContext, useState, createContext} from 'react'
import axios from 'axios'
import {AccountContext} from './Account'

export const FavedIssuesContext = createContext()

export default function FavedIssuesStorage(props) {
  const {getCurrentUserId} = useContext(AccountContext)
  const [userFavedIssues, setUserFavedIssues] = useState([])

  // get user faved issues
  useEffect(() => {
    const fetchFavedIssues = async() => {
      try{
        const userID = await getCurrentUserId()
        if(userID){
          const favResponse = await axios.get(`/api/userfavs/${userID}`)
          setUserFavedIssues(favResponse.data)

          // const favedIssuesMap =favResponse.data.map(favedIssue => favedIssue._id)
          // console.log(favedIssuesMap)
        }else{
          console.log('user not signed in')
        }
      }catch(err){
        console.log(err)
      }
    }
    fetchFavedIssues()
  }, [getCurrentUserId])

  return (
    <div>
      <FavedIssuesContext.Provider value={{userFavedIssues}}>
        {props.children}
      </FavedIssuesContext.Provider>
    </div>
  )
}
