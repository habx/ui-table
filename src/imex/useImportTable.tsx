import {
  deburr,
  difference,
  get,
  groupBy as lodashGroupBy,
  isFunction,
  lowerCase,
  omit,
  set,
} from 'lodash'
import * as React from 'react'
import { DropEvent, useDropzone } from 'react-dropzone'
import { useExpanded, useGroupBy } from 'react-table'

import { ActionBar, Button, notify, prompt, Text } from '@habx/ui-core'

import useRemainingActionsTime from '../_internal/useRemainingActionsTime'
import { LoadingOverlay } from '../components'
import useExpandAll from '../plugin/useExpandAll'
import Table from '../Table'
import { Column } from '../types/Table'
import useTable from '../useTable'

import { parseCsvFileData } from './csv.utils'
import { parseExcelFileData } from './excel.utils'
import getImexColumns from './getImexColumns'
import {
  ImportedRow,
  ImportedRowMeta,
  UseImportTableOptions,
  UseImportTableParams,
} from './imex.interface'
import {
  ConfirmContainer,
  DropzoneIndicator,
  OverlayContainer,
  OverlayContent,
} from './imex.style'
import { IMEXColumn, RowValueTypes } from './imex.types'
import {
  getCompareColumnsFromImexColumns,
  parseCell,
  ParseCellError,
  ParsingErrors,
  softCompare,
} from './imex.utils'

const cleanHeader = (header: string | number | {}) =>
  lowerCase(deburr(`${header}`))

const DEFAULT_ACCEPT = ['.csv', '.xls', '.xlsx']

const useImportTable = <D extends { id?: string | number }>(
  params: Partial<UseImportTableParams<D>>
) => {
  const [isParsing, setParsing] = React.useState<boolean>(false)
  const [remainingActionsState, remainingActions] = useRemainingActionsTime()

  const onFiles = React.useCallback(
    async (files: File[], options: Partial<UseImportTableOptions<D>> = {}) => {
      const {
        readFile,
        columns: _columns,
        getOriginalData,
        onFinish,
        upsertRow,
        filterRows,
        groupBy,
      } = {
        ...params,
        ...options,
      }

      const columns = _columns as IMEXColumn<ImportedRow<D>>[]

      const imexColumns = getImexColumns(columns)

      const parseRawData = async (data: any[][]) => {
        // clone original data array
        const originalData = [
          ...(getOriginalData ? await getOriginalData() : []),
        ]

        const headers = (data.shift() as string[])?.map(cleanHeader)
        if (!headers) {
          throw new Error('Missing headers row')
        }
        const identifierColumn = imexColumns.find(
          (column) => column.meta?.imex?.identifier
        )
        if (!identifierColumn) {
          throw new Error('Missing identifier column')
        }
        const requiredColumnHeaders = imexColumns
          .filter((column) => column.meta?.imex?.required)
          .map((column) => cleanHeader(column.Header as string))

        const missingRequiredColumns = difference(
          requiredColumnHeaders as string[],
          headers
        )
        if (missingRequiredColumns.length > 0) {
          throw new Error(`${missingRequiredColumns.join(', ')} manquants`)
        }

        const ignoredColumns = []
        const orderedColumns = headers.map((header) => {
          const column = imexColumns.find(
            (imexColumn) =>
              cleanHeader(imexColumn.Header as string) === cleanHeader(header)
          )
          if (!column) {
            ignoredColumns.push(header)
          }
          return column
        })

        const filteredData = data.filter(
          (row: string[]) =>
            row.length === headers.length && row.some((cell) => cell.length)
        )

        const parsedData: ImportedRow<D>[] = []
        for (const row of filteredData) {
          const importedRowMeta: ImportedRowMeta<D> = {
            hasDiff: false,
            errors: {},
          }

          const importedRowValue: Partial<D> = {}

          const rawRowValues = Object.values(row)
          for (let index = 0; index < rawRowValues.length; index++) {
            const rawCell = rawRowValues[index]
            if (!orderedColumns[index]) {
              continue
            }

            let cellError: string | null = null

            if (
              requiredColumnHeaders.includes(
                cleanHeader(orderedColumns[index]?.Header as string)
              ) &&
              rawCell.length === 0
            ) {
              cellError = 'requise'
            }
            if (rawCell === '') {
              continue
            }

            const format = (value: any) =>
              orderedColumns[index]?.meta?.imex?.format?.(value, row) ??
              `${value}`

            // cast to string for default value to avoid render error
            let newCellValue:
              | string
              | number
              | string[]
              | number[] = `${rawCell}`

            try {
              newCellValue = parseCell(
                rawCell,
                orderedColumns[index]!.meta!.imex!.type as RowValueTypes,
                { format }
              )

              const validate =
                orderedColumns[index]?.meta?.imex?.validate ?? (() => true)
              const validateResponse = validate(newCellValue, row)
              const isValid =
                typeof validateResponse === 'string'
                  ? !validateResponse.length
                  : !!validateResponse
              if (!isValid) {
                throw new Error(
                  typeof validateResponse === 'string'
                    ? validateResponse
                    : ParsingErrors[ParseCellError.INVALID]
                )
              }
            } catch (e) {
              cellError = e.message
            }

            if (cellError) {
              set(
                importedRowMeta.errors,
                orderedColumns[index]?.accessor as string,
                cellError
              )
            }

            set(
              importedRowValue,
              orderedColumns[index]?.accessor as string,
              newCellValue
            )
          }

          /**
           * Previous value
           */
          const prevValAccessor = get(
            importedRowValue,
            identifierColumn.accessor as string
          )
          const prevValIndex = originalData.findIndex(
            (originalRow) =>
              get(originalRow, identifierColumn.accessor as string) ===
              prevValAccessor
          )

          importedRowMeta.prevVal = originalData[prevValIndex]
          originalData.splice(prevValIndex, 1) // remove from original array

          /**
           * Diff
           */
          importedRowMeta.hasDiff = !softCompare(
            importedRowValue,
            importedRowMeta.prevVal
          )

          parsedData.push({
            ...(importedRowValue as D),
            _rowMeta: importedRowMeta as ImportedRowMeta<D>,
            id: importedRowMeta.prevVal?.id ?? undefined,
          })
        }
        return parsedData
      }

      const diffColumns = getCompareColumnsFromImexColumns<D>(imexColumns)

      try {
        setParsing(true)

        const file = files[0]
        let rawData
        if (readFile) {
          rawData = await readFile(file)
        } else if (file.type.includes('text/csv')) {
          rawData = await parseCsvFileData(file)
        } else {
          rawData = await parseExcelFileData(file)
        }

        const parsedData = (await parseRawData(rawData)).filter((imexRow) =>
          filterRows ? filterRows(imexRow) : imexRow._rowMeta.hasDiff
        )
        setParsing(false)
        if (parsedData.length === 0) {
          notify('Aucune difference avec les données actuelles')
          return
        }
        const plugins = groupBy ? [useGroupBy, useExpanded, useExpandAll] : []
        const hasConfirmed = await prompt(({ onResolve }) => ({
          fullscreen: true,
          spacing: 'regular',
          Component: () => {
            const tableInstance = useTable<D>(
              {
                columns: diffColumns as Column<D>[],
                data: parsedData as (D & { id?: string })[],
                initialState: {
                  groupBy: [groupBy as string],
                },
              },
              ...plugins
            )
            return (
              <ConfirmContainer data-testid="useImportTable-confirmContainer">
                <Table style={{ scrollable: true }} instance={tableInstance} />
                <ActionBar>
                  <Button ghost onClick={() => onResolve(false)}>
                    Annuler
                  </Button>
                  <Button
                    error
                    onClick={() => onResolve(true)}
                    data-testid="useImportTable-submit"
                  >
                    Valider
                  </Button>
                </ActionBar>
              </ConfirmContainer>
            )
          },
        }))
        if (hasConfirmed) {
          remainingActions.initLoading()

          const cleanData = parsedData
            .filter((row) => Object.values(row._rowMeta.errors).length === 0) // ignore rows with error
            .map((row) => (omit(row, ['_rowMeta']) as unknown) as D) // remove local meta

          const dataToUpsert = groupBy
            ? Object.values(lodashGroupBy(cleanData, groupBy))
            : cleanData
          remainingActions.setActionsCount(dataToUpsert.length)

          for (const data of dataToUpsert) {
            upsertRow && (await upsertRow(data))
            remainingActions.onActionDone()
          }
          notify({
            message: `Import terminé\n${dataToUpsert.length} ligne(s) importée(s)`,
            markdown: true,
          })
          if (isFunction(onFinish)) {
            onFinish(dataToUpsert)
          }
        }
      } catch (e) {
        console.error(e) // eslint-disable-line
        remainingActions.onError()
        setParsing(false)
        notify(e.toString())
        return
      }
    },
    // @ts-ignore
    [remainingActions, ...Object.values(params)] // eslint-disable-line
    // options object in "onFiles" function is overwriting params so we need all params
    // However, the params object will change at each render and
    // we want shallow compare of each property of params without spreading it outside of the function
    // so we can't forgot any props
  )

  const onDropRejected = React.useCallback(
    () => notify('Type de fichier non supporté'),
    []
  )

  const onDropAccepted = React.useCallback(
    (files: File[], event?: DropEvent) =>
      params.onBeforeDropAccepted
        ? params.onBeforeDropAccepted(onFiles)(files, event)
        : onFiles(files),
    [onFiles, params.onBeforeDropAccepted] // eslint-disable-line
  )
  const dropzone = useDropzone({
    accept: DEFAULT_ACCEPT,
    onDropAccepted,
    onDropRejected,
  })

  const overlays = (
    <React.Fragment>
      {isParsing && (
        <OverlayContainer>
          <OverlayContent>
            <Text>Analyse en cours...</Text>
          </OverlayContent>
        </OverlayContainer>
      )}
      {remainingActionsState.loading && (
        <LoadingOverlay
          total={remainingActionsState.total}
          done={remainingActionsState.done}
          remainingTime={remainingActionsState.remainingTime}
        />
      )}
      {dropzone.isDragActive && (
        <DropzoneIndicator>
          <OverlayContent>
            <Text>Importer</Text>
          </OverlayContent>
        </DropzoneIndicator>
      )}
    </React.Fragment>
  )

  const dropzoneProps = React.useMemo(
    () =>
      params.disabled
        ? {}
        : omit(dropzone.getRootProps(), [
            'onClick',
            'onBlur',
            'onFocus',
            'style',
            'className',
            'onKeyDown',
            'tabIndex',
          ]),
    [dropzone, params.disabled]
  )

  /**
   * Prevent leaving while uploading
   */
  React.useEffect(() => {
    if (remainingActionsState.loading) {
      const preventNavigation = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
      window.addEventListener('beforeunload', preventNavigation, false)
      return () => {
        window.removeEventListener('beforeunload', preventNavigation)
      }
    }
  }, [remainingActionsState.loading])

  return {
    overlays,
    dropzoneProps,
    dropzone,
    onFiles,
    onDropAccepted,
    onDropRejected,
    accept: DEFAULT_ACCEPT,
    uploading: remainingActionsState.loading,
    parsing: isParsing,
    totalRows: remainingActionsState.total,
    updatedRows: remainingActionsState.done,
    remainingTime: remainingActionsState.remainingTime,
  }
}

export default useImportTable
