import * as React from 'react'
import * as ReactTable from 'react-table'

import { TextFilter } from '../filter/TextFilter'
import { IMEXColumn } from '../imex/imex.interface'
import { useControlledFilters } from '../plugin/useControlledFilters'
import { useControlledPagination } from '../plugin/useControlledPagination'
import { useControlledSortBy } from '../plugin/useControlledSortBy'
import { useRowSelect } from '../plugin/useRowSelect'
import { HeaderCell } from '../Table/HeaderCell'
import {
  TableOptions,
  Column,
  TableInstance,
  ColumnEnabledCondition,
} from '../types/Table'

const EMPTY_DATA: any[] = []

const COLUMN_ENABLED_CONDITION: ColumnEnabledCondition[] = ['always']

export const useTable = <D extends object = {}>(
  options: TableOptions<D>,
  ...plugins: Array<ReactTable.PluginHook<D>>
) => {
  const {
    columns: rawColumns,
    defaultColumn: rawDefaultColumn,
    data: rawData,
    ...restOptions
  } = options

  const data: D[] = rawData ?? EMPTY_DATA

  const columns = React.useMemo<ReactTable.Column<D>[]>(() => {
    const isValidColumn = (column: Column<D> | IMEXColumn<D>) =>
      COLUMN_ENABLED_CONDITION.includes(column.enabled ?? 'always')

    const preProcessColumn = (
      column: Column<D> | IMEXColumn<D>
    ): ReactTable.Column<D> => {
      const {
        HeaderIcon,
        Header,
        id,
        columns: subColumns,
        ...restColumn
      } = column

      const preProcessedColumn: ReactTable.Column<D> = {
        ...(restColumn as ReactTable.Column<D>),
        id: (id ?? restColumn.accessor) as ReactTable.IdType<D>,
        Header: HeaderIcon
          ? () => <HeaderCell icon={HeaderIcon} content={Header} />
          : (Header as ReactTable.Renderer<ReactTable.HeaderProps<D>>),
      }

      if (Array.isArray(subColumns)) {
        return {
          ...preProcessedColumn,
          columns: (subColumns as (Column<D> | IMEXColumn<D>)[])
            .filter(isValidColumn)
            .map(preProcessColumn),
        }
      }

      return preProcessedColumn
    }

    return rawColumns.filter(isValidColumn).map(preProcessColumn)
  }, [rawColumns])

  const defaultColumn = React.useMemo<Partial<Column<D>>>(
    () => ({
      Filter: TextFilter,
      ...rawDefaultColumn,
    }),
    [rawDefaultColumn]
  )

  if (plugins.find((plugin) => plugin.pluginName === 'useRowSelect')) {
    plugins.push(useRowSelect as unknown as ReactTable.PluginHook<D>)
  }

  if (options.manualPagination) {
    plugins.push(useControlledPagination as unknown as ReactTable.PluginHook<D>)
  }

  if (options.manualFilters) {
    plugins.push(useControlledFilters as unknown as ReactTable.PluginHook<D>)
  }

  if (options.manualSortBy) {
    plugins.push(useControlledSortBy as unknown as ReactTable.PluginHook<D>)
  }

  return ReactTable.useTable<D>(
    {
      ...restOptions,
      data,
      columns,
      defaultColumn: defaultColumn as Partial<ReactTable.Column<D>>,
    },
    ...plugins
  ) as any as TableInstance<D>
}
