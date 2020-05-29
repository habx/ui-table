import * as React from 'react'

import { Icon, Text } from '@habx/ui-core'

import { ColumnInstance, Row, TableInstance } from '../types/Table'

import { RowCharacteristics, TableStyle } from './Table.interface'
import { ExpandToggleContainer, TableBodyRow, TableCell } from './Table.style'

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowInterface<any>>(
  (props, ref) => {
    const {
      prepareRow,
      getRowCharacteristics,
      row,
      instance,
      index,
      onClick,
      tableStyle,
      ...rest
    } = props
    prepareRow(row)

    const { isActive = false, isInteractive = true } = getRowCharacteristics
      ? getRowCharacteristics(row)
      : ({} as Partial<RowCharacteristics>)

    return (
      <TableBodyRow
        {...row.getRowProps()}
        {...rest}
        ref={ref}
        key={`row-${index}`}
        onClick={(e) => !row.isGrouped && onClick(row, e)}
        data-striped={!row.isGrouped && tableStyle.striped}
        data-clickable={!row.isGrouped && !!onClick && isInteractive}
        data-section={row.isExpanded}
        data-active={isActive}
      >
        {row.cells.map((cell, cellIndex) => {
          const expandedToggleProps = row.getToggleRowExpandedProps
            ? row.getToggleRowExpandedProps()
            : {}

          const column = cell.column as ColumnInstance<any>

          const cellProps = {
            ...cell.getCellProps(),
            'data-density': instance.state.density,
            'data-align': column.align ?? 'flex-start',
          }

          if (cell.isGrouped) {
            return (
              <TableCell
                data-section="true"
                {...cellProps}
                key={`cell-${cellIndex}`}
              >
                <ExpandToggleContainer {...expandedToggleProps}>
                  {row.isExpanded ? (
                    <Icon icon="chevron-south" />
                  ) : (
                    <Icon icon="chevron-east" />
                  )}
                </ExpandToggleContainer>
                <Text>{cell.render('Cell')}</Text>
              </TableCell>
            )
          }

          if (cell.isAggregated) {
            return (
              <TableCell
                data-section="true"
                {...cellProps}
                key={`cell-${cellIndex}`}
              >
                {cell.render('Aggregated')}
              </TableCell>
            )
          }

          if (cell.isPlaceholder) {
            return <TableCell {...cellProps} />
          }

          return (
            <TableCell {...cellProps}>
              <Text>{cell.render('Cell')}</Text>
            </TableCell>
          )
        })}
      </TableBodyRow>
    )
  }
)

interface TableRowInterface<D extends {}>
  extends Omit<React.HTMLAttributes<HTMLTableRowElement>, 'onClick'> {
  prepareRow: (row: Row<D>) => void
  getRowCharacteristics: (row: Row<D>) => Partial<RowCharacteristics>
  row: Row<D>
  instance: TableInstance<D>
  index: number
  onClick: (row: Row<D>, event: React.MouseEvent<HTMLTableRowElement>) => void
  tableStyle: TableStyle
}

export default TableRow
