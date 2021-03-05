import * as React from 'react'

import { Icon, Text } from '@habx/ui-core'

import { ColumnInstance, Row, TableInstance } from '../types/Table'

import { RowCharacteristics, TableStyle } from './Table.interface'
import {
  ExpandToggleContainer,
  TableBodyRow,
  TableBodySubRow,
  TableCell,
} from './Table.style'

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  TableRowProps<any>
>((props, ref) => {
  const {
    prepareRow,
    getRowCharacteristics,
    row,
    instance,
    index,
    onClick,
    tableStyle,
    renderRowSubComponent,
    ...rest
  } = props
  prepareRow(row)

  const {
    isActive = false,
    isInteractive = true,
    backgroundColor,
  } = React.useMemo<Partial<RowCharacteristics>>(() => {
    let temp: Partial<RowCharacteristics> = {}

    if (getRowCharacteristics) {
      temp = getRowCharacteristics(row)
    }

    return temp
  }, [getRowCharacteristics, row])

  const rowProps = row.getRowProps()

  const style = React.useMemo<React.CSSProperties>(
    () => ({
      ...(rest.style ?? {}),
      ...(rowProps.style ?? {}),
      ...(backgroundColor ? { backgroundColor } : {}),
    }),
    [backgroundColor, rest.style, rowProps.style]
  )

  return (
    <React.Fragment>
      <TableBodyRow
        {...rowProps}
        {...rest}
        style={style}
        ref={ref}
        key={`row-${index}`}
        onClick={onClick && !row.isGrouped ? (e) => onClick(row, e) : undefined}
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
            return <TableCell {...cellProps} key={`cell-${cellIndex}`} />
          }

          return (
            <TableCell {...cellProps} key={`cell-${cellIndex}`}>
              <Text>{cell.render('Cell')}</Text>
            </TableCell>
          )
        })}
      </TableBodyRow>
      {renderRowSubComponent && row.isExpanded && (
        <TableBodySubRow>{renderRowSubComponent(row)}</TableBodySubRow>
      )}
    </React.Fragment>
  )
})

interface TableRowProps<D extends {}>
  extends Omit<React.HTMLAttributes<HTMLTableRowElement>, 'onClick'> {
  prepareRow: (row: Row<D>) => void
  getRowCharacteristics?: (row: Row<D>) => Partial<RowCharacteristics>
  row: Row<D>
  instance: TableInstance<D>
  index: number
  onClick?: (row: Row<D>, event: React.MouseEvent<HTMLTableRowElement>) => void
  renderRowSubComponent?: (row: Row<D>) => React.ReactNode
  tableStyle: TableStyle
}
