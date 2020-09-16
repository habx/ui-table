import { SortingRule } from 'react-table'

export interface UseControlledSortByOptions<D extends {}> {
  onSortByChange?: (sortBy: SortingRule<D>[]) => void
  sortBy?: SortingRule<D>[]
}

export interface UseControlledSortByInstanceProps<D extends {}>
  extends UseControlledSortByOptions<D> {}
