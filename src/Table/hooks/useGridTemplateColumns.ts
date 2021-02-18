import * as React from 'react'
import { PluginHook } from 'react-table'

import { ColumnInstance } from '../../types/Table'

type UseGridTemplateColumnsConfig = {
  plugins: PluginHook<any>[]
  columns: ColumnInstance<any>[]
}

const DEFAULT_COLUMN_WIDTH = 100

export const useGridTemplateColumns = ({
  plugins,
  columns,
}: UseGridTemplateColumnsConfig) => {
  const hasRowSelectPlugin = plugins.some(
    (plugin) => plugin.pluginName === 'useRowSelect'
  )

  return React.useMemo(() => {
    const flatColumns = columns.flatMap((column) => column?.columns ?? column)

    return `${hasRowSelectPlugin ? '45px' : ''} ${flatColumns
      .map(({ minWidth, maxWidth }) => {
        const screenWidth =
          typeof window === 'object' ? window.innerWidth : 10000
        const realMaxWidth =
          maxWidth && maxWidth > screenWidth ? '1fr' : `${maxWidth}px`
        return `minmax(${
          minWidth
            ? `${minWidth}px`
            : `${
                maxWidth && maxWidth < DEFAULT_COLUMN_WIDTH
                  ? maxWidth
                  : DEFAULT_COLUMN_WIDTH
              }px`
        }, ${realMaxWidth})`
      })
      .join(' ')}`
  }, [columns, hasRowSelectPlugin])
}
