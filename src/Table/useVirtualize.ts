import { isEmpty } from 'lodash'
import * as React from 'react'

const useVirtualize = <D extends {}>({ skip }: { skip: boolean }) => {
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
    return () => window.removeEventListener('resize', handleResize)
  }, [dimensions, skip])

  return {
    scrollContainerRef,
    firstItemRef,
    initialized: !isEmpty(dimensions),
    ...dimensions,
  }
}

export default useVirtualize
