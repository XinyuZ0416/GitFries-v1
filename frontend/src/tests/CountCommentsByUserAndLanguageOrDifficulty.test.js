import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import CountCommentsByUserAndLanguageOrDifficulty from '../components/CountCommentsByUserAndLanguageOrDifficulty';

jest.mock('axios')

describe('CountCommentsByUserAndLanguageOrDifficulty Component', () => {
  beforeEach(() => {
    axios.get.mockReset()
  })

  test('renders component', async () => {
    render(<CountCommentsByUserAndLanguageOrDifficulty currentUserComments={[]} />)

    expect(screen.getByText(/Issues Commented On By Difficulty/i)).toBeInTheDocument()
  })
})


// npm test -- src/tests/CountCommentsByUserAndLanguageOrDifficulty.test.js