import { isEmpty } from 'lodash'
import * as React from 'react'

import { TableInstance } from '../../types/Table'

interface UseVirtualizeConfig {
  virtualized?: boolean
}

export const useVirtualize = <D extends object>(
  instance: TableInstance<D>,
  config: UseVirtualizeConfig
) => {
  const scrollContainerRef = React.useRef<HTMLTableSectionElement>(null)
  const firstItemRef = React.useRef<HTMLTableRowElement>(null)

  const [dimensions, setDimensions] = React.useState<{
    height?: number
    width?: number
    itemSize?: number
  }>({})

  const skip =
    (!config.virtualized && !instance.infiniteScroll) ||
    instance.rows.length === 0
  React.useEffect(() => {
    if (!skip && isEmpty(dimensions)) {
      setDimensions({
        height: scrollContainerRef.current?.clientHeight,
        width: scrollContainerRef.current?.clientWidth,
        itemSize: firstItemRef.current?.clientHeight,
      })
    }

    const handleResize = () => setDimensions({})

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [dimensions, skip])

  return {
    scrollContainerRef,
    firstItemRef,
    initialized: !isEmpty(dimensions),
    ...dimensions,
  }
}
