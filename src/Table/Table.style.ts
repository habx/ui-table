import styled, { css } from 'styled-components'

import { palette, Text, theme } from '@habx/ui-core'

const alignItems = css`
  &[data-align='center'] {
    justify-content: center;
  }

  &[data-align='left'] {
    justify-content: flex-start;
  }

  &[data-align='right'] {
    justify-content: flex-end;
  }
`

export const TableContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  overflow: hidden;

  height: 100%;
  width: 100%;
`

export const TableContent = styled.table`
  display: flex;
  flex-direction: column;

  overflow-x: auto;

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
  &[data-scrollable='true'] {
    height: 100%;
    overflow: auto;
  }
  &[data-scrollable='true'][data-pagination='false'] {
    // https://stackoverflow.com/questions/14962468/how-can-i-combine-flexbox-and-vertical-scroll-in-a-full-height-app
    display: flex;
    flex-direction: column;
    height: 0;
    min-width: 100%;
    width: fit-content;
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1 1 auto;
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

  &[data-section='true'] {
    position: sticky;
    top: 0;
    background-color: ${theme.color('background')};
    border-bottom: solid 1px ${theme.color('secondary', { opacity: 0.1 })};
  }
`

export const TableCell = styled.td`
  padding: 12px;
  display: flex;
  overflow: hidden;

  &[data-density='low'] {
    padding: 18px 12px;
  }

  &[data-density='high'] {
    padding: 6px 12px;
  }

  ${alignItems};
`

export const TableHeadCellContent = styled(Text)`
  display: flex;
  align-items: center;
  user-select: none;

  & > span:last-child {
    margin-left: 8px;
  }

  ${alignItems}
`

export const TableHeaderCellSort = styled.div`
  margin-top: 6px;
`

export const TableOptionBar = styled.div`
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const ExpandToggleContainer = styled.span`
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const NoDataContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;

  justify-content: center;
  align-items: center;
`
