import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Signup from '../pages/Signup';
import { MemoryRouter } from 'react-router-dom';
import Account from '../components/Account';

beforeAll(() => {
  global.alert = jest.fn();
})

test('renders signup form', async() => {
  render( <MemoryRouter>
            <Account>
              <Signup />
            </Account>
          </MemoryRouter>)
  
  expect(screen.getByLabelText(/UserName/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
})

test('handles signup submission', () => {
  render( <MemoryRouter>
            <Account>
              <Signup />
            </Account>
          </MemoryRouter>)

  fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'testuser'}})
  fireEvent.change(screen.getByLabelText(/email/i), {target: {value: 'testuser@gmail.com'}})
  fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'Abc123456_'}})
  fireEvent.click(screen.getByText(/sign up/i))
})