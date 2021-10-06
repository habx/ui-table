import * as React from 'react'

import { TableCellContainer, TableCellZoom } from './Table.style'

export const TableCell: React.FunctionComponent<TableCellProps> = ({
  children,
  ...props
}) => {
  const [isLargerThanCell, setLargerThanCell] = React.useState(false)
  const cellRefCallback = React.useCallback(
    (cellRef: HTMLTableCellElement | null) => {
      if (
        ((cellRef?.firstChild as HTMLDivElement)?.clientHeight ?? 0) >
        (cellRef?.clientHeight ?? 0)
      ) {
        setLargerThanCell(true)
      }
    },
    []
  )

  return (
    <React.Fragment>
      <TableCellContainer
        ref={cellRefCallback}
        {...props}
        data-large={isLargerThanCell}
      >
        {children}
      </TableCellContainer>
      {isLargerThanCell && (
        <TableCellZoom>
          <TableCellContainer {...props}>{children}</TableCellContainer>
        </TableCellZoom>
      )}
    </React.Fragment>
  )
}

interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {}
