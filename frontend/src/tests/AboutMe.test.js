import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AboutMe from '../components/AboutMe'; 

jest.mock('axios')

describe('AboutMe Component', () => {
  const mockUserID = 'user123'
  const mockCurrentUserID = 'user123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('fetches and displays initial content', async () => {
    axios.get.mockResolvedValueOnce({ data: { content: 'This is the about me content.' } })
    render(<AboutMe userID={mockUserID} currentUserID={mockCurrentUserID} />)

    expect(axios.get).toHaveBeenCalledWith(`/api/aboutme/${mockUserID}`)
    await waitFor(() => expect(screen.getByText('This is the about me content.')).toBeInTheDocument())
  })

  test('allows editing of content for the current user', async () => {
    axios.get.mockResolvedValueOnce({ data: { content: 'This is the about me content.' } })
    render(<AboutMe userID={mockUserID} currentUserID={mockCurrentUserID} />)

    await waitFor(() => expect(screen.getByText('This is the about me content.')).toBeInTheDocument())
    fireEvent.click(screen.getByAltText('edit icon'))

    const textArea = screen.getByRole('textbox')
    fireEvent.change(textArea, { target: { value: 'Updated content' } })
    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => expect(axios.put).toHaveBeenCalledWith(`/api/aboutmeupdate/${mockUserID}`, { content: 'Updated content' }))
    expect(screen.getByText('Updated content')).toBeInTheDocument();
  })

  test('displays default content if no content exists', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })
    render(<AboutMe userID={mockUserID} currentUserID={mockCurrentUserID} />)

    expect(axios.get).toHaveBeenCalledWith(`/api/aboutme/${mockUserID}`)
    await waitFor(() => expect(screen.getByText('Welcome to my GitFries page!')).toBeInTheDocument())
  })

  test('saves new content if no content exists', async () => {
    axios.get.mockResolvedValueOnce({ data: {} })
    render(<AboutMe userID={mockUserID} currentUserID={mockCurrentUserID} />)

    await waitFor(() => expect(screen.getByText('Welcome to my GitFries page!')).toBeInTheDocument())
    fireEvent.click(screen.getByAltText('edit icon'))

    const textArea = screen.getByRole('textbox')
    fireEvent.change(textArea, { target: { value: 'New about me content' } })
    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/api/aboutmecreate', {
      userID: mockUserID,
      content: 'New about me content'
    }))

    expect(screen.getByText('New about me content')).toBeInTheDocument()
  })
})