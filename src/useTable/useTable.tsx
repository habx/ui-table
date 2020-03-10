import * as React from 'react'
import * as ReactTable from 'react-table'

import TextFilter from '../filter/TextFilter'
import getTableComponent, { TableProps } from '../getTableComponent'
import HeaderCell from '../getTableComponent/HeaderCell'
import { SelectRowPlugin } from '../plugin/useSelectRow'
import { TableOptions, Column, TableInstance } from '../types/Table'

type InnerTableInstance<D extends object> = Omit<
  TableInstance<D>,
  'TableComponent'
>

const useTable = <D extends object = {}>(
  options: TableOptions<D>,
  ...plugins: Array<ReactTable.PluginHook<D>>
): [React.FunctionComponent<TableProps<D>>, TableInstance<D>] => {
  const {
    columns: rawColumns,
    defaultColumn: rawDefaultColumn,
    ...restOptions
  } = options

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
  if (plugins.find(plugin => plugin.pluginName === 'useRowSelect')) {
    plugins.push(SelectRowPlugin)
  }
  const instance = (ReactTable.useTable<D>(
    { ...restOptions, columns, defaultColumn },
    ...plugins
  ) as any) as InnerTableInstance<D>

  const instanceRef = React.useRef<InnerTableInstance<D>>(instance)
  instanceRef.current = instance

  const TableComponent = React.useMemo(
    () => getTableComponent(instanceRef.current),
    []
  )

  return [TableComponent, instance]
}

export default useTable
