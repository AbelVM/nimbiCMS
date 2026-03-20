import { test, expect, vi } from 'vitest'
import { attachTocClickHandler } from '../src/htmlBuilder.js'

test('attachTocClickHandler pushes history and dispatches popstate for page clicks', () => {
  const toc = document.createElement('aside')
  const a = document.createElement('a')
  a.setAttribute('href', '?page=testpage#frag')
  a.textContent = 'link'
  toc.appendChild(a)

  const pushSpy = vi.spyOn(history, 'pushState')
  const dispatchSpy = vi.spyOn(window, 'dispatchEvent')

  attachTocClickHandler(toc)

  // simulate click
  const ev = new MouseEvent('click', { bubbles: true, cancelable: true })
  a.dispatchEvent(ev)

  expect(pushSpy).toHaveBeenCalled()
  // dispatchEvent called with PopStateEvent (or renderByQuery path), ensure something ran
  expect(dispatchSpy).toHaveBeenCalled()

  pushSpy.mockRestore()
  dispatchSpy.mockRestore()
})

test('attachTocClickHandler preserves anchor and no extra query params', () => {
  // ensure location has no extra params
  Object.defineProperty(globalThis, 'location', {
    value: { href: 'http://example.com/?page=test', search: '?page=test', pathname: '/', origin: 'http://example.com' },
    configurable: true
  })

  const toc = document.createElement('aside')
  const a = document.createElement('a')
  a.setAttribute('href', '?page=test#foo')
  toc.appendChild(a)

  const pushSpy = vi.spyOn(history, 'pushState')
  attachTocClickHandler(toc)
  a.click()

  expect(history.state && history.state.page).toBe('test::foo')
  expect(pushSpy).toHaveBeenCalled()
  const pushedUrl = pushSpy.mock.calls[0][2]
  expect(pushedUrl).toBe('#/test#foo')

  pushSpy.mockRestore()
})

test('attachTocClickHandler preserves anchor and keeps extra query params', () => {
  // simulate current location with extra param
  Object.defineProperty(globalThis, 'location', {
    value: { href: 'http://example.com/?lang=fr&page=test', search: '?lang=fr&page=test', pathname: '/', origin: 'http://example.com' },
    configurable: true
  })

  const toc = document.createElement('aside')
  const a = document.createElement('a')
  a.setAttribute('href', '?page=test#foo')
  toc.appendChild(a)

  const pushSpy = vi.spyOn(history, 'pushState')
  attachTocClickHandler(toc)
  a.click()

  expect(history.state && history.state.page).toBe('test::foo')
  expect(pushSpy).toHaveBeenCalled()
  const pushedUrl = pushSpy.mock.calls[0][2]
  expect(pushedUrl).toBe('#/test#foo?lang=fr')

  pushSpy.mockRestore()
})
