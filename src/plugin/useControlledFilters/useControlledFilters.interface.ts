export interface UseControlledFiltersOptions<D extends {}> {
  onFiltersChange?: (filters: any) => void
  filters?: any[]
}

export interface UseControlledFiltersInstanceProps<D extends {}>
  extends UseControlledFiltersOptions<D> {}
