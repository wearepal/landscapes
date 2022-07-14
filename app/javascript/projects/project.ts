import { Layer } from './layers'

export interface Project {
  name: string
  layers: Record<number, Layer>
  allLayers: number[]
  selectedLayer?: number
}
