import * as React from 'react'
import * as ReactTable from 'react-table'

import TextFilter from '../filter/TextFilter'
import useControlledFilters from '../plugin/useControlledFilters/useControlledFilters'
import useControlledPagination from '../plugin/useControlledPagination/useControlledPagination'
import { UseRowSelectPlugin } from '../plugin/useRowSelect'
import HeaderCell from '../Table/HeaderCell'
import { TableOptions, Column, TableInstance } from '../types/Table'

const EMPTY_DATA: any[] = []

const useTable = <D extends object = {}>(
  options: TableOptions<D>,
  ...plugins: Array<ReactTable.PluginHook<D>>
) => {
  const {
    columns: rawColumns,
    defaultColumn: rawDefaultColumn,
    data: rawData,
    ...restOptions
  } = options

  const data: typeof rawData = rawData?.length > 0 ? rawData : EMPTY_DATA

  const columns = React.useMemo<ReactTable.Column<D>[]>(
    () =>
      rawColumns.map(({ HeaderIcon, Header, ...restColumn }) => {
        const column: ReactTable.Column<D> = {
          ...restColumn,
          Header: HeaderIcon
            ? () => <HeaderCell icon={HeaderIcon} content={Header} />
            : Header,
        }

        return column
      }),
    [rawColumns]
  )

  const defaultColumn = React.useMemo<Partial<Column<D>>>(
    () => ({
      Filter: TextFilter,
      ...rawDefaultColumn,
    }),
    [rawDefaultColumn]
  )

  if (plugins.find((plugin) => plugin.pluginName === 'useRowSelect')) {
    plugins.push((UseRowSelectPlugin as unknown) as ReactTable.PluginHook<D>)
  }
  if (options.manualPagination) {
    plugins.push(
      (useControlledPagination as unknown) as ReactTable.PluginHook<D>
    )
  }
  if (options.manualFilters) {
    plugins.push((useControlledFilters as unknown) as ReactTable.PluginHook<D>)
  }

  return (ReactTable.useTable<D>(
    { ...restOptions, data, columns, defaultColumn },
    ...plugins
  ) as any) as TableInstance<D>
}

export default useTable
