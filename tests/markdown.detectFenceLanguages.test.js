import { it, expect } from 'vitest'
import { detectFenceLanguages } from '../src/markdown.js'
import { HLJS_ALIAS_MAP, BAD_LANGUAGES } from '../src/codeblocksManager.js'

it('detectFenceLanguages finds explicit fenced languages', () => {
  const md = '```javascript\nconsole.log(1)\n```\n```python\nprint(1)\n```'
  const set = detectFenceLanguages(md)
  expect(set.has('javascript')).toBe(true)
  expect(set.has('python')).toBe(true)
})

it('detectFenceLanguages ignores BAD_LANGUAGES', () => {
  const bad = Array.from(BAD_LANGUAGES)[0] || 'magic'
  const md = `\`\`\`${bad}\nfoo\n\`\`\``
  const set = detectFenceLanguages(md)
  expect(set.has(bad)).toBe(false)
})

it('detectFenceLanguages respects supportedMap size and alias mapping', () => {
  // short name 'js' should be skipped when supportedMap has entries but lacks js
  const mdShort = '```js\nalert(1)\n```'
  const map = new Map([['javascript','javascript']])
  const res1 = detectFenceLanguages(mdShort, map)
  // because map has size and does not contain 'js' as key, and alias map maps 'js'->'javascript',
  // the code should map to 'javascript' only if supportedMap has the mapped name
  expect(res1.has('js')).toBe(false)
  expect(res1.has('javascript')).toBe(true)

  // unknown short name not in alias map and too short should be skipped
  const map2 = new Map([['python','python']])
  const res2 = detectFenceLanguages('```sh\necho hi\n```', map2)
  expect(res2.has('sh')).toBe(false)
})

it('detectFenceLanguages accepts long valid names and rejects STOP words', () => {
  const md = '```superlang\ncode\n```\n```then\nno\n```'
  const set = detectFenceLanguages(md)
  expect(set.has('superlang')).toBe(true)
  expect(set.has('then')).toBe(false)
})
