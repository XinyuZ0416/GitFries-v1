import React, { createContext } from 'react'
import moment from 'moment-timezone'

export const TimeFormatContext = createContext()

export default function TimeFormat(props) {

  // based on user timezone, format issue creation time
  const formatTime = (time) => {
    const userTimeZone = moment.tz.guess() // guess user timezone
    const now = moment().tz(userTimeZone) // get current time in user timezone
    const issueTime = moment(time).tz(userTimeZone) // convert given time to user timezone

    if (issueTime.isSame(now, 'day')) {
      return 'Today';
    } else if (issueTime.isSame(now.clone().subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    } else {
      return issueTime.format('MMMM D, YYYY');
    }
  }

  return (
    <TimeFormatContext.Provider value={{formatTime}}>
      {props.children}
    </TimeFormatContext.Provider>
  )
}
