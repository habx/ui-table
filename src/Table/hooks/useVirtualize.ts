import { isEmpty } from 'lodash'
import * as React from 'react'

type UseVirtualizeConfig = {
  skip: boolean
}

export const useVirtualize = ({ skip }: UseVirtualizeConfig) => {
  const scrollContainerRef = React.useRef<HTMLTableSectionElement>(null)
  const firstItemRef = React.useRef<HTMLTableRowElement>(null)

  const [dimensions, setDimensions] = React.useState<{
    height?: number
    width?: number
    itemSize?: number
  }>({})

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
