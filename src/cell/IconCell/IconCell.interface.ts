import * as React from 'react'

export default interface IconCellProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon: string
  label?: string
  color?: string
  large?: boolean
}
