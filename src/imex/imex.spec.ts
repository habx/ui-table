import { renderHook, act } from '@testing-library/react-hooks'

import { FAKE_DATA, IMEX_COLUMNS } from '../_fakeData/storyFakeData'

import { useExportTable } from './export/useExportTable'
import { getImexColumns } from './getImexColumns'

// uuid is now esm only, so we need to mock it
jest.mock('uuid', () => ({ v4: () => 'fake-uuid' }))

describe('Import/Export (imex)', () => {
  describe('export', () => {
    beforeEach(() => {
      // @ts-ignore
      global.URL.createObjectURL = jest.fn()
      // @ts-ignore
      global.navigator.msSaveBlob = jest.fn()
    })
    it('should allow download data in CSV', async () => {
      const { result } = renderHook(() => useExportTable())

      await act(() => {
        const [downloadFile] = result.current
        return downloadFile('test', {
          data: FAKE_DATA,
          columns: IMEX_COLUMNS,
          type: 'csv',
        })
      })
      // @ts-ignore
      expect(global.navigator.msSaveBlob).toHaveBeenCalledWith(
        new Blob(),
        'test.csv'
      )
    })
    it('should allow download data in XLS', async () => {
      const { result } = renderHook(() => useExportTable())
      await act(() => {
        const [downloadFile] = result.current
        return downloadFile('test', {
          data: FAKE_DATA,
          columns: IMEX_COLUMNS,
          type: 'xls',
        })
      })
      // @ts-ignore
      expect(global.navigator.msSaveBlob).toHaveBeenCalledWith(
        new Blob(),
        'test.xlsx'
      )
    })
  })

  describe('getImexColumns', () => {
    it('it ignore columns without imex field', () => {
      expect(
        getImexColumns([{ Header: () => null, accessor: 'id' }])
      ).toHaveLength(0)
    })
  })
})
