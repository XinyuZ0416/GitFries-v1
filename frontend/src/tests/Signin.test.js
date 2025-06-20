import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Signin from '../pages/Signin';
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { AccountContext } from '../components/Account';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

jest.mock('axios')

const mockAuthenticate = jest.fn()
const mockGetCurrentUserId = jest.fn().mockResolvedValue('36724244-9021-7047-63fa-7edfae8051b0')
const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

global.alert = jest.fn()

describe('signin component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderComponents = () => {
    render( <MemoryRouter>
      <AccountContext.Provider value={{ authenticate: mockAuthenticate, getCurrentUserId: mockGetCurrentUserId }}>
        <Signin />
      </AccountContext.Provider>
    </MemoryRouter>)
  }

  test('renders signin form', () => {
    renderComponents()
    
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /sign in/i})).toBeInTheDocument()
  })

  test('submits signin form and navigate to correct page', async() => {    
    
    renderComponents()
    
    fireEvent.change(screen.getByLabelText(/Email/i), {target:{value:'1958281799@qq.com'}})
    fireEvent.change(screen.getByLabelText(/Password/i), {target:{value:'Zxy980416_'}})
    fireEvent.click(screen.getByRole('button', {name: /sign in/i}))


    await act(async () => { //async bc the next mockGetCurrentUserId depends on the result from mockAuthenticate()
      expect(mockAuthenticate).toHaveBeenCalledWith('1958281799@qq.com', 'Zxy980416_')
    })

    await act(async () => { 
      expect(mockGetCurrentUserId).toHaveBeenCalled()
    })

    await act(async () => { 
      expect(axios.get).toHaveBeenCalledWith('/api/userByID/36724244-9021-7047-63fa-7edfae8051b0')
    })
  })
})


