import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { ThemeProvider, useTheme } from '@/context/theme-context'

function TestComponent() {
  const { theme, toggleTheme, animateSpin } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="animate">{String(animateSpin)}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('provides light theme by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme').textContent).toBe('light')
  })

  it('toggles theme on button click', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await user.click(screen.getByText('Toggle'))
    expect(screen.getByTestId('theme').textContent).toBe('dark')
  })

  it('toggles back to light on second click', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await user.click(screen.getByText('Toggle'))
    await user.click(screen.getByText('Toggle'))
    expect(screen.getByTestId('theme').textContent).toBe('light')
  })

  it('sets animateSpin to true on toggle', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('animate').textContent).toBe('false')
    await user.click(screen.getByText('Toggle'))
    expect(screen.getByTestId('animate').textContent).toBe('true')
  })

  it('saves theme to localStorage', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await user.click(screen.getByText('Toggle'))
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('updates data-theme attribute on document', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await user.click(screen.getByText('Toggle'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
