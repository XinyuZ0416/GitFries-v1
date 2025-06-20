import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FilterPanel from '../components/FilterPanel';

describe('FilterPanel Component', () => {
  const mockOnSelectionsChange = jest.fn()
  const mockOnSubmit = jest.fn()
  const mockOnReset = jest.fn()
  const filterSelections = { language: 'JavaScript', difficulty: 'Easy', isUrgent: true }

  test('renders the FilterPanel component with given props', () => {
    render(
      <FilterPanel
        onSelectionsChange={mockOnSelectionsChange}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        filterSelections={filterSelections}
      />
    )

    expect(screen.getByText('Select One or Multiple')).toBeInTheDocument()
    expect(screen.getByLabelText('Is it urgent?')).toBeChecked()
    expect(screen.getByText(/JavaScript/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue('Easy')).toBeInTheDocument()
  })

  test('calls onSubmit when submit button is clicked', () => {
    render(
      <FilterPanel
        onSelectionsChange={mockOnSelectionsChange}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        filterSelections={filterSelections}
      />
    )

    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  test('calls onReset when reset button is clicked', () => {
    render(
      <FilterPanel
        onSelectionsChange={mockOnSelectionsChange}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        filterSelections={filterSelections}
      />
    )

    const resetButton = screen.getByText('Reset')
    fireEvent.click(resetButton)

    expect(mockOnReset).toHaveBeenCalled()
  })
})



