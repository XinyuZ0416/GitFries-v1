import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Greeting from '../components/Greeting';

describe('Greeting Component', () => {
  const props = {
    greetingTextSrc: 'path/to/greetingText.png',
    greetingTextAlt: 'Greeting Text Alt',
    greetingText: 'Hello, World!',
    greetingFriesSrc: 'path/to/fries.png',
    greetingFriesAlt: 'Fries Alt',
    greetingTo: '/home',
    greetingBtn: 'Click Me',
  }

  test('renders the Greeting component with given props', () => {
    render(
      <MemoryRouter>
        <Greeting {...props} />
      </MemoryRouter>
    )

    const greetingTextImg = screen.getByAltText(props.greetingTextAlt)
    expect(greetingTextImg).toBeInTheDocument()
    expect(greetingTextImg).toHaveAttribute('src', props.greetingTextSrc)

    const greetingText = screen.getByText(props.greetingText)
    expect(greetingText).toBeInTheDocument()

    const greetingFriesImg = screen.getByAltText(props.greetingFriesAlt)
    expect(greetingFriesImg).toBeInTheDocument()
    expect(greetingFriesImg).toHaveAttribute('src', props.greetingFriesSrc)

    const button = screen.getByRole('button', { name: props.greetingBtn })
    expect(button).toBeInTheDocument()

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', props.greetingTo)
  })
})

