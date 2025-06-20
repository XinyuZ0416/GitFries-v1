import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import CountIssuesByTime from '../components/CountIssuesByTime';

jest.mock('axios')

describe('CountIssuesByTime Component', () => {
  test('renders', async () => {
    axios.get.mockImplementationOnce(() => new Promise(() => {}))

    render(<CountIssuesByTime />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})