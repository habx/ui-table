import * as React from 'react'
import * as ReactTable from 'react-table'

import { Text, Icon } from '@habx/lib-design-system'

import {
  TableContainer,
  TableContent,
  TableBody,
  TableBodyRow,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeadCellContent,
  TableHeaderCellSort,
} from '../useTable/useTable.style'

import {
  TableProps,
  TableInstance,
  ColumnInstance,
} from './getTableComponent.interface'
import LoadingOverlay from './LoadingOverlay'
import Pagination from './Pagination'

const getTableComponent = <D extends object = {}>(
  instance: TableInstance<D>
) => {
  const Table: React.FunctionComponent<TableProps<D>> = ({
    onRowClick,
    loading,
  }) => {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      page,
      prepareRow,
    } = instance

    const handleRowClick = (
      row: ReactTable.Row<D>,
      event: React.MouseEvent<HTMLTableRowElement>
    ) => {
      if (onRowClick) {
        onRowClick(row, event)
      }
    }

    const hasPagination = !!instance.pageOptions

    return (
      <TableContainer>
        {loading && <LoadingOverlay />}
        <TableContent {...getTableProps()}>
          <TableHead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(col => {
                  const column = col as ColumnInstance<D>
                  const headerProps = column.getHeaderProps(
                    ...(column.getSortByToggleProps
                      ? [column.getSortByToggleProps()]
                      : [])
                  )

                  return (
                    <TableHeadCell>
                      <TableHeadCellContent opacity={0.5} {...headerProps}>
                        {column.render('Header')}{' '}
                        {column.isSorted && (
                          <Icon
                            icon={
                              column.isSortedDesc
                                ? 'chevron-south'
                                : 'chevron-north'
                            }
                          />
                        )}
                      </TableHeadCellContent>
                      {column.canFilter ? (
                        <TableHeaderCellSort>
                          {column.render('Filter')}
                        </TableHeaderCellSort>
                      ) : null}
                    </TableHeadCell>
                  )
                })}
              </tr>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {(hasPagination ? page : rows).map(row => {
              prepareRow(row)

              return (
                <TableBodyRow
                  {...row.getRowProps()}
                  onClick={e => handleRowClick(row, e)}
                  data-clickable={!!onRowClick}
                >
                  {row.cells.map(cell => (
                    <TableCell {...cell.getCellProps()}>
                      <Text>{cell.render('Cell')}</Text>
                    </TableCell>
                  ))}
                </TableBodyRow>
              )
            })}
          </TableBody>
        </TableContent>
        {hasPagination && <Pagination instance={instance} />}
      </TableContainer>
    )
  }

  return Table
}

export default getTableComponent
