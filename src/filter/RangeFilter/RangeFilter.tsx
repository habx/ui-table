import { isFunction } from 'lodash'
import * as React from 'react'
import styled from 'styled-components'

import {
  TogglePanel,
  menuDefaultPositionSetter,
  TogglePanelStyleSetter,
  theme,
  inputStyle,
  Slider,
  SliderProps,
} from '@habx/ui-core'

import { ColumnInstance } from '../../types/Table'

const togglePanelStyleSetter: TogglePanelStyleSetter = (
  dimensions,
  triggerDimensions
) =>
  menuDefaultPositionSetter({
    menuHeight: dimensions.height,
    menuWidth: dimensions.width,
    position: 'vertical',
    triggerDimensions,
  })

const RangeFilterTrigger = styled.div`
  ${inputStyle};

  border: solid 1px ${theme.neutralColor(300)};
  background-color: ${theme.color('background')};

  position: relative;
  color: ${theme.textColor()};
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 36px;
`

const RangeFilterPanel = styled.div`
  padding: 0 60px 24px 24px;
  min-width: 360px;
`

export const RangeFilter: React.FunctionComponent<RangeFilterProps> = ({
  column,
  tooltipFormatter,
  ...rest
}) => {
  const value: Range | null = column.filterValue

  const { min, max } = React.useMemo(() => {
    let tempMin = Infinity
    let tempMax = -Infinity

    for (const row of column.preFilteredRows) {
      const rowValue = row.values[column.id]

      if (rowValue > tempMax) {
        tempMax = rowValue
      }

      if (rowValue < tempMin) {
        tempMin = rowValue
      }
    }

    return { min: tempMin, max: tempMax }
  }, [column.id, column.preFilteredRows])

  if (min >= max) {
    return null
  }

  const buildTooltip = (tooltipValue: number | null | undefined) => {
    if (tooltipValue == null) {
      return '?'
    }

    const raw = `${tooltipValue}`

    return isFunction(tooltipFormatter)
      ? tooltipFormatter(tooltipValue, raw)
      : raw
  }

  return (
    <TogglePanel
      setStyle={togglePanelStyleSetter}
      triggerElement={
        <RangeFilterTrigger>
          {buildTooltip(value?.[0])} - {buildTooltip(value?.[1])}
        </RangeFilterTrigger>
      }
    >
      {(modal) =>
        modal.state !== 'closed' && (
          <RangeFilterPanel>
            <Slider
              min={min}
              max={max}
              value={value}
              onChange={column.setFilter}
              range
              tooltipFormatter={tooltipFormatter}
              {...rest}
            />
          </RangeFilterPanel>
        )
      }
    </TogglePanel>
  )
}

type Range = [number | null, number | null]

interface RangeFilterProps
  extends Omit<
    SliderProps,
    'value' | 'range' | 'onChange' | 'min' | 'max' | 'customValues'
  > {
  column: ColumnInstance<any>
}
