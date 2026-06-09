import { describe, it, expect } from 'vitest'
import { roastLevelOptions } from '@/constants/roastLevelOptions'

describe('roastLevelOptions', () => {
  it('has three roast levels', () => {
    expect(roastLevelOptions).toHaveLength(3)
  })

  it('contains Light, Medium, Dark with correct values', () => {
    expect(roastLevelOptions).toEqual([
      { label: 'Light', value: 'LIGHT' },
      { label: 'Medium', value: 'MEDIUM' },
      { label: 'Dark', value: 'DARK' },
    ])
  })
})
