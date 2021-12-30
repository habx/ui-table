import { parseCell } from './useImportTable.utils'

describe('Import parsing', () => {
  describe('parse cell', () => {
    describe('number', () => {
      it('should parse normal number', () => {
        const result = parseCell(12, 'number', {
          parse: (value) => value,
          ignoreEmpty: true,
        })
        expect(result).toBe(12)
      })
      it('should parse string number', () => {
        const result = parseCell('10', 'number', {
          parse: (value) => value,
          ignoreEmpty: true,
        })
        expect(result).toBe(10)
      })
      it('should parse 0', () => {
        const result = parseCell(0, 'number', {
          parse: (value) => value,
          ignoreEmpty: true,
        })
        expect(result).toBe(0)
      })
      it('should parse 0 in string', () => {
        const result = parseCell('0', 'number', {
          parse: (value) => value,
          ignoreEmpty: true,
        })
        expect(result).toBe(0)
      })
      it('should consider empty string as undefined', () => {
        const result = parseCell('', 'number', {
          parse: (value) => value,
          ignoreEmpty: true,
        })
        expect(result).toBe(undefined)
      })
      it('should throw error if invalid number', () => {
        const parseInvalid = () =>
          parseCell('invalid', 'number', {
            parse: (value) => value,
            ignoreEmpty: true,
          })
        expect(parseInvalid).toThrow()
      })
    })
    describe('string', () => {
      it('should return param value', () => {
        const result = parseCell('value', 'string', {
          parse: (value) => value,
          ignoreEmpty: true,
        })
        expect(result).toBe('value')
      })
      it('should consider empty string as undefined if `ignoreEmpty` is true', () => {
        const result = parseCell('', 'number', {
          parse: (value) => value,
          ignoreEmpty: true,
        })
        expect(result).toBe(undefined)
      })
    })
    describe('number[]', () => {
      it('should parse uniq number', () => {
        const result = parseCell('1', 'number[]', {
          parse: (value) => value,
          ignoreEmpty: true,
        })
        expect(result).toEqual([1])
      })
      it('should consider empty string as empty array', () => {
        const result = parseCell('', 'number[]', {
          parse: (value) => value,
          ignoreEmpty: false,
        })
        expect(result).toEqual([])
      })
      it('should parse multiple number', () => {
        const result = parseCell('1, 2, 3', 'number[]', {
          parse: (value) => value,
          ignoreEmpty: true,
        })
        expect(result).toEqual([1, 2, 3])
      })
      it('should throw error if invalid value', () => {
        const parseInvalid = () =>
          parseCell('AA', 'number[]', {
            parse: (value) => value,
            ignoreEmpty: true,
          })
        expect(parseInvalid).toThrow()
      })
      it('should throw error if invalid number contained', () => {
        const parseInvalid = () =>
          parseCell('1,A,3', 'number[]', {
            parse: (value) => value,
            ignoreEmpty: true,
          })
        expect(parseInvalid).toThrow()
      })
    })
    describe('string[]', () => {
      it('should parse uniq value', () => {
        const result = parseCell('a', 'string[]', {
          parse: (value) => value,
          ignoreEmpty: true,
        })
        expect(result).toEqual(['a'])
      })
      it('should consider empty string as empty array', () => {
        const result = parseCell('', 'string[]', {
          parse: (value) => value,
          ignoreEmpty: false,
        })
        expect(result).toEqual([])
      })
      it('should parse multiple values', () => {
        const result = parseCell('a,b,c', 'string[]', {
          parse: (value) => value,
          ignoreEmpty: true,
        })
        expect(result).toEqual(['a', 'b', 'c'])
      })
    })
  })
})
