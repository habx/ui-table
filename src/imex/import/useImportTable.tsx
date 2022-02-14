import { groupBy as lodashGroupBy, omit } from 'lodash'
import pLimit from 'p-limit'
import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { useExpanded, useGroupBy } from 'react-table'

import { Button, HeaderBar, notify, prompt, Title } from '@habx/ui-core'

import { usePreventLeave } from '../../_internal/usePreventLeave'
import { useRemainingActionsTime } from '../../_internal/useRemainingActionsTime'
import { LoadingOverlay } from '../../components'
import { useExpandAll } from '../../plugin/useExpandAll'
import { Table } from '../../Table'
import { TableState } from '../../types/Table'
import { useTable } from '../../useTable'
import { parseCsvFileData } from '../csv.utils'
import { parseExcelFileData } from '../excel.utils'
import { useExportTable } from '../export/useExportTable'
import { getImexColumns } from '../getImexColumns'
import {
  IMEXFileExtensionTypes,
  ImportedRow,
  UseImportTableParams,
} from '../imex.interface'
import { IMEXColumn } from '../imex.interface'

import { DataIndicators } from './DataIndicators'
import { getCompareColumnsFromImexColumns } from './useImportTable.columns'
import {
  ConfirmContainer,
  ActionBar,
  OverlayContent,
} from './useImportTable.style'
import { parseRawData, validateOptions } from './useImportTable.utils'

const DEFAULT_ACCEPT = ['.csv', '.xls', '.xlsx']
const DROPZONE_IGNORED_PROPS = [
  'onClick',
  'onBlur',
  'onFocus',
  'style',
  'className',
  'onKeyDown',
  'tabIndex',
]

export const useImportTable = <D extends { id?: string | number }>(
  params: UseImportTableParams<D>
) => {
  // Put params in ref to avoid useless changes of `onFiles` function
  const paramsRef = React.useRef(params)
  paramsRef.current = params

  const onFiles = React.useCallback(async (files: File[]) => {
    const options = paramsRef.current
    validateOptions<D>(options)

    /**
     * File
     */
    const file = files[0]
    const fileType: IMEXFileExtensionTypes = file.type.includes('text/')
      ? 'csv'
      : 'xls'

    /**
     * Table params
     */
    const initialColumns = options.columns as IMEXColumn<ImportedRow<D>>[]
    const imexColumns = getImexColumns<ImportedRow<D>>(initialColumns)
    const diffColumns =
      getCompareColumnsFromImexColumns<ImportedRow<D>>(imexColumns)

    const plugins = options.groupBy
      ? [useGroupBy, useExpanded, useExpandAll]
      : []

    const initialState: Partial<TableState<ImportedRow<D>>> = {
      groupBy: options.groupBy ? [options.groupBy] : [],
    }

    const parseFilePromise: Promise<ImportedRow<D>[]> = new Promise(
      async (resolve, reject) => {
        try {
          let rawData
          if (options.readFile) {
            rawData = await options.readFile(file)
          } else if (file.type.includes('text/')) {
            rawData = await parseCsvFileData(file)
          } else {
            rawData = await parseExcelFileData(file)
          }

          const originalData = options.getOriginalData
            ? await options.getOriginalData()
            : []

          const parsedData = await parseRawData<D>(
            { data: rawData, originalData, columns: imexColumns },
            options
          )
          resolve(parsedData)
        } catch (e) {
          reject(e)
        }
      }
    )

    const userInputs = await prompt<{
      message: string
      ignoredRows: ImportedRow<D>[]
    } | null>(({ onResolve }) => ({
      fullscreen: true,
      spacing: 'regular',
      Component: () => {
        // Parsing
        const [parsedData, setParsedData] = React.useState<ImportedRow<D>[]>()
        React.useEffect(() => {
          const asyncParse = async () => {
            const data = await parseFilePromise
            if (data?.length === 0) {
              onResolve({
                message: 'Aucune difference avec les données actuelles',
                ignoredRows: [],
              })
            }
            setParsedData(data)
          }
          asyncParse()
        }, [])

        // Table
        const tableInstance = useTable<ImportedRow<D>>(
          {
            columns: diffColumns,
            data: parsedData,
            initialState,
          },
          ...plugins
        )

        const [remainingActionsState, remainingActions] =
          useRemainingActionsTime()

        /**
         * Prevent leaving while uploading
         */
        usePreventLeave(remainingActionsState.loading)

        const handleConfirm = async () => {
          try {
            const concurrency = options.concurrency ?? 1

            const cleanData =
              parsedData
                ?.filter((row) => !row._rowMeta.isIgnored) // remove ignored rows
                .map((row) => omit(row, ['_rowMeta']) as unknown as D) ?? [] // remove local meta

            const dataToUpsert = options.groupBy
              ? (Object.values(
                  lodashGroupBy(cleanData, options.groupBy)
                ) as D[][])
              : cleanData

            if (options.upsertRow) {
              remainingActions.initLoading()
              const limit = pLimit(concurrency)
              remainingActions.setActionsCount(dataToUpsert.length)
              const upsertRowFunctions = dataToUpsert.map((data: D | D[]) =>
                limit(async () => {
                  try {
                    // @ts-ignore
                    await options.upsertRow?.(data)
                  } catch (e) {
                    if (e instanceof Error) {
                      options.onUpsertRowError?.(e)
                        console.error(e) // eslint-disable-line
                    }
                  }
                  remainingActions.onActionDone()
                })
              )
              await Promise.all(upsertRowFunctions)
            }

            // @ts-ignore
            await options.onFinish?.(dataToUpsert)

            onResolve({
              message: `Import terminé\n${dataToUpsert.length} ligne(s) importée(s)`,
              ignoredRows:
                parsedData?.filter((row) => row._rowMeta.isIgnored) ?? [],
            })
          } catch (e) {
            if (e instanceof Error) {
                console.error(e) // eslint-disable-line
              notify(e.toString())
            }
            remainingActions.onError()
            onResolve(null)
          }
        }

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
            {options.confirmLightBoxTitle && (
              <HeaderBar>
                <Title type="regular">{options.confirmLightBoxTitle}</Title>
              </HeaderBar>
            )}
            {remainingActionsState.loading && (
              <LoadingOverlay {...remainingActionsState} />
            )}
            <ConfirmContainer data-testid="useImportTable-confirmContainer">
              <Table instance={tableInstance} virtualized />
            </ConfirmContainer>
            <ActionBar>
              <DataIndicators data={parsedData} />
              <Button
                ghost
                disabled={remainingActionsState.loading}
                onClick={() => onResolve(null)}
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

    if (userInputs?.message) {
      notify({ message: userInputs.message, markdown: true })
    }

    /**
     * Skipped rows export
     */
    if (!options.skipIgnoredRowsExport && userInputs?.ignoredRows.length) {
      const [errorFileName] = file.name.split('.')
      const errorExportFileName = `${errorFileName}_erreurs`
      const ignoredRowsColumns = getCompareColumnsFromImexColumns<
        ImportedRow<D>
      >(imexColumns, { statusColumn: false, footer: false })
      await prompt(({ onResolve }) => ({
        fullscreen: true,
        spacing: 'regular',
        Component: () => {
          const [handleExport] = useExportTable<ImportedRow<D>>()
          const tableInstance = useTable<ImportedRow<D>>(
            {
              data: userInputs.ignoredRows,
              columns: ignoredRowsColumns,
              initialState,
            },
            ...plugins
          )

          const handleDownloadClick = () => {
            handleExport(errorExportFileName, {
              columns: initialColumns,
              data: userInputs.ignoredRows,
              type: fileType,
            })
            onResolve(true)
          }

          return (
            <React.Fragment>
              <Title type="section">
                Les éléments suivant n'ont pas été importés.
              </Title>
              <br />
              <Title type="regular">
                Téléchargez les {userInputs.ignoredRows.length} éléments ignorés
                afin de corriger les données.
              </Title>
              <ConfirmContainer>
                <Table instance={tableInstance} virtualized />
              </ConfirmContainer>
              <ActionBar>
                <Button ghost onClick={() => onResolve(false)}>
                  Ignorer
                </Button>
                <Button onClick={handleDownloadClick}>Télécharger</Button>
              </ActionBar>
            </React.Fragment>
          )
        },
      }))
    }
  }, [])

  const onDropRejected = React.useCallback(
    () => notify('Type de fichier non supporté'),
    []
  )

  const dropzone = useDropzone({
    accept: DEFAULT_ACCEPT,
    useFsAccessApi: false,
    onDropAccepted: onFiles,
    onDropRejected,
  })

  const inputProps = React.useMemo(
    () => dropzone.getInputProps(),
    [
      // eslint-disable-line react-hooks/exhaustive-deps
      dropzone.getInputProps,
    ]
  )

  const dropzoneProps = React.useMemo(
    () =>
      params.disabled
        ? {}
        : omit(dropzone.getRootProps(), DROPZONE_IGNORED_PROPS),
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
