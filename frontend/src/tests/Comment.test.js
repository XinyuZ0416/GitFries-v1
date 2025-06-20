import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import Comment from '../components/Comment';
import { TimeFormatContext } from '../components/TimeFormat'; // Import from the original definition
import { mockTimeFormatContext } from '../mocks/TimeFormatContext'; // Adjust path as needed
import { AccountContext } from '../components/Account';

jest.mock('axios');
const mockAuthenticate = jest.fn()
const mockGetCurrentUserId = jest.fn().mockResolvedValue('36724244-9021-7047-63fa-7edfae8051b0')
const mockNavigate = jest.fn()

describe('Comment Component', () => {
  const mockComments = [
    {
      _id: 'comment1',
      userID: 'user124',
      username: 'john',
      issueID: 'issue1',
      content: 'This is a comment.',
      time: new Date('2024-07-03T10:00:00Z'),
      parentCommentID: null,
      nestedComments: []
    }
  ];

  const mockProps = {
    comments: mockComments,
    currentUserID: 'user123',
    currentUsername: 'john_doe',
    issueID: 'issue1',
    issue: {
      _id: 'issue1',
      userID: 'user123',
      username: 'john_doe',
      issueURL: 'https://github.com/Homebrew/brew/issues/17013',
      title: 'Sample Issue 1',
      description: 'This is a sample issue description.',
      language: 'JavaScript',
      customLanguage: 'TypeScript',
      difficulty: 'Easy',
      isUrgent: false,
      time: new Date('2024-07-03T09:00:00Z'),
      favoritedBy: ['user456', 'user789'],
      commentIDs: ['comment1', 'comment2']
    },
    onCommentsUpdate: jest.fn()
  };

  const mockAccountContext = {
    authenticate: mockAuthenticate,
    getCurrentUserId: mockGetCurrentUserId,
    navigate: mockNavigate,
  };

  beforeEach(() => {
    // Mock axios response for profile image fetch
    axios.get.mockImplementation((url) => {
      if (url === `/api/userByID/user123`) {
        return Promise.resolve({
          status: 200,
          data: [{ profileImageUrl: '/mock-profile.jpg' }]
        });
      }
      return Promise.reject(new Error('Invalid URL'));
    });
  })

  test('navigates to user profile', async () => {
    render(
      <MemoryRouter>
        <AccountContext.Provider value={mockAccountContext}>
          <TimeFormatContext.Provider value={mockTimeFormatContext}>
            <Comment {...mockProps} />
          </TimeFormatContext.Provider>
        </AccountContext.Provider>
      </MemoryRouter>
    );

    await screen.findByText(/john/i);

    fireEvent.click(screen.getByText(/john/i));
  });

  test('renders user comments', async () => {
    render(
      <MemoryRouter>
        <TimeFormatContext.Provider value={mockTimeFormatContext}>
          <Comment {...mockProps} />
        </TimeFormatContext.Provider>
      </MemoryRouter>
    )

    await screen.findByText(/john/i)

    mockComments.forEach(comment => {
      expect(screen.getByText(comment.username)).toBeInTheDocument();
      expect(screen.getByText(comment.content)).toBeInTheDocument();
      expect(screen.getByText(comment.time.toLocaleString())).toBeInTheDocument();
    })

    expect(screen.getByText(/john/i)).toBeInTheDocument()
  })

})

