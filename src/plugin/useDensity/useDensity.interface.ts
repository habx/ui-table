export type Densities = 'low' | 'medium' | 'high'

export interface UseDensityOptions {}

export interface UseDensityInstanceProps {
  setDensity: (density: Densities) => void
}

export interface UseDensityColumnProps {}

export interface UseDensityState {
  density: Densities
}
