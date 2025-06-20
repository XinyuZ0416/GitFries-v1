import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import IssueDetails from '../components/IssueDetails'; 
import { AccountContext } from '../components/Account'; 

jest.mock('axios')
jest.mock('../components/AddComment', () => () => <div>AddComment Component</div>)
jest.mock('../components/Comment', () => () => <div>Comment Component</div>)

describe('IssueDetails Component', () => {
  const mockIssue = {
    _id: '12345',
    userID: 'user123',
    username: 'testuser',
    title: 'Test Issue',
    description: 'This is a test issue description',
    language: 'JavaScript',
    customLanguage: '',
    difficulty: 'easy',
    time: '2023-07-04T12:00:00',
    issueURL: 'http://example.com',
    isUrgent: true
  }

  const mockUserID = 'user123'
  const mockUsername = 'testuser'
  const mockProfileImg = 'https://example.com/profile.jpg'

  const mockContextValue = {
    getCurrentUserId: jest.fn().mockResolvedValue(mockUserID)
  }

  beforeEach(() => {
    jest.clearAllMocks()

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/comments/')) {
        return Promise.resolve({ data: [] })
      } else if (url.includes('/api/userByID/')) {
        return Promise.resolve({ data: [{ username: mockUsername, profileImageUrl: mockProfileImg }] })
      } else if (url.includes('/api/issuefavedby/')) {
        return Promise.resolve({ data: { favoritedBy: [] } })
      }
      return Promise.reject(new Error('not found'))
    })
  })

  test('renders IssueDetails component', async () => {
    render(
      <MemoryRouter>
        <AccountContext.Provider value={mockContextValue}>
          <IssueDetails issue={mockIssue} formatTime={(time) => time} />
        </AccountContext.Provider>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Issue')).toBeInTheDocument()
      expect(screen.getByText('testuser')).toBeInTheDocument()
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      expect(screen.getByText('easy')).toBeInTheDocument()
      expect(screen.getByText('This is a test issue description')).toBeInTheDocument()
      expect(screen.getByText('AddComment Component')).toBeInTheDocument()
      expect(screen.getByText('Comment Component')).toBeInTheDocument()
    })
  })

  test('deletes an issue', async () => {
    window.confirm = jest.fn(() => true)

    render(
      <MemoryRouter>
        <AccountContext.Provider value={mockContextValue}>
          <IssueDetails issue={mockIssue} formatTime={(time) => time} />
        </AccountContext.Provider>
      </MemoryRouter>
    )

    const deleteIcon = await screen.findByAltText('delete icon')
    fireEvent.click(deleteIcon)

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`/api/comments/${mockIssue._id}`)
      expect(axios.put).toHaveBeenCalledWith(`/api/userpostremove/${mockUserID}`, { userID: mockUserID, issueID: mockIssue._id })
      expect(axios.delete).toHaveBeenCalledWith(`/api/issue/delete/${mockIssue._id}`)
      expect(axios.delete).toHaveBeenCalledWith(`/api/comments/delete/${mockIssue._id}`)
    })
  })
})
