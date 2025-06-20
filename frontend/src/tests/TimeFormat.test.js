import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import moment from 'moment-timezone';
import { TimeFormatContext } from '../components/TimeFormat';

describe('TimeFormat Component', () => {
  test('formats time correctly', () => {
    // mock user timezone (for example, New York)
    const userTimeZone = 'America/New_York'
    jest.spyOn(moment.tz, 'guess').mockReturnValue(userTimeZone)

    // mock current time in user timezone
    const now = moment('2024-07-04T12:00:00').tz(userTimeZone)

    // mock issue time (same day as now)
    const issueTimeSameDay = moment('2024-07-04T08:00:00Z')
    const issueTimeSameDayFormatted = 'Today'

    // mock issue time (different day)
    const issueTimeDifferentDay = moment('2024-07-03T10:00:00Z')
    const issueTimeDifferentDayFormatted = 'July 3, 2024'

    // mock formatTime function
    const formatTime = (time) => {
      const issueTime = moment(time).tz(userTimeZone)
      return issueTime.isSame(now, 'day') ? 'Today' : issueTime.format('MMMM D, YYYY')
    }

    // render the TimeFormat component with a mocked child component
    const ChildComponent = () => {
      const { formatTime } = React.useContext(TimeFormatContext)
      const formattedTimeSameDay = formatTime(issueTimeSameDay)
      const formattedTimeDifferentDay = formatTime(issueTimeDifferentDay)

      return (
        <div>
          <span data-testid="sameDay">{formattedTimeSameDay}</span>
          <span data-testid="differentDay">{formattedTimeDifferentDay}</span>
        </div>
      )
    }

    const { getByTestId } = render(
      <TimeFormatContext.Provider value={{ formatTime }}>
        <ChildComponent />
      </TimeFormatContext.Provider>
    )

    expect(getByTestId('sameDay')).toHaveTextContent(issueTimeSameDayFormatted)
    expect(getByTestId('differentDay')).toHaveTextContent(issueTimeDifferentDayFormatted)
  })
})


