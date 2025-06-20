import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import CountIssuesByUserAndLanguageOrDifficulty from '../components/CountIssuesByUserAndLanguageOrDifficulty';

describe('CountIssuesByUserAndLanguageOrDifficulty Component', () => {
  const emptyCurrentUserIssues = []

  test('renders component', () => {
    render(
      <CountIssuesByUserAndLanguageOrDifficulty currentUserIssues={emptyCurrentUserIssues} />
    )

    expect(screen.getByText('Issues Posted By Difficulty')).toBeInTheDocument()
    expect(screen.getByText('Issues Posted By Language')).toBeInTheDocument()
    expect(screen.getAllByText('No Data')).toHaveLength(2)
  })
})