import * as React from 'react'
import * as ReactTable from 'react-table'

import TextFilter from '../filter/TextFilter'
import useControlledFilters from '../plugin/useControlledFilters'
import useControlledPagination from '../plugin/useControlledPagination'
import useControlledSortBy from '../plugin/useControlledSortBy'
import { useRowSelect } from '../plugin/useRowSelect'
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
      rawColumns.map(({ HeaderIcon, Header, id, ...restColumn }) => {
        const column: ReactTable.Column<D> = {
          ...(restColumn as ReactTable.Column<D>),
          id: (id ?? restColumn.accessor) as ReactTable.IdType<D>,
          Header: HeaderIcon
            ? () => <HeaderCell icon={HeaderIcon} content={Header} />
            : (Header as ReactTable.Renderer<ReactTable.HeaderProps<D>>),
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
    plugins.push((useRowSelect as unknown) as ReactTable.PluginHook<D>)
  }

  if (options.manualPagination) {
    plugins.push(
      (useControlledPagination as unknown) as ReactTable.PluginHook<D>
    )
  }

  if (options.manualFilters) {
    plugins.push((useControlledFilters as unknown) as ReactTable.PluginHook<D>)
  }

  if (options.manualSortBy) {
    plugins.push((useControlledSortBy as unknown) as ReactTable.PluginHook<D>)
  }

  return (ReactTable.useTable<D>(
    {
      ...restOptions,
      data,
      columns,
      defaultColumn: defaultColumn as Partial<ReactTable.Column<D>>,
    },
    ...plugins
  ) as any) as TableInstance<D>
}

export default useTable
