import * as React from 'react'

import { Text, Icon } from '@habx/ui-core'

import { TableInstance, ColumnInstance, Row } from '../types/Table'

import Density from './Density'
import { TableProps } from './getTableComponent.interface'
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
  TableOptionBar,
  TableHeadRow,
  ExpandToggleContainer,
} from './getTableComponent.style'
import LoadingOverlay from './LoadingOverlay'
import Pagination from './Pagination'

const getTableComponent = <D extends object = {}>(
  instance: TableInstance<D>
) => {
  const Table: React.FunctionComponent<TableProps<D>> = ({
    onRowClick,
    loading,
    style = {},
  }) => {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      page,
      prepareRow,
      columns,
    } = instance

    const handleRowClick = (
      row: Row<D>,
      event: React.MouseEvent<HTMLTableRowElement>
    ) => {
      if (onRowClick) {
        onRowClick(row, event)
      }
    }

    const hasPagination = !!instance.pageOptions
    const hasDensity = !!instance.setDensity
    const rowStyle = React.useMemo(
      () => ({
        gridTemplateColumns: `${columns
          .map(
            ({ minWidth = '0', maxWidth }) =>
              `minmax(${minWidth}, ${maxWidth ? `${maxWidth}px` : '1fr'})`
          )
          .join(' ')}`,
      }),
      [columns]
    )

    return (
      <TableContainer>
        {loading && <LoadingOverlay />}
        <TableContent {...getTableProps()}>
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableHeadRow
                {...headerGroup.getHeaderGroupProps()}
                style={rowStyle}
              >
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
              </TableHeadRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {(hasPagination ? page : rows).map(row => {
              prepareRow(row)

              return (
                <TableBodyRow
                  {...row.getRowProps()}
                  style={rowStyle}
                  data-striped={!row.isGrouped && style.striped}
                  onClick={e => !row.isGrouped && handleRowClick(row, e)}
                  data-clickable={!row.isGrouped && !!onRowClick}
                  data-section={row.isExpanded}
                >
                  {row.cells.map(cell => {
                    const expandedToggleProps = row.getExpandedToggleProps
                      ? row.getExpandedToggleProps()
                      : {}
                    if (cell.isGrouped) {
                      return (
                        <TableCell
                          data-section="true"
                          data-density={instance.state.density}
                          {...cell.getCellProps()}
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
                          data-density={instance.state.density}
                          {...cell.getCellProps()}
                        >
                          {cell.render('Aggregated')}
                        </TableCell>
                      )
                    }
                    if (cell.isRepeatedValue) {
                      return (
                        <TableCell
                          data-density={instance.state.density}
                          {...cell.getCellProps()}
                        />
                      )
                    }
                    return (
                      <TableCell
                        data-density={instance.state.density}
                        {...cell.getCellProps()}
                      >
                        <Text>{cell.render('Cell')}</Text>
                      </TableCell>
                    )
                  })}
                </TableBodyRow>
              )
            })}
          </TableBody>
        </TableContent>
        <TableOptionBar>
          {hasPagination && <Pagination instance={instance} />}
          {hasDensity && <Density instance={instance} />}
        </TableOptionBar>
      </TableContainer>
    )
  }

  return Table
}

export default getTableComponent
