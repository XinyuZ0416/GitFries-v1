import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { AccountContext } from '../components/Account';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import Issues from '../pages/Issues';
import Dashboard from '../pages/Dashboard';
import { TimeFormatContext } from '../components/TimeFormat';

jest.mock('axios')

const mockAuthenticate = jest.fn();
const mockNavigate = jest.fn();
const mockFormatTime = jest.fn((time) => `Formatted: ${time}`);

describe('navbar component', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders navbar elements without userId', async() => {
    const mockGetCurrentUserId = jest.fn().mockResolvedValue('')
    const mockGetSession = jest.fn().mockResolvedValue({
      idToken: {
        payload: {
          sub: '',
        },
      },
    })

    await act(async() => {
      render(<MemoryRouter>
                <AccountContext.Provider value={{ authenticate: mockAuthenticate, getCurrentUserId: mockGetCurrentUserId, getSession: mockGetSession}}>
                  <Navbar />
                </AccountContext.Provider>
              </MemoryRouter>)
    })

    expect(screen.getByAltText('web-icon')).toBeInTheDocument()
    expect(screen.getByAltText('web-name')).toBeInTheDocument()
    expect(screen.getByText(/Issues/i)).toBeInTheDocument()
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
  })

  test('renders navbar elements with userId and new notification', async() => {
    const mockGetCurrentUserId = jest.fn().mockResolvedValue('36724244-9021-7047-63fa-7edfae8051b0')
    const mockGetSession = jest.fn().mockResolvedValue({
      idToken: {
        payload: {
          sub: '36724244-9021-7047-63fa-7edfae8051b0',
        },
      },
    })

    axios.get.mockImplementation((url) => {
      if(url === '/api/userByID/36724244-9021-7047-63fa-7edfae8051b0'){
        return Promise.resolve({
          data:[{
            profileImageUrl: 'https://example.com/profile.jpg'
          }]
        })
      }else if(url === '/api/unreadNotifications/36724244-9021-7047-63fa-7edfae8051b0'){
        return Promise.resolve({
          data:[{
            _id:'123',
            message: 'New Notification'
          }]
        })
      }
      return Promise.reject(new Error('Not found'))
    })

    await act(async() => {
      render(<MemoryRouter>
                <AccountContext.Provider value={{ authenticate: mockAuthenticate, getCurrentUserId: mockGetCurrentUserId, getSession: mockGetSession}}>
                  <Navbar />
                </AccountContext.Provider>
              </MemoryRouter>)
    })

    expect(screen.getByAltText('web-icon')).toBeInTheDocument()
    expect(screen.getByAltText('web-name')).toBeInTheDocument()
    expect(screen.getByText(/Issues/i)).toBeInTheDocument()
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
  })

  test('renders navbar elements with userId and no notification', async() => {
    const mockGetCurrentUserId = jest.fn().mockResolvedValue('36724244-9021-7047-63fa-7edfae8051b0')
    const mockGetSession = jest.fn().mockResolvedValue({
      idToken: {
        payload: {
          sub: '36724244-9021-7047-63fa-7edfae8051b0',
        },
      },
    })

    axios.get.mockImplementation((url) => {
      if(url === '/api/userByID/36724244-9021-7047-63fa-7edfae8051b0'){
        return Promise.resolve({
          data:[{
            profileImageUrl: 'https://example.com/profile.jpg'
          }]
        })
      }else if(url === '/api/unreadNotifications/36724244-9021-7047-63fa-7edfae8051b0'){
        return Promise.resolve({
          data:[{}]
        })
      }
      return Promise.reject(new Error('Not found'))
    })

    await act(async() => {
      render(<MemoryRouter>
                <AccountContext.Provider value={{ authenticate: mockAuthenticate, getCurrentUserId: mockGetCurrentUserId, getSession: mockGetSession}}>
                  <Navbar />
                </AccountContext.Provider>
              </MemoryRouter>)
    })

    expect(screen.getByAltText('web-icon')).toBeInTheDocument()
    expect(screen.getByAltText('web-name')).toBeInTheDocument()
    expect(screen.getByText(/Issues/i)).toBeInTheDocument()
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
  })

  test('click on issue tab and dashboard tab to navigate', async() => {
    const mockGetCurrentUserId = jest.fn().mockResolvedValue('')
    const mockGetSession = jest.fn().mockResolvedValue({
      idToken: {
        payload: {
          sub: '',
        },
      },
    })

   await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <AccountContext.Provider value={{ authenticate: mockAuthenticate, getCurrentUserId: mockGetCurrentUserId, getSession: mockGetSession }}>
            <TimeFormatContext.Provider value={{ formatTime: mockFormatTime }}>
              <div className='App'>
                <Navbar />
                <Routes>
                  <Route path="/" element={<div>Home Page</div>} />
                  <Route path="/issues" element={<Issues />} />
                  <Route path='/dashboard' element={<Dashboard />} />
                </Routes>
              </div>
            </TimeFormatContext.Provider>
          </AccountContext.Provider>
        </MemoryRouter>
      )
    })

    fireEvent.click(screen.getByText(/issues/i))
    expect(screen.getByRole('button', {name:/Filter/i})).toBeInTheDocument()
    
    fireEvent.click(screen.getByText(/dashboard/i))
    expect(screen.getByText(/Personal metrics/i)).toBeInTheDocument()
  })
})