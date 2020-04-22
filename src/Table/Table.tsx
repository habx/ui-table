import { isString } from 'lodash'
import * as React from 'react'

import { Text, Icon, Tooltip } from '@habx/ui-core'

import { ColumnInstance, Row } from '../types/Table'

import Density from './Density'
import LoadingOverlay from './LoadingOverlay'
import Pagination from './Pagination'
import { RowCharacteristics, TableProps } from './Table.interface'
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
  TableHeaderCellContainer,
} from './Table.style'

const DEFAULT_COLUMN_WIDTH = 100
const DEFAULT_ROW_CHARACTERISTICS_GETTER = () => ({})

const Table = <D extends {}>({
  onRowClick,
  loading,
  style = {},
  noDataComponent: NoDataComponent,
  instance,
  getRowCharacteristics = DEFAULT_ROW_CHARACTERISTICS_GETTER,
}: React.PropsWithChildren<TableProps<D>>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    columns,
  } = instance

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

  const gridTemplateColumns = React.useMemo(() => {
    const flatColumns = columns.flatMap((column) => column?.columns ?? column)
    return `${hasRowSelect ? '40px' : ''} ${flatColumns
      .map(({ minWidth, maxWidth }) => {
        const screenWidth =
          typeof window === 'object' ? window.innerWidth : 10000
        const realMaxWidth =
          maxWidth && maxWidth > screenWidth ? '1fr' : `${maxWidth}px`
        return `minmax(${
          minWidth
            ? `${minWidth}px`
            : `${
                maxWidth && maxWidth < DEFAULT_COLUMN_WIDTH
                  ? maxWidth
                  : DEFAULT_COLUMN_WIDTH
              }px`
        }, ${realMaxWidth})`
      })
      .join(' ')}`
  }, [columns, hasRowSelect])

  if (rows.length === 0 && NoDataComponent) {
    return (
      <NoDataContainer>
        <NoDataComponent />
      </NoDataContainer>
    )
  }
  return (
    <TableContainer
      style={
        {
          '--table-grid-template-columns': gridTemplateColumns,
        } as React.CSSProperties
      }
    >
      {loading && <LoadingOverlay />}
      <TableContent {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup, headerGroupIndex) => (
            <TableHeadRow
              key={`header-${headerGroupIndex}`}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((col, headerCellIndex) => {
                const column = col as ColumnInstance<D>
                const headerProps = column.getHeaderProps(
                  ...(column.getSortByToggleProps
                    ? [column.getSortByToggleProps()]
                    : [])
                )
                const renderHeader = column.render('Header')
                const isBig =
                  headerGroups.length > 1 &&
                  headerGroupIndex < headerGroups.length - 1
                return (
                  <TableHeadCell
                    data-big={isBig}
                    key={`headerCell-${headerCellIndex}`}
                    size={column.columns?.length ?? 1}
                  >
                    <Tooltip
                      title={renderHeader as string}
                      disabled={!isString(renderHeader) || isBig}
                    >
                      <TableHeaderCellContainer
                        data-align={column.align ?? 'flex-start'}
                      >
                        <TableHeadCellContent opacity={0.5} {...headerProps}>
                          {renderHeader}
                        </TableHeadCellContent>
                        {column.isSorted && (
                          <Icon
                            icon={
                              column.isSortedDesc
                                ? 'chevron-south'
                                : 'chevron-north'
                            }
                          />
                        )}
                      </TableHeaderCellContainer>
                    </Tooltip>
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
        <TableBody
          {...getTableBodyProps()}
          data-pagination={hasPagination}
          data-scrollable={style.scrollable ?? !hasPagination}
        >
          {(hasPagination ? page : rows).map((row, rowIndex) => {
            prepareRow(row)

            const {
              isActive = false,
              isInteractive = true,
            } = getRowCharacteristics
              ? getRowCharacteristics(row)
              : ({} as Partial<RowCharacteristics>)

            return (
              <TableBodyRow
                {...row.getRowProps()}
                key={`row-${rowIndex}`}
                onClick={(e) => !row.isGrouped && handleRowClick(row, e)}
                data-striped={!row.isGrouped && style.striped}
                data-clickable={!row.isGrouped && !!onRowClick && isInteractive}
                data-section={row.isExpanded}
                data-active={isActive}
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

export default Table
