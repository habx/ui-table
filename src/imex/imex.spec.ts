import { renderHook, act } from '@testing-library/react-hooks'

import exportData from '../_fakeData/export'
import { FAKE_DATA, IMEX_COLUMNS } from '../_fakeData/storyFakeData'

import getImexColumns from './getImexColumns'
import useExportTable from './useExportTable'
import useImportTable from './useImportTable'

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
        })
      )

      await act(() => {
        const [downloadFile] = result.current
        return downloadFile('test', { type: 'xls' })
      })
      expect(global.navigator.msSaveBlob).toHaveBeenCalledWith(
        new Blob(),
        'test.xlsx'
      )
    })
  })

  describe('import', () => {
    it('should parse files', async () => {
      const { result, waitFor } = renderHook(() =>
        useImportTable({
          getOriginalData: () => FAKE_DATA,
          columns: IMEX_COLUMNS,
        })
      )

      act(() => {
        const { onDropAccepted } = result.current
        onDropAccepted([
          new Blob([exportData], { type: 'text/csv;charset=utf-8;' }) as File,
        ])
      })
      expect(result.current.parsing).toBeTruthy()
      await waitFor(() => !result.current.parsing)
      expect(result.current.parsing).toBeFalsy()
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
