import * as React from 'react'

import { TableCellContainer, TableCellZoom } from './Table.style'

export const TableCell: React.FunctionComponent<TableCellProps> = ({
  children,
  ...props
}) => {
  const cellRef = React.useRef<HTMLTableDataCellElement>(null)
  const [isLargerThanCell, setLargerThanCell] = React.useState(false)
  React.useEffect(() => {
    if (
      cellRef.current?.firstChild?.clientHeight > cellRef.current?.clientHeight
    ) {
      setLargerThanCell(true)
    }
  }, [])

  return (
    <React.Fragment>
      <TableCellContainer
        ref={cellRef}
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

interface TableCellProps
  extends React.HTMLAttributes<HTMLTableDataCellElement> {}
