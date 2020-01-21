export type Densities = 'low' | 'medium' | 'high'

export interface UseDensityOptions<D extends {}> {}

export interface UseDensityInstanceProps<D extends {}> {
  setDensity: (density: Densities) => void
}

export interface UseDensityColumnProps<D extends {}> {}

export interface UseDensityState<D extends {}> {
  density: Densities
}
