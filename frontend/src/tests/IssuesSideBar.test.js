import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import IssuesSidebar from '../components/IssuesSidebar';
import { AccountContext } from '../components/Account';

jest.mock('axios')

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const mockIssue = {
  _id: 'issue-id-1',
  title: 'Sample Issue',
  language: 'JavaScript',
  customLanguage: '',
  difficulty: 'easy',
  isUrgent: true,
  userID: 'user-id-1',
  username: 'sampleuser',
  time: '2024-07-03T10:00:00Z',
}
const mockProfileImg = 'https://example.com/profile.jpg'
const mockGetIssueDetail = jest.fn()
const mockFormatTime = jest.fn().mockReturnValue('July 3, 2024')
const mockHandleFavIssue = jest.fn()
const mockIsFaved = false
const mockGetCurrentUserId = jest.fn().mockResolvedValue('user-id-2')

describe('IssuesSidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders issue details and handles favoriting', async () => {
    axios.get.mockImplementation((url) => {
      if (url === '/api/userByID/user-id-1') {
        return Promise.resolve({ data: [{ profileImageUrl: mockProfileImg }] });
      }
      if (url === '/api/userfavs/user-id-2') {
        return Promise.resolve({ data: [{ _id: 'issue-id-1' }] })
      }
      return Promise.reject(new Error('not found'))
    })

    render(
      <MemoryRouter>
        <AccountContext.Provider value={{ getCurrentUserId: mockGetCurrentUserId }}>
          <IssuesSidebar
            issue={mockIssue}
            getIssueDetail={mockGetIssueDetail}
            formatTime={mockFormatTime}
            handleFavIssue={mockHandleFavIssue}
            isFaved={mockIsFaved}
          />
        </AccountContext.Provider>
      </MemoryRouter>
    )

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/api/userByID/user-id-1'))

    expect(screen.getByText('Sample Issue')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('easy')).toBeInTheDocument();
    expect(screen.getByText('July 3, 2024')).toBeInTheDocument();
    expect(screen.getByAltText('profile icon')).toHaveAttribute('src', mockProfileImg)
    expect(screen.getByAltText('favorited')).toBeInTheDocument()
    fireEvent.click(screen.getByAltText('favorited'))
    expect(mockHandleFavIssue).toHaveBeenCalled()
  })

  test('displays unfavorited state if user is not signed in', async () => {
    mockGetCurrentUserId.mockResolvedValue(null)

    render(
      <MemoryRouter>
        <AccountContext.Provider value={{ getCurrentUserId: mockGetCurrentUserId }}>
          <IssuesSidebar
            issue={mockIssue}
            getIssueDetail={mockGetIssueDetail}
            formatTime={mockFormatTime}
            handleFavIssue={mockHandleFavIssue}
            isFaved={mockIsFaved}
          />
        </AccountContext.Provider>
      </MemoryRouter>
    )

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/api/userByID/user-id-1'))
    expect(screen.getByAltText('not favorited')).toBeInTheDocument()
  })
})
