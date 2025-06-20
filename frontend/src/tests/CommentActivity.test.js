import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CommentActivity from '../components/CommentActivity';
import { BrowserRouter } from 'react-router-dom'; 

const mockProps = {
  userID: 'user123',
  currentUserID: 'user123',
  comments: [
    {
      _id: 'comment1',
      userID: 'user123',
      username: 'john_doe',
      issueID: 'issue1',
      content: 'This is a comment.',
      time: new Date('2024-07-03T10:00:00Z'),
      parentCommentID: null,
      nestedComments: []
    }
  ],
  issueTitles: {
    issue1: 'Issue Title 1'
  },
  issues: {
    issue1: {
      _id: 'issue1',
      userID: 'user123',
      username: 'john_doe',
      issueURL: '/issues/issue1',
      title: 'Sample Issue 1',
      description: 'This is a sample issue description.',
      language: 'JavaScript',
      customLanguage: 'TypeScript',
      difficulty: 'Easy',
      isUrgent: false,
      time: new Date('2024-07-03T09:00:00Z'),
      favoritedBy: ['user456', 'user789'],
      commentIDs: ['comment1', 'comment2']
    }
  },
  formatTime: (time) => time.toLocaleString(), 
  toggleIssueDetails: jest.fn(), 
  handleDeleteComment: jest.fn() 
}

describe('CommentActivity Component', () => {
  test('renders with comments', () => {
    render(
      <BrowserRouter>
        <CommentActivity {...mockProps} />
      </BrowserRouter>
    )

    expect(screen.getByText('Comments')).toBeInTheDocument()

    mockProps.comments.forEach(comment => {
      expect(screen.getByText(mockProps.formatTime(comment.time))).toBeInTheDocument()
      expect(screen.getByText(/Replied/i)).toBeInTheDocument()
      expect(screen.getByText(comment.content)).toBeInTheDocument()

      if (mockProps.issues[comment.issueID].isDetailsClicked) {
        expect(screen.getByText('Close')).toBeInTheDocument()
        expect(screen.getByTestId(`issue-details-${comment.issueID}`)).toBeInTheDocument()
      } else {
        expect(screen.getByText(mockProps.issueTitles[comment.issueID])).toBeInTheDocument()
        expect(screen.getByText(mockProps.issues[comment.issueID].language)).toBeInTheDocument()
        expect(screen.getByText(mockProps.issues[comment.issueID].difficulty)).toBeInTheDocument()
      }

      if (mockProps.currentUserID === mockProps.userID) {
        expect(screen.getByAltText('delete icon')).toBeInTheDocument();
      }
    })
  })

  test('renders with no comments', () => {
    render(<CommentActivity {...mockProps} comments={[]} />)

    expect(screen.getByText('No comments found')).toBeInTheDocument();
  })

  test('handles interactions', () => {
    render(
      <BrowserRouter>
        <CommentActivity {...mockProps} />
      </BrowserRouter>
    )

    // Click on issue title to toggle issue details
    fireEvent.click(screen.getByText(mockProps.issueTitles['issue1']));
    expect(mockProps.toggleIssueDetails).toHaveBeenCalledWith('issue1');

    // Click on delete icon for a comment
    if (mockProps.currentUserID === mockProps.userID) {
      fireEvent.click(screen.getByAltText('delete icon'));
      expect(mockProps.handleDeleteComment).toHaveBeenCalled();
    }
  })
})
// npm test -- src/tests/CommentActivity.test.js