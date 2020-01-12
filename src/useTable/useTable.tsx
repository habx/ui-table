import * as React from 'react'
import * as ReactTable from 'react-table'

import getTableComponent from '../getTableComponent'
import HeaderCell from '../getTableComponent/HeaderCell'

import { TableInstance, TableOptions } from './useTable.interface'

const useTable = <D extends object = {}>(
  options: TableOptions<D>,
  ...plugins: Array<ReactTable.PluginHook<D>>
): TableInstance<D> => {
  const { columns: rawColumns, ...restOptions } = options

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

  const instance = ReactTable.useTable<D>(
    { ...restOptions, columns },
    ...plugins
  )

  const instanceRef = React.useRef<ReactTable.TableInstance<D>>(instance)
  instanceRef.current = instance

  const TableComponent = React.useMemo(
    () => getTableComponent(instanceRef.current),
    []
  )

  return {
    ...instance,
    TableComponent,
  }
}

export default useTable
