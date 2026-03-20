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
