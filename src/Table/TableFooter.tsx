import * as React from 'react'
import { HeaderGroup } from 'react-table'

import { TableCell, TableFooterRow, TableFooterContainer } from './Table.style'

export const TableFooter = <D extends {}>({
  footerGroups,
}: React.PropsWithChildren<TableFooterProps<D>>) => {
  return (
    <TableFooterContainer>
      {footerGroups.map((group) => {
        if (
          group.headers.every(
            (column) =>
              ((column as unknown) as { Footer: Function }).Footer?.name ===
              'emptyRenderer'
          )
        ) {
          return null
        }
        return (
          <TableFooterRow {...group.getFooterGroupProps()}>
            {group.headers.map((column) => {
              if (column.headers) {
                return null // TODO: manage footer for sub columns
              }
              return (
                <TableCell {...column.getFooterProps()}>
                  {column.render('Footer')}
                </TableCell>
              )
            })}
          </TableFooterRow>
        )
      })}
    </TableFooterContainer>
  )
}

interface TableFooterProps<D extends {}> {
  footerGroups: HeaderGroup<D>[]
}