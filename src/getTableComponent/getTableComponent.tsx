import * as React from 'react'
import * as ReactTable from 'react-table'

import { Text } from '@habx/lib-design-system'

import {
  TableContainer,
  TableContent,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
} from '../useTable/useTable.style'

import { TableProps } from './getTableComponent.interface'
import LoadingOverlay from './LoadingOverlay'

const getTableComponent = <D extends object = {}>(
  instance: ReactTable.TableInstance<D>
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

    return (
      <TableContainer>
        {loading && <LoadingOverlay />}
        <TableContent {...getTableProps()}>
          <TableHead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableHeadCell {...column.getHeaderProps()}>
                    <Text opacity={0.5}>{column.render('Header')}</Text>
                  </TableHeadCell>
                ))}
              </tr>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row)

              return (
                <tr
                  {...row.getRowProps()}
                  onClick={e => handleRowClick(row, e)}
                >
                  {row.cells.map(cell => (
                    <TableCell {...cell.getCellProps()}>
                      <Text>{cell.render('Cell')}</Text>
                    </TableCell>
                  ))}
                </tr>
              )
            })}
          </TableBody>
        </TableContent>
      </TableContainer>
    )
  }

  return Table
}

export default getTableComponent
