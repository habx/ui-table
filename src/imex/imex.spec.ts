import { renderHook, act } from '@testing-library/react-hooks'

import { FAKE_DATA, IMEX_COLUMNS } from '../_fakeData/storyFakeData'

import { useExportTable } from './export/useExportTable'
import { getImexColumns } from './getImexColumns'

describe('Import/Export (imex)', () => {
  describe('export', () => {
    beforeEach(() => {
      // @ts-ignore
      global.URL.createObjectURL = jest.fn()
      // @ts-ignore
      global.navigator.msSaveBlob = jest.fn()
    })
    it('should allow download data in CSV', async () => {
      const { result } = renderHook(() =>
        useExportTable({
          data: FAKE_DATA,
          columns: IMEX_COLUMNS,
          type: 'csv',
        })
      )

      await act(() => {
        const [downloadFile] = result.current
        return downloadFile('test')
      })
      expect(global.navigator.msSaveBlob).toHaveBeenCalledWith(
        new Blob(),
        'test.csv'
      )
    })
    it('should allow download data in XLS', async () => {
      const { result } = renderHook(() =>
        useExportTable({
          data: FAKE_DATA,
          columns: IMEX_COLUMNS,
          type: 'xls',
        })
      )

      await act(() => {
        const [downloadFile] = result.current
        return downloadFile('test')
      })
      expect(global.navigator.msSaveBlob).toHaveBeenCalledWith(
        new Blob(),
        'test.xlsx'
      )
    })
  })

  describe('getImexColumns', () => {
    it('it needs string accessors only', () => {
      expect(() =>
        getImexColumns([
          {
            Header: 'header',
            accessor: (originalRow) => originalRow.id,
            meta: { imex: {} },
          },
        ])
      ).toThrow()
    })
    it('it needs string header only', () => {
      expect(() =>
        getImexColumns([
          { Header: () => null, accessor: 'id', meta: { imex: {} } },
        ])
      ).toThrow()
    })
    it('it ignore columns without meta.imex field', () => {
      expect(
        getImexColumns([{ Header: () => null, accessor: 'id' }])
      ).toHaveLength(0)
    })
  })
})
