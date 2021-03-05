import * as React from 'react'

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = React.useRef(() => {})

  React.useEffect(() => {
    savedCallback.current = callback
  })

  React.useEffect(() => {
    const tick = () => {
      savedCallback.current()
    }

    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
