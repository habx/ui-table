import { isEmpty } from 'lodash'
import * as React from 'react'

import { TableInstance } from '../../types/Table'

interface UseVirtualizeConfig {
  virtualized?: boolean
  rowsHeight?: number
}

export const useVirtualize = <D extends object>(
  instance: TableInstance<D>,
  config: UseVirtualizeConfig
) => {
  const scrollContainerRef = React.useRef<HTMLTableSectionElement>(null)

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
      React.startTransition(() =>
        setDimensions({
          height: scrollContainerRef.current?.clientHeight,
          width: scrollContainerRef.current?.clientWidth,
          itemSize: config.rowsHeight,
        })
      )
    }

    const handleResize = () => React.startTransition(() => setDimensions({}))

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [config.rowsHeight, dimensions, skip])

  return {
    scrollContainerRef,
    initialized: !isEmpty(dimensions),
    ...dimensions,
  }
}
