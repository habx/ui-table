export interface UseControlledFiltersOptions<D extends {}> {
  onFiltersChange?: (filters: any) => void
  filters?: any[]
  /**
   * Ignore empty array & value so it does not send [] to the server
   * An empty filter value is removed from table filters
   */
  shouldIgnoreEmptyFilter?: boolean
}

export interface UseControlledFiltersInstanceProps<D extends {}>
  extends UseControlledFiltersOptions<D> {}
