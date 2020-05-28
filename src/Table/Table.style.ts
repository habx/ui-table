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

  --table-grid-gap: 0 12px;
`

export const TableContent = styled.table`
  display: grid;

  overflow-y: hidden;
  overflow-x: auto;
`

export const TableHead = styled.thead`
  display: block;
`

export const TableHeadRow = styled.tr`
  display: grid;
  grid-template-columns: var(--table-grid-template-columns);
  grid-gap: var(--table-grid-gap);
`

export const TableHeadCell = styled.th<{ size: number }>`
  text-align: left;
  padding: 12px;
  grid-column-end: span ${({ size }) => size};

  --table-header-font-size: 12px;
  --table-header-color: ${palette.darkBlue[400]};

  &[data-big='true'] {
    font-size: 16px;
    border-bottom: solid 1px ${palette.darkBlue[300]};
    --table-header-font-size: 16px;
    --table-header-color: ${palette.darkBlue[900]};
  }
`

export const TableBody = styled.tbody`
  // https://stackoverflow.com/questions/14962468/how-can-i-combine-flexbox-and-vertical-scroll-in-a-full-height-app
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  min-width: 100%;
  width: fit-content;
  overflow-x: hidden;
  overflow-y: auto;
`

export const TableBodyRow = styled.tr`
  display: grid;

  grid-template-columns: var(--table-grid-template-columns);
  grid-gap: var(--table-grid-gap);

  transition: background-color 50ms ease-in-out;

  &[data-striped='true']:nth-child(2n) {
    background-color: ${palette.darkBlue[100]};
  }

  &[data-active='true'] {
    background-color: ${palette.blue[100]};

    &[data-clickable='true'] {
      &:hover {
        background-color: ${palette.blue[200]};
      }
    }
  }

  &:not([data-active='true'])[data-clickable='true'] {
    &:hover {
      background-color: ${palette.darkBlue[200]};
    }
  }

  &[data-clickable='true'] {
    cursor: pointer;
  }

  &[data-section='true'] {
    position: sticky;
    top: 0;
    z-index: 1;
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

  > div {
    font-size: 16px;
    color: ${palette.darkBlue[700]};
    width: 100%;
  }
`

export const TableHeaderCellContainer = styled.div`
  display: flex;
  align-items: center;
  user-select: none;
  width: 100%;
  min-width: 0;

  font-size: var(--table-header-font-size);
  color: var(--table-header-color);

  ${alignItems}
`

export const TableHeadCellContent = styled(Text)`
  user-select: none;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  position: relative;

  > * {
    display: inline-flex;
  }

  & > span:last-child {
    padding-left: 8px;
  }

  font-size: var(--table-header-font-size);
  color: var(--table-header-color);
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
