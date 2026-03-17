import { it, expect } from 'vitest'
import { parseInitOptionsFromQuery } from '../src/init.js'

it('parseInitOptionsFromQuery recognizes navigationPage query param', () => {
  const out = parseInitOptionsFromQuery('?navigationPage=my_nav.md')
  expect(out.navigationPage).toBe('my_nav.md')
})

it('parseInitOptionsFromQuery reads navigationPage from location.search', () => {
  const orig = window.location.href
  try {
    history.pushState({}, '', '?navigationPage=param_nav.md')
    const out = parseInitOptionsFromQuery()
    expect(out.navigationPage).toBe('param_nav.md')
  } finally {
    history.pushState({}, '', orig)
  }
})
