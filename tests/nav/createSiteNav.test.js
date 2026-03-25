import { describe, it, expect } from 'vitest'
import { createSiteNav } from '../../src/nav.js'

describe('nav.createSiteNav', () => {
  it('creates a nav DOM element (aside) with a home entry', () => {
    const tree = createSiteNav('/home')
    // createSiteNav returns an HTMLElement (aside) created by createNavTree
    expect(tree && typeof tree === 'object').toBe(true)
    expect(tree.nodeName && tree.nodeName.toLowerCase()).toBe('aside')
    const label = tree.querySelector('.menu-label')
    expect(label && label.textContent).toBeTruthy()
  })
})
