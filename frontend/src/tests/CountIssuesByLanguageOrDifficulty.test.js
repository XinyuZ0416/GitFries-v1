import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import CountIssuesByLanguageOrDifficulty from '../components/CountIssuesByLanguageOrDifficulty';

jest.mock('axios')

const mockData = [
  { language: 'JavaScript', count: 10 },
  { language: 'Python', count: 20 },
  { language: 'Java', count: 15 },
]

describe('CountIssuesByLanguageOrDifficulty Component', () => {
  test('renders the component', async () => {
    axios.get.mockResolvedValueOnce({ data: mockData })

    render(
      <CountIssuesByLanguageOrDifficulty
        countBy="language"
        header="Issues Posted By Language"
        name="language"
      />
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
