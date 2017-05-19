import { 
  hasOverlap,
  omitUndefined,
  parseObject,
} from '../src/utils'

test('hasOverlap correctly determines whether two arrays contain common elements', () => {
  expect(hasOverlap([1, 2], [3, 2])).toEqual(true)
  expect(hasOverlap([1, 2], [3, 4])).toEqual(false)
})

test('omitUndefined omits keys with undefined values', () => {
  const withUndef = { test: true, omit: undefined }
  const withoutUndef = { test: true }
  expect(omitUndefined(withUndef)).toEqual(withoutUndef)
})

test('parseObject returns a parsed object from a string', () => {
  const obj = { test: true }
  const objString = JSON.stringify(obj)
  expect(parseObject(objString)).toEqual(obj)
})

test('parseObject returns undefined if string cannot be parsed', () => {
  const objString = 'not valid'
  expect(parseObject(objString)).toEqual(undefined)
})