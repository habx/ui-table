import * as React from 'react'

export const useScrollbarWidth = (container: HTMLElement) => {
  const scrollbarWidth = React.useRef<number>(0)
  if (!scrollbarWidth.current) {
    scrollbarWidth.current = container
      ? container.offsetWidth - container.clientWidth
      : 0
  }

  return scrollbarWidth.current
}
