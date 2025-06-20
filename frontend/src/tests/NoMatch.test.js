import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NoMatch from '../components/NoMatch';

describe('NoMatch Component', () => {
  test('redirects to issues page and displays message', () => {
    render(
      <MemoryRouter initialEntries={['/random-path']}>
        <NoMatch />
      </MemoryRouter>
    )

    const issuesPageLink = screen.getByRole('link', { name: /issues page/i })
    expect(issuesPageLink).toHaveAttribute('href', '/issues')

    const errorMessage = screen.getByText(/Oops! Seems like you are on the wrong track../i)
    expect(errorMessage).toBeInTheDocument()

    const redirectMessage = screen.getByText(/Redirecting you to the/i)
    expect(redirectMessage).toBeInTheDocument()
  })
})