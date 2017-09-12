import { 
  hasOverlap,
  omitUndefined,
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
