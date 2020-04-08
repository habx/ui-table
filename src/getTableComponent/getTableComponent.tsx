import * as React from 'react'

import { Text, Icon } from '@habx/ui-core'

import usePaginationEffect from '../plugin/useControlledPagination/usePaginationEffect'
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
  NoDataContainer,
} from './getTableComponent.style'
import LoadingOverlay from './LoadingOverlay'
import Pagination from './Pagination'

const DEFAULT_COLUMN_WIDTH = 100

const getTableComponent = <D extends object = {}>(
  instance: TableInstance<D>
) => {
  const Table: React.FunctionComponent<TableProps<D>> = ({
    onRowClick,
    loading,
    style = {},
    noDataComponent: NoDataComponent,
    pagination,
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

    usePaginationEffect(instance, pagination)

    const handleRowClick = React.useCallback(
      (row: Row<D>, event: React.MouseEvent<HTMLTableRowElement>) => {
        if (onRowClick) {
          onRowClick(row, event)
        }
      },
      [onRowClick]
    )

    const hasPagination = !!instance.pageOptions
    const hasDensity = !!instance.setDensity
    const hasRowSelect = !!instance.plugins.find(
      (plugin) => plugin.pluginName === 'useRowSelect'
    )
    const rowStyle = React.useMemo(
      () => ({
        gridTemplateColumns: `${hasRowSelect ? '40px' : ''} ${columns
          .map(({ minWidth, maxWidth }) => {
            const screenWidth =
              typeof window === 'object' ? window.innerWidth : 10000
            const realMaxWidth =
              maxWidth && maxWidth > screenWidth ? '1fr' : `${maxWidth}px`
            return `minmax(${
              minWidth || `${DEFAULT_COLUMN_WIDTH}px`
            }, ${realMaxWidth})`
          })
          .join(' ')}`,
      }),
      [columns, hasRowSelect]
    )

    if (rows.length === 0 && NoDataComponent) {
      return (
        <NoDataContainer>
          <NoDataComponent />
        </NoDataContainer>
      )
    }
    return (
      <TableContainer>
        {loading && <LoadingOverlay />}
        <TableContent {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, headerGroupIndex) => (
              <TableHeadRow
                key={`header-${headerGroupIndex}`}
                {...headerGroup.getHeaderGroupProps()}
                style={rowStyle}
              >
                {headerGroup.headers.map((col, headerCellIndex) => {
                  const column = col as ColumnInstance<D>
                  const headerProps = column.getHeaderProps(
                    ...(column.getSortByToggleProps
                      ? [column.getSortByToggleProps()]
                      : [])
                  )

                  return (
                    <TableHeadCell key={`headerCell-${headerCellIndex}`}>
                      <TableHeadCellContent
                        opacity={0.5}
                        {...headerProps}
                        data-align={column.align ?? 'flex-start'}
                      >
                        {column.render('Header')}
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
          <TableBody {...getTableBodyProps()} data-pagination={hasPagination}>
            {(hasPagination ? page : rows).map((row, rowIndex) => {
              prepareRow(row)

              return (
                <TableBodyRow
                  {...row.getRowProps()}
                  key={`row-${rowIndex}`}
                  style={rowStyle}
                  data-striped={!row.isGrouped && style.striped}
                  onClick={(e) => !row.isGrouped && handleRowClick(row, e)}
                  data-clickable={!row.isGrouped && !!onRowClick}
                  data-section={row.isExpanded}
                >
                  {row.cells.map((cell, cellIndex) => {
                    const expandedToggleProps = row.getToggleRowExpandedProps
                      ? row.getToggleRowExpandedProps()
                      : {}

                    const column = cell.column as ColumnInstance<D>

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
