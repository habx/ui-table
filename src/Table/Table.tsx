import * as React from 'react'
import { useTable } from 'react-table'

import { Text } from '@habx/lib-design-system'

import data from './Table.data'
import TableProps from './Table.interface'
import { TableContainer, TableHead, TableBody } from './Table.style'

const columns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Population',
    accessor: 'population',
    Cell: ({ cell: { value } }: { cell: { value: number } }) => (
      <div>{value && value.toLocaleString()}</div>
    ),
  },
]

const Table: React.FunctionComponent<TableProps> = ({}) => {
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
