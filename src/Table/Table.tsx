import { isString } from 'lodash'
import * as React from 'react'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'

import { Icon, Tooltip } from '@habx/ui-core'

import { ColumnInstance } from '../types/Table'

import Density from './Density'
import LoadingOverlay from './LoadingOverlay'
import LoadingRow from './LoadingRow'
import Pagination from './Pagination'
import { TableProps } from './Table.interface'
import {
  TableContainer,
  TableContent,
  TableBody,
  TableHead,
  TableHeadCell,
  TableHeadCellContent,
  TableHeaderCellSort,
  TableOptionBar,
  TableHeadRow,
  NoDataContainer,
  TableHeaderCellContainer,
} from './Table.style'
import TableRow from './TableRow'
import useVirtualize from './useVirtualize'

const DEFAULT_COLUMN_WIDTH = 100
const DEFAULT_ROW_CHARACTERISTICS_GETTER = () => ({})

const Table = <D extends {}>({
  onRowClick,
  loading,
  style = {},
  noDataComponent: NoDataComponent,
  renderRowSubComponent,
  instance,
  getRowCharacteristics = DEFAULT_ROW_CHARACTERISTICS_GETTER,
  virtualized = false,
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

  const hasPagination = !!instance.pageOptions //&& !infiniteScroll
  const hasDensity = !!instance.setDensity
  const hasRowSelect = !!instance.plugins.find(
    (plugin) => plugin.pluginName === 'useRowSelect'
  )

  const gridTemplateColumns = React.useMemo(() => {
    const flatColumns = columns.flatMap((column) => column?.columns ?? column)
    return `${hasRowSelect ? '45px' : ''} ${flatColumns
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

  const virtualState = useVirtualize({
    skip: (!virtualized && !instance.infiniteScroll) || rows.length === 0,
  })

  const currentRows = hasPagination ? page : rows
  const isItemLoaded = (index: number) => !!currentRows[index]

  const VirtualRow = ({
    index: rowIndex,
    style: rawStyle,
  }: ListChildComponentProps) => {
    const row = currentRows[rowIndex]

    if (!row) {
      return (
        <div key={`loadingRow-${rowIndex}`} style={rawStyle}>
          {instance.loadingRowComponent ?? <LoadingRow instance={instance} />}
        </div>
      )
    }

    return (
      <TableRow
        tableStyle={style}
        index={rowIndex}
        row={row}
        getRowCharacteristics={getRowCharacteristics}
        instance={instance}
        onClick={onRowClick}
        style={rawStyle}
        prepareRow={prepareRow}
        renderRowSubComponent={renderRowSubComponent}
        key={`row-${rowIndex}`}
      />
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
            <TableHeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col, headerCellIndex) => {
                const column = (col as unknown) as ColumnInstance<D>

                const headerProps = column.getHeaderProps(
                  ...(column.getSortByToggleProps
                    ? [column.getSortByToggleProps()]
                    : [])
                )

                const renderHeader = column.Header && column.render('Header')
                const isBig =
                  headerGroups.length > 1 &&
                  headerGroupIndex < headerGroups.length - 1
                return (
                  <TableHeadCell
                    data-big={isBig}
                    key={`headerCell-${headerCellIndex}`}
                    size={column.columns?.length ?? 1}
                  >
                    {renderHeader && (
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
                    )}
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
        {!loading && NoDataComponent && rows.length === 0 && (
          <NoDataContainer>
            <NoDataComponent />
          </NoDataContainer>
        )}
        <TableBody
          {...getTableBodyProps()}
          ref={virtualState.scrollContainerRef}
        >
          {virtualState.initialized ? (
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={instance.total ?? currentRows.length}
              loadMoreItems={instance.loadMore ?? (() => null)}
            >
              {({ onItemsRendered, ref }) => (
                <FixedSizeList
                  ref={ref}
                  onItemsRendered={onItemsRendered}
                  width={virtualState.width ?? 0}
                  itemCount={instance.total ?? currentRows.length}
                  height={virtualState.height ?? 0}
                  itemSize={virtualState.itemSize ?? 0}
                >
                  {VirtualRow}
                </FixedSizeList>
              )}
            </InfiniteLoader>
          ) : (
            currentRows.map((row, rowIndex) => (
              <TableRow
                index={rowIndex}
                row={row}
                getRowCharacteristics={getRowCharacteristics}
                instance={instance}
                onClick={onRowClick}
                tableStyle={style}
                prepareRow={prepareRow}
                renderRowSubComponent={renderRowSubComponent}
                ref={rowIndex === 0 ? virtualState.firstItemRef : undefined}
                key={`row-${rowIndex}`}
              />
            ))
          )}
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
