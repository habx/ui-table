import { memoize } from 'lodash'
import * as ReactTable from 'react-table'

import { TableInstance } from '../../types/Table'

import {
  FORBIDDEN_PLUGIN_NAMES,
  ForbiddenPluginError,
} from './useInfiniteScrollErrors'

export const useInfiniteScroll = <D extends {}>(hooks: ReactTable.Hooks<D>) => {
  hooks.useInstance.push(useInstance)
}

const useInstance = <D extends {}>(
  rawInstance: ReactTable.TableInstance<D>
) => {
  const instance = rawInstance as TableInstance<D>

  const pluginNames = instance.plugins.map((plugin) => plugin.pluginName)
  FORBIDDEN_PLUGIN_NAMES.forEach((forbiddenPluginName) => {
    if (pluginNames.includes(forbiddenPluginName)) {
      throw new ForbiddenPluginError(
        `${forbiddenPluginName} is not compatible with useInfiniteScroll`
      )
    }
  })
  instance.infiniteScroll = true
  if (instance.loadMore) {
    instance.loadMore = memoize(instance.loadMore)
  }
}

useInfiniteScroll.pluginName = 'useInfiniteScroll'
