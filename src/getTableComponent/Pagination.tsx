import * as React from 'react'
import styled from 'styled-components'

import { Icon, palette } from '@habx/ui-core'

import { TableInstance } from './getTableComponent.interface'

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  font-size: 24px;
  padding: 8px 12px;
`

export const PagesPagination = styled.div`
  font-size: 12px;
  padding-top: 6px;
`

export const PagesChevrons = styled.div`
  display: flex;
  width: 64px;
  justify-content: space-between;
  margin-right: 36px;
  cursor: pointer;
`

export const PaginationIcon = styled(Icon)`
  &[data-disabled='true'] {
    color: ${palette.darkBlue[300]};
    pointer-events: none;
  }

  &:not([data-disabled='true']) {
    color: ${palette.darkBlue[800]};
    transition: all ease-in-out 150ms;

    &:hover {
      color: ${palette.darkBlue[500]};
    }
  }
`

const Pagination: React.FunctionComponent<PaginationProps> = ({ instance }) => (
  <PaginationContainer>
    {instance.pageCount > 0 && (
      <React.Fragment>
        <PagesChevrons>
          <PaginationIcon
            icon="chevron-west"
            data-disabled={!instance.canPreviousPage}
            onClick={() =>
              instance.canPreviousPage && instance.gotoPage(page => page - 1)
            }
          />
          <PaginationIcon
            icon="chevron-east"
            data-disabled={!instance.canNextPage}
            onClick={() =>
              instance.canNextPage && instance.gotoPage(page => page + 1)
            }
          />
        </PagesChevrons>
        <PagesPagination>
          {instance.state.pageIndex + 1} - {instance.pageCount}
        </PagesPagination>
      </React.Fragment>
    )}
  </PaginationContainer>
)

interface PaginationProps {
  instance: TableInstance<any>
}

export default Pagination
