import {
  deburr,
  difference,
  get,
  groupBy as lodashGroupBy,
  isFunction,
  isNil,
  lowerCase,
  merge,
  omit,
  set,
} from 'lodash'
import * as React from 'react'
import { DropEvent, useDropzone } from 'react-dropzone'
import * as ReactTable from 'react-table'
import { useExpanded, useGroupBy } from 'react-table'

import { ActionBar, Button, notify, prompt, Text } from '@habx/ui-core'

import useRemainingActionsTime from '../_internal/useRemainingActionsTime'
import { LoadingOverlay } from '../components'
import useExpandAll from '../plugin/useExpandAll'
import Table from '../Table'
import { CellProps, Column } from '../types/Table'
import useTable from '../useTable'

import { parseCsvFileData } from './csv.utils'
import { parseExcelFileData } from './excel.utils'
import getImexColumns from './getImexColumns'
import {
  ChangedCell,
  ConfirmContainer,
  DropzoneIndicator,
  NewCell,
  OverlayContainer,
  OverlayContent,
  PrevCell,
} from './imex.style'
import { IMEXColumn } from './imex.types'
import { softCompare } from './imex.utils'

export interface UseImportTableOptions<D extends { [key: string]: any } = any> {
  columns: IMEXColumn<D>[]
  upsertRow: (row: D | D[]) => any
  getOriginalData: () => D[] | Promise<D[]>
  onFinish?: (rows: D[] | D[][]) => void
  readFile?: (file: File) => Promise<any[]>
  filterRows?: (row: D & { prevVal?: D; hasDiff?: boolean }) => boolean
  groupBy?: string
  confirmLightBoxTitle?: string
}

export interface UseImportTableParams<D> extends UseImportTableOptions<D> {
  disabled?: boolean
  accept?: string[]
  onBeforeDropAccepted?: (
    onFiles: (
      files: File[],
      options?: Partial<UseImportTableOptions<D>>
    ) => Promise<void>
  ) => (files: File[], event?: DropEvent) => Promise<void>
}

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

      const columns = _columns as IMEXColumn<D>[]

      const imexColumns = getImexColumns<D>(columns)

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

        const parsedData = data
          .filter(
            (row: string[]) =>
              row.length === headers.length && row.some((cell) => cell.length)
          )
          .map((row: any[], rowIndex) => {
            const imexRow = row.reduce((ctx, rawCell, index) => {
              if (!orderedColumns[index]) {
                return ctx
              }
              if (
                requiredColumnHeaders.includes(
                  cleanHeader(orderedColumns[index]?.Header as string)
                ) &&
                rawCell.length === 0
              ) {
                throw new Error(
                  `${orderedColumns[index]?.Header} manquant ligne ${
                    rowIndex + 1
                  }`
                )
              }
              if (rawCell === '') {
                return ctx
              }

              const format =
                orderedColumns[index]?.meta?.imex?.format ??
                ((value: any) => `${value}`)

              let cellValue: string | number | string[] | number[]
              switch (orderedColumns[index]?.meta?.imex?.type) {
                case 'number':
                  if (typeof rawCell === 'number') {
                    cellValue = Number(format(rawCell))
                    break
                  }
                  cellValue = Number(format(rawCell.replace(',', '.')))
                  if (Number.isNaN(cellValue)) {
                    throw new Error(
                      `${orderedColumns[index]?.Header} invalide ligne ${
                        rowIndex + 1
                      }`
                    )
                  }
                  break
                case 'number[]':
                  cellValue = format(rawCell)
                    .split(',')
                    .map((value: string | number) => {
                      const transformedValue = Number(value)
                      if (Number.isNaN(transformedValue)) {
                        throw new Error(
                          `${orderedColumns[index]?.Header} invalide ligne ${
                            rowIndex + 1
                          }`
                        )
                      }
                      return transformedValue
                    })
                  break
                case 'string[]':
                  cellValue = format(rawCell).split(',')
                  break
                default:
                  cellValue = format(rawCell)
                  break
              }

              if (
                orderedColumns[index]?.meta?.imex?.validate &&
                !orderedColumns[index]?.meta?.imex?.validate(cellValue)
              ) {
                throw new Error(
                  `${orderedColumns[index]?.Header} invalide ligne ${
                    rowIndex + 1
                  }`
                )
              }

              return merge(
                {},
                ctx,
                set({}, orderedColumns[index]?.accessor as string, cellValue)
              )
            }, {}) as D
            const prevValId = get(imexRow, identifierColumn.accessor as string)
            const prevValIndex = originalData.findIndex(
              (originalRow) =>
                get(originalRow, identifierColumn.accessor as string) ===
                prevValId
            )
            const prevVal: D = originalData[prevValIndex]
            originalData.splice(prevValIndex, 1)
            return {
              ...imexRow,
              prevVal,
              hasDiff: !softCompare(imexRow, prevVal),
              id: prevVal?.id ?? undefined,
            }
          })
        return parsedData
      }

      const diffColumns = imexColumns.map((column) => ({
        ...column,
        Cell: ((rawProps) => {
          const props = (rawProps as unknown) as CellProps<D>
          const Cell = (isFunction(column.Cell)
            ? column.Cell
            : ({ cell }) => <div>{cell.value}</div>) as React.ComponentType<
            CellProps<D>
          >
          const cellPrevVal = get(
            rawProps.row.original?.prevVal,
            column.accessor as string
          )

          const cellPrevProps = {
            ...props,
            cell: {
              ...props.cell,
              value: cellPrevVal ?? '',
            },
          }
          // using lodash merge causes performance issues

          if (isNil(cellPrevVal)) {
            return (
              <NewCell>
                <Cell {...props} />
              </NewCell>
            )
          }

          if (
            isNil(props.cell.value) ||
            softCompare(cellPrevVal, props.cell.value)
          ) {
            return <Cell {...cellPrevProps} />
          }

          return (
            <div>
              <ChangedCell>
                <Cell {...props} />
              </ChangedCell>
              <PrevCell>
                <Cell {...cellPrevProps} />
              </PrevCell>
            </div>
          )
        }) as ReactTable.Renderer<
          CellProps<D & { prevVal: D; hasDiff: boolean }>
        >,
      }))

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
          filterRows ? filterRows(imexRow) : imexRow.hasDiff
        )
        setParsing(false)
        if (parsedData.length === 0) {
          notify('Aucune difference avec les données actuelles')
          return
        }
        const plugins = groupBy ? [useGroupBy, useExpanded, useExpandAll] : []
        const hasConfirmed = await prompt(({ onResolve }) => ({
          fullscreen: true,
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
          const cleanData = parsedData.map(
            (row) => (omit(row, ['prevVal', 'hasDiff']) as unknown) as D
          )
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
