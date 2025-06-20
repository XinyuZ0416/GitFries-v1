import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter} from 'react-router-dom'
import { AccountContext } from '../components/Account';
import { act } from 'react-dom/test-utils';
import UserMenu from '../components/UserMenu';

jest.mock('axios')

const mockAuthenticate = jest.fn();
const mockNavigate = jest.fn();
const mockFormatTime = jest.fn((time) => `Formatted: ${time}`);

describe('usermenu component', () => {
  const mockGetCurrentUserId = jest.fn().mockResolvedValue('36724244-9021-7047-63fa-7edfae8051b0')
  const mockGetSession = jest.fn().mockResolvedValue('36724244-9021-7047-63fa-7edfae8051b0')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderComponents = () => {
    render(<MemoryRouter>
      <AccountContext.Provider value={{ authenticate: mockAuthenticate, getCurrentUserId: mockGetCurrentUserId, getSession: mockGetSession}}>
        <UserMenu />
      </AccountContext.Provider>
    </MemoryRouter>)
  }

  test('render profile pic', async() => {
    await act(async() => {
      renderComponents()
    })

    expect(screen.getByAltText(/me icon/i)).toBeInTheDocument()
  })

  test('click profile pic to show sign-out btn', async() => {
    await act(async() => {
      renderComponents()
    })

    fireEvent.click(screen.getByAltText(/me icon/i))
    expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Profile/i })).toBeInTheDocument()
  })

  test('click sign-out btn and profile btn', async() => {
    await act(async() => {
      renderComponents()
    })

    fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }))
    fireEvent.click(screen.getByRole('button', { name: /Profile/i }))
  })
})