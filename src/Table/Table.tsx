import * as React from 'react'
import { useTable } from 'react-table'

import { Text } from '@habx/lib-design-system'

import TableProps from './Table.interface'
import { TableContainer, TableHead, TableBody } from './Table.style'

const Table: React.FunctionComponent<TableProps> = ({ data, columns }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  return (
    <TableContainer {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                <Text opacity={1}>{column.render('Header')}</Text>
              </th>
            ))}
          </tr>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)

          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>
                  <Text>{cell.render('Cell')}</Text>
                </td>
              ))}
            </tr>
          )
        })}
      </TableBody>
    </TableContainer>
  )
}

export default Table
