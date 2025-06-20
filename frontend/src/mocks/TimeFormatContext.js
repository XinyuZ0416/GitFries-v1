const React = require('react')

export const mockTimeFormatContext = {
  formatTime: jest.fn((time) => new Date(time).toLocaleString())
}

export const TimeFormatContext = React.createContext(mockTimeFormatContext)