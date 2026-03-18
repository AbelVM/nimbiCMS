import { test, expect, vi } from 'vitest'
import { scrollToAnchorOrTop } from '../src/htmlBuilder.js'

test('scrollToAnchorOrTop scrolls to top when anchor is null', () => {
  const scrollSpy = vi.spyOn(window, 'scrollTo')
  scrollToAnchorOrTop(null)
  expect(scrollSpy).toHaveBeenCalled()
  scrollSpy.mockRestore()
})

test('scrollToAnchorOrTop scrolls to element when anchor provided', async () => {
  const el = document.createElement('div')
  el.id = 'my-anchor'
  // provide a simple implementation for scrollIntoView
  el.scrollIntoView = vi.fn()
  document.body.appendChild(el)
  scrollToAnchorOrTop('my-anchor')
  // the function schedules the actual scroll via requestAnimationFrame/setTimeout
  await new Promise(resolve => setTimeout(resolve, 80))
  expect(el.scrollIntoView).toHaveBeenCalled()
  document.body.removeChild(el)
})
