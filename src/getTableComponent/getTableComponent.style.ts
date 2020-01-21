import styled from 'styled-components'

import { palette, Text } from '@habx/ui-core'

export const TableContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`

export const TableContent = styled.table`
  border-collapse: collapse;
  width: 100%;
`

export const TableHead = styled.thead``

export const TableHeadCell = styled.th`
  text-align: left;
  padding: 12px;
`

export const TableBody = styled.tbody``

export const TableBodyRow = styled.tr`
  transition: background-color 50ms ease-in-out;

  &[data-clickable='true'] {
    cursor: pointer;

    &:hover {
      background-color: ${palette.darkBlue[100]};
    }
  }
`

export const TableCell = styled.td`
  padding: 12px;

  &[data-density='low'] {
    padding: 18px 12px;
  }

  &[data-density='high'] {
    padding: 6px 12px;
  }
`

export const TableHeadCellContent = styled(Text)`
  display: flex;
  align-items: center;
  user-select: none;

  & > span:last-child {
    margin-left: 8px;
  }
`

export const TableHeaderCellSort = styled.div`
  margin-top: 6px;
`

export const TableOptionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
