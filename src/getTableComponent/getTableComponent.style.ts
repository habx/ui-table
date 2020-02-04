import styled from 'styled-components'

import { palette, Text } from '@habx/ui-core'

export const TableContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  height: 100%;
`

export const TableContent = styled.table`
  display: flex;
  flex-direction: column;

  height: 100%;
  width: 100%;
`

export const TableHead = styled.thead`
  display: block;
`

export const TableHeadRow = styled.tr`
  display: grid;
`

export const TableHeadCell = styled.th`
  text-align: left;
  padding: 12px;
`

export const TableBody = styled.tbody`
  display: flex;
 
  // https://stackoverflow.com/questions/14962468/how-can-i-combine-flexbox-and-vertical-scroll-in-a-full-height-app
    height: 0px; 
    overflow-y: auto;
    flex: 1 1 auto;
    flex-direction: column;
}
`

export const TableBodyRow = styled.tr`
  display: grid;

  transition: background-color 50ms ease-in-out;

  &[data-striped='true']:nth-child(2n) {
    background-color: ${palette.darkBlue[100]};
  }

  &[data-clickable='true'] {
    cursor: pointer;

    &:hover {
      background-color: ${palette.darkBlue[200]};
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
