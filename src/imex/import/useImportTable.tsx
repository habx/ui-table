import { groupBy as lodashGroupBy, isFunction, omit } from 'lodash'
import * as React from 'react'
import { DropEvent, useDropzone } from 'react-dropzone'
import { useExpanded, useGroupBy } from 'react-table'

import {
  Button,
  HeaderBar,
  Icon,
  notify,
  prompt,
  Title,
  Tooltip,
} from '@habx/ui-core'

import { useRemainingActionsTime } from '../../_internal/useRemainingActionsTime'
import { LoadingOverlay } from '../../components'
import { useExpandAll } from '../../plugin/useExpandAll'
import { Table } from '../../Table'
import { Column } from '../../types/Table'
import { useTable } from '../../useTable'
import { parseCsvFileData } from '../csv.utils'
import { parseExcelFileData } from '../excel.utils'
import { getImexColumns } from '../getImexColumns'
import {
  ImportedRow,
  UseImportTableOptions,
  UseImportTableParams,
} from '../imex.interface'
import { IMEXColumn } from '../imex.interface'

import { getCompareColumnsFromImexColumns } from './useImportTable.columns'
import {
  ConfirmContainer,
  DataInfo,
  ActionBar,
  DataInfoContainer,
  OverlayContent,
} from './useImportTable.style'
import { parseRawData } from './useImportTable.utils'

const DEFAULT_ACCEPT = ['.csv', '.xls', '.xlsx']

export const useImportTable = <D extends { id?: string | number }>(
  params: Partial<UseImportTableParams<D>>
) => {
  // Put params in ref to avoid useless changes of `onFiles` function
  const paramsRef = React.useRef(params)
  paramsRef.current = params

  const onFiles = React.useCallback(
    async (files: File[], options: Partial<UseImportTableOptions<D>> = {}) => {
      const mergedOptions = {
        ...paramsRef.current,
        ...options,
      }

      const columns = mergedOptions.columns as IMEXColumn<ImportedRow<D>>[]

      const imexColumns = getImexColumns(columns)

      const parseFile = async (file: File): Promise<ImportedRow<D>[]> => {
        let rawData
        if (mergedOptions.readFile) {
          rawData = await mergedOptions.readFile(file)
        } else if (file.type.includes('text/')) {
          rawData = await parseCsvFileData(file)
        } else {
          rawData = await parseExcelFileData(file)
        }

        const originalData = mergedOptions.getOriginalData
          ? await mergedOptions.getOriginalData()
          : []

        return await parseRawData<D>(
          { data: rawData, originalData, columns: imexColumns },
          options
        )
      }

      const diffColumns = getCompareColumnsFromImexColumns<D>(imexColumns)

      const file = files[0]

      const plugins = mergedOptions.groupBy
        ? [useGroupBy, useExpanded, useExpandAll]
        : []

      const message = await prompt(({ onResolve }) => ({
        fullscreen: true,
        spacing: 'regular',
        Component: () => {
          // Parsing
          const [parsedData, setParsedData] = React.useState<ImportedRow<D>[]>()
          React.useEffect(() => {
            const asyncParse = async () => {
              const data = await parseFile(file)
              if (data?.length === 0) {
                onResolve('Aucune difference avec les données actuelles')
              }
              setParsedData(data)
            }
            asyncParse()
          }, [])

          // Table
          const tableInstance = useTable<D>(
            {
              columns: diffColumns as Column<D>[],
              data: parsedData,
              initialState: {
                groupBy: [mergedOptions.groupBy as string],
              },
            },
            ...plugins
          )

          const [
            remainingActionsState,
            remainingActions,
          ] = useRemainingActionsTime()

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

          const handleConfirm = async () => {
            try {
              remainingActions.initLoading()

              const cleanData =
                parsedData
                  ?.filter(
                    (row) => Object.values(row._rowMeta.errors).length === 0
                  ) // ignore rows with error
                  .map((row) => (omit(row, ['_rowMeta']) as unknown) as D) ?? [] // remove local meta

              const dataToUpsert = mergedOptions.groupBy
                ? Object.values(lodashGroupBy(cleanData, mergedOptions.groupBy))
                : cleanData
              remainingActions.setActionsCount(dataToUpsert.length)

              for (const data of dataToUpsert) {
                mergedOptions.upsertRow && (await mergedOptions.upsertRow(data))
                remainingActions.onActionDone()
              }
              if (isFunction(mergedOptions.onFinish)) {
                mergedOptions.onFinish(dataToUpsert)
              }
              onResolve(
                `Import terminé\n${dataToUpsert.length} ligne(s) importée(s)`
              )
            } catch (e) {
                console.error(e) // eslint-disable-line
              notify(e.toString())
              remainingActions.onError()
              onResolve(null)
            }
          }

          const dataInfos = React.useMemo(() => {
            return {
              added: parsedData?.filter(
                (row) =>
                  row._rowMeta.hasDiff &&
                  !row._rowMeta.prevVal &&
                  !Object.values(row._rowMeta.errors).length
              ).length,
              edited: parsedData?.filter(
                (row) =>
                  row._rowMeta.hasDiff &&
                  !!row._rowMeta.prevVal &&
                  !Object.values(row._rowMeta.errors).length
              ).length,
              ignored: parsedData?.filter(
                (row) => Object.values(row._rowMeta.errors).length
              ).length,
            }
          }, [parsedData])

          if (!parsedData) {
            return (
              <OverlayContent>
                <img
                  src="//res.cloudinary.com/habx/image/upload/illustrations/habxmojies/builder-data"
                  alt="analyse"
                />
                <Title type="regular">Analyse en cours...</Title>
              </OverlayContent>
            )
          }

          return (
            <React.Fragment>
              {mergedOptions.confirmLightBoxTitle && (
                <HeaderBar>
                  <Title type="regular">
                    {mergedOptions.confirmLightBoxTitle}
                  </Title>
                </HeaderBar>
              )}
              {remainingActionsState.loading && (
                <LoadingOverlay {...remainingActionsState} />
              )}
              <ConfirmContainer data-testid="useImportTable-confirmContainer">
                <Table instance={tableInstance} />
              </ConfirmContainer>
              <ActionBar>
                <DataInfoContainer>
                  <Tooltip title={`${dataInfos.added} ajout(s)`} small>
                    <DataInfo data-type="addition">
                      {dataInfos.added} <Icon icon="add-round" />
                    </DataInfo>
                  </Tooltip>
                  <Tooltip title={`${dataInfos.edited} modification(s)`} small>
                    <DataInfo data-type="edition">
                      {dataInfos.edited} <Icon icon="check-round" />
                    </DataInfo>
                  </Tooltip>
                  <Tooltip title={`${dataInfos.ignored} ignoré(s)`} small>
                    <DataInfo data-type="ignored">
                      {dataInfos.ignored} <Icon icon="exclam-round" />
                    </DataInfo>
                  </Tooltip>
                </DataInfoContainer>
                <Button
                  ghost
                  disabled={remainingActionsState.loading}
                  onClick={() => onResolve(false)}
                >
                  Annuler
                </Button>
                <Button
                  error
                  onClick={handleConfirm}
                  disabled={remainingActionsState.loading}
                  data-testid="useImportTable-submit"
                >
                  Valider
                </Button>
              </ActionBar>
            </React.Fragment>
          )
        },
      }))
      if (message) {
        notify({ message, markdown: true })
      }
    },
    []
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

  const inputProps = React.useMemo(() => dropzone.getInputProps(), [
    dropzone.getInputProps,
  ])

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

  const browseLocalFiles = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) =>
      dropzone.getRootProps().onClick?.(event),
    [dropzone]
  )

  return {
    inputProps,
    dropzoneProps,
    browseLocalFiles,
    dropzone,
  }
}
