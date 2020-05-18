import * as React from 'react'
import styled from 'styled-components'

import { Text, Icon, Select, palette } from '@habx/ui-core'

import { TableInstance } from '../types/Table'

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
`

export const PagesPagination = styled(Text).attrs(() => ({ type: 'caption' }))`
  padding-top: 6px;
`

export const PagesChevrons = styled.div`
  display: flex;
  width: 64px;
  justify-content: space-between;
  margin-right: 36px;
  font-size: 24px;
`

export const PaginationIcon = styled(Icon)`
  color: ${palette.darkBlue[800]};
  transition: all ease-in-out 150ms;
  cursor: pointer;

  &:hover {
    color: ${palette.darkBlue[500]};
  }

  &[data-disabled='true'] {
    color: ${palette.darkBlue[300]};
    pointer-events: none;
  }
`

const PageSizeContainer = styled.div`
  margin-left: 36px;
`

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50].map((value) => ({
  value,
  label: `${value}`,
}))

const Pagination: React.FunctionComponent<PaginationProps> = ({ instance }) => (
  <PaginationContainer>
    {instance.pageCount > 1 && (
      <React.Fragment>
        <PagesChevrons>
          <PaginationIcon
            icon="chevron-west"
            data-disabled={!instance.canPreviousPage}
            onClick={() => instance.gotoPage((page) => page - 1)}
          />
          <PaginationIcon
            icon="chevron-east"
            data-disabled={!instance.canNextPage}
            onClick={() => instance.gotoPage((page) => page + 1)}
          />
        </PagesChevrons>
        <PagesPagination>
          {instance.state.pageIndex + 1} - {instance.pageCount}
        </PagesPagination>
        <PageSizeContainer>
          <Select
            small
            canReset={false}
            value={instance.state.pageSize}
            onChange={(size) => instance.setPageSize(size as number)}
            options={PAGE_SIZE_OPTIONS}
          />
        </PageSizeContainer>
      </React.Fragment>
    )}
  </PaginationContainer>
)

interface PaginationProps {
  instance: TableInstance<any>
}

export default Pagination
