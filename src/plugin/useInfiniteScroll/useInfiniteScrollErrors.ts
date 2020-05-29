export const FORBIDDEN_PLUGIN_NAMES = [
  'usePagination',
  'useExpanded',
  'useOrderBy',
]
export class ForbiddenPluginError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ForbiddenPluginError'
  }
}
