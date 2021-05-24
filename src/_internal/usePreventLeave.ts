import * as React from 'react'

export const usePreventLeave = (preventLeave: boolean) => {
  React.useEffect(() => {
    if (preventLeave) {
      const preventNavigation = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
      window.addEventListener('beforeunload', preventNavigation, false)
      return () => {
        window.removeEventListener('beforeunload', preventNavigation)
      }
    }
  }, [preventLeave])
}
