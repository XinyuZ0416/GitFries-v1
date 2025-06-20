import React, {useEffect, useState, useRef, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import FilterPanel from '../components/FilterPanel'
import IssuesSidebar from '../components/IssuesSidebar'
import IssueDetails from '../components/IssueDetails'
import { AccountContext } from '../components/Account'
import { TimeFormatContext } from '../components/TimeFormat'

export default function Issues(){
  const [issues, setIssues] = useState([])
  const [selectedIssue, setSelectedIssue] = useState('')
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [isFilterSubmited, setIsFilterSubmited] = useState(false)
  const [search, setSearch] = useState('')
  const [filterSelections, setFilterSelections] = useState({language: '', difficulty: '', isUrgent: false})
  const [filteredIssues, setFilteredIssues] = useState([])
  const filterPanelRef = useRef(null)
  const [isFaved, setIsFaved] = useState(false)
  const [isViewingFavs, setIsViewingFavs] = useState(false)
  const [userFavedIssues, setUserFavedIssues] = useState([])
  const navigate = useNavigate()
  const { getCurrentUserId } = useContext(AccountContext)
  const { formatTime } = useContext(TimeFormatContext)
  const [userID, setuserID] = useState('')
  
  // get issues and current user's username
  useEffect(() => {
    const fetchIssues = async() => {
      try{
        const response = await axios.get('/api/issues')
        setIssues(response.data)

        const userID = await getCurrentUserId()
        console.log(userID)
        if(userID){
          setuserID(userID)
        }
      }catch(err){
        console.log(err)
      }
    }
    fetchIssues()
  }, [getCurrentUserId])

  
  // get sleceted issue detail
  const getIssueDetail = (issue) => {
    setSelectedIssue(issue)
  }

  // find issues based on search input
  const foundIssues = (isFilterSubmited ? filteredIssues : issues).filter((issue) => {
    return search.toLowerCase() === '' ?
      true :
      issue.title.toLowerCase().includes(search.toLowerCase()) || issue.description.toLowerCase().includes(search.toLowerCase())
  })

  // handle filter panel selections
  const handleFilterSelections = (newSelections) => {
    setFilterSelections(newSelections)
  }
  
  // handle the click on filter button
  const handleFilterClick = () => {
    setIsFilterPanelOpen(prevIsFilterPanelOpen => !prevIsFilterPanelOpen)
  }

  // handle the click on filter panel submit button 
  const handleFilterSubmit = async(e) => {
    e.preventDefault()

    // check if filter is empty
    const isFilterEmpty = (filterSelections.language === '' && 
                           filterSelections.difficulty === '' && 
                           filterSelections.isUrgent === false)
    if(!isFilterEmpty){
      handleFilterClick()
      setIsFilterSubmited(true)

      try{
        const response = await axios.get('/api/issues/filter',{params: filterSelections})
        setFilteredIssues(response.data)
      }catch(err){
        alert(err.response.data)
        navigate('issues')
      }
    }

    
  }

  // handle the click on filter panel reset button 
  const handleFilterReset = (e) => {
    e.preventDefault()

    const resetSelections = { language: '', difficulty: '', isUrgent: null };
    setFilterSelections(resetSelections)
    setIsFilterSubmited(false)
    setFilteredIssues([])
  }

  // click outside filter panel to close filter panel
  useEffect(() => {
    const handleClickOutsideFilterPanel = (e) => {
      if(filterPanelRef.current && !filterPanelRef.current.contains(e.target)){
        setIsFilterPanelOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutsideFilterPanel)

    // cleanup func
    return() => {
      document.removeEventListener('mousedown', handleClickOutsideFilterPanel)
    }
  }, [filterPanelRef])

  // handle click on fav btn
  const handleFavIssue = async(issue, childIsFaved) => {
    setSelectedIssue(issue)
    setIsFaved(childIsFaved)

    if(childIsFaved){
      addFavIssue(issue)
    }else{
      removeFavIssue(issue)
    }
    
    return childIsFaved
  }

  // handle add fav issue action
  const addFavIssue = async(issue) => {
    try{
      const userID = await getCurrentUserId()

      if(!userID){
        navigate('/signin')
        return
      }
    
      // add user favs
      await axios.put(`/api/userfavsadd/${userID}`,{
        userID: userID,
        issueID: issue._id
      })
      console.log('user fav added')

      // update issue fav field
      await axios.put(`/api/issues/${issue._id}/favorite`,{
        userID: userID
      })
      console.log('issue fav field updated')
    }catch(err){
      console.log(err)
    }
  }

  // handle remove fav issue action
  const removeFavIssue = async(issue) => {
    try{
      const userID = await getCurrentUserId()

      if(!userID){
        alert('Please sign in to favorite issues')
        return
      }
    
      // remove user favs
      await axios.put(`/api/userfavsremove/${userID}`,{
        userID: userID,
        issueID: issue._id
      })
      console.log('user fav removed')

      // update issue fav field
      await axios.put(`/api/issues/${issue._id}/favorite`,{
        userID: userID
      })
      console.log('issue fav field updated')
    }catch(err){
      console.log(err)
    }
  }

  // handle the click on fav btn next to filter
  const handleViewFavs = () => {
    setIsViewingFavs(prevIsViewingFavs => {
      const newIsViewingFavs = !prevIsViewingFavs
      if (newIsViewingFavs) {
        fetchFavedIssues()
      }
      return newIsViewingFavs
    })
  }

  // get user faved issues
  const fetchFavedIssues = async() => {
    try{
      const userID = await getCurrentUserId()
      if(userID){
        const favResponse = await axios.get(`/api/userfavs/${userID}`)
        setUserFavedIssues(favResponse.data)
      }else{
        console.log('user not signed in')
      }
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className='issues-container'>
      <div className='issues-top-sec'>
        {/* filter */}
        {isViewingFavs? 
          <div className='issues-fav-back-filter'>
            <button 
              className='fav-back-btn'
              onClick={(prevIsViewingFavs) => setIsViewingFavs(!prevIsViewingFavs)}
            >
              Back
            </button>
            <img 
              className='view-fav'
              src='images/faved-issues.png'
              alt='viewing faved issues'
            />
          </div>:
          <div className='issues-fav-back-filter'>
            <img 
              className='faved-issues-icon' 
              src='/images/full-fries.png' 
              alt='favorited issues icon' 
              onClick={handleViewFavs}
            />
            <div className='filter-container'>
              <button 
                className='filter-btn'
                onClick={handleFilterClick} 
              >
              Filter
            </button>
              {isFilterPanelOpen &&  
                (<div ref={filterPanelRef}>
                  <FilterPanel 
                    onSelectionsChange={handleFilterSelections} 
                    onSubmit={handleFilterSubmit} 
                    onReset={handleFilterReset} 
                    filterSelections={filterSelections}
                  />
                </div>)}
            </div>
          </div>
        }

        {/* search */}
        {isViewingFavs? 
          '':
          <input 
            className='searchbar'
            type='text' 
            placeholder='I am looking for..' 
            onChange={(e) => setSearch(e.target.value)} />
        }

        {/* post */}
        {isViewingFavs? 
          '':
          <Link to='/post-issues'>
            <img src='/images/add.png' id='post-issues-icon' alt='post issues icon' />
          </Link>
        }
       
      </div>

      <div className='issues-page-flex'>
        <div className='issues-page-sections' style={{whiteSpace:'pre-line'}}> 
          {/* issue sidebar */}
          <div className='issues-sidebar'>
          {isViewingFavs? 
            // if user is viewing faved issues, show faved issues
            !userID? 
              <h2 className='fav-issue-signin'>Please <Link to='/signin'>sign in</Link> to view favorited issues</h2>: // if no userID, ask them to login
              userFavedIssues.length === 0? 
                'No faved issue':
                userFavedIssues.map(issue => (
                  <IssuesSidebar 
                    key={issue._id} 
                    issue={issue} 
                    getIssueDetail={getIssueDetail} 
                    formatTime={formatTime}
                    handleFavIssue={handleFavIssue}
                    isFaved={isFaved} 
                    />
            )):
            // otherwise show found issues
            foundIssues.length === 0 ? 
              <p>No results found</p> : 
              foundIssues.map(issue => (
                <IssuesSidebar 
                  key={issue._id} 
                  issue={issue} 
                  getIssueDetail={getIssueDetail} 
                  formatTime={formatTime}
                  handleFavIssue={handleFavIssue}
                  isFaved={isFaved} 
                />
              ))
          }
          </div>

          {/* issue details */}
          {/**
           * when user is viewing faved issues, 
           * if he selected issue, display the selected issue detail, otherwise display the 1st in faved issues */ 
          isViewingFavs? 
            (userFavedIssues.length === 0? 
              '':
              (selectedIssue? 
                <IssueDetails 
                  issue={selectedIssue} 
                  formatTime={formatTime} 
                />:
                userFavedIssues.length === 0 ? '':
                  <IssueDetails 
                    issue={userFavedIssues[0]} 
                    formatTime={formatTime} 
                  />)):
          /**
           * when user is NOT viewing faved issues, 
           * if he selected issue, display the selected issue detail, otherwise display the 1st in found issues */ 
            (selectedIssue? 
              <IssueDetails 
                issue={selectedIssue} 
                formatTime={formatTime}
              />:
              (foundIssues.length === 0? '': 
                <IssueDetails 
                  issue={foundIssues[0]} 
                  formatTime={formatTime} 
                />))
          }
        </div>
      </div>
    </div>
  )
}
  