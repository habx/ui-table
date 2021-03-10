import * as React from 'react'

import { Select, RoundIconButton, Tooltip } from '@habx/ui-core'

import { TableInstance } from '../../types/Table'

import {
  PagesChevrons,
  PageSizeContainer,
  PagesPagination,
  PaginationContainer,
} from './TableOptions.style'

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50].map((value) => ({
  value,
  label: `${value}`,
}))

export const TablePagination: React.FunctionComponent<PaginationProps> = ({
  instance,
  children,
}) => (
  <PaginationContainer>
    {instance.pageCount > 1 && (
      <React.Fragment>
        <PagesPagination>
          {instance.state.pageIndex * instance.state.pageSize + 1} -{' '}
          {instance.state.pageIndex * instance.state.pageSize +
            instance.page.length}{' '}
          / {instance.rows.length}
        </PagesPagination>
        <PageSizeContainer>
          <Select
            tiny
            canReset={false}
            value={instance.state.pageSize}
            onChange={(size) => instance.setPageSize(size as number)}
            options={
              instance.pageSizeOptions?.map((value) => ({
                value,
                label: `${value}`,
              })) ?? PAGE_SIZE_OPTIONS
            }
          />
        </PageSizeContainer>
        {children}
        <PagesChevrons>
          <Tooltip
            title={`${
              (instance.state.pageIndex - 1) * instance.state.pageSize + 1
            } - ${instance.state.pageIndex * instance.state.pageSize}`}
            small
            disabled={!instance.canPreviousPage}
          >
            <RoundIconButton
              small
              icon="chevron-west"
              disabled={!instance.canPreviousPage}
              onClick={() => instance.gotoPage((page) => page - 1)}
            />
          </Tooltip>
          <Tooltip
            small
            disabled={!instance.canNextPage}
            title={`${
              (instance.state.pageIndex + 1) * instance.state.pageSize + 1
            } - ${
              instance.rows.length <
              (instance.state.pageIndex + 2) * instance.state.pageSize
                ? instance.rows.length
                : (instance.state.pageIndex + 2) * instance.state.pageSize
            }`}
          >
            <RoundIconButton
              small
              icon="chevron-east"
              disabled={!instance.canNextPage}
              onClick={() => instance.gotoPage((page) => page + 1)}
            />
          </Tooltip>
        </PagesChevrons>
      </React.Fragment>
    )}
  </PaginationContainer>
)

interface PaginationProps {
  instance: TableInstance<any>
}
